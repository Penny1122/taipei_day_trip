import database
from flask import *
from flask_bcrypt import *
from flask_restful import Resource
from config import secretKey
import jwt
from datetime import *
import requests
import re

JWTkey=secretKey.jwtconfig()
TapPayKey = secretKey.TapPay()
Merchant_ID = TapPayKey["Merchant_ID"]
Partner_Key = TapPayKey["Partner_Key"]

connection=database.DBconnect().get_connection()
cursor=connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS order_form (id BIGINT PRIMARY KEY AUTO_INCREMENT, orderId BIGINT NOT NULL, userId BIGINT NOT NULL, attractionId INT NOT NULL,date DATE NOT NULL, time VARCHAR(255) NOT NULL, price BIGINT NOT NULL, paymentTime VARCHAR(255) NOT NULL,contact_name VARCHAR(255) NOT NULL, contact_email VARCHAR(255) NOT NULL, contact_phone VARCHAR(255) NOT NULL,status VARCHAR(255), FOREIGN KEY (attractionId) REFERENCES attractions (id), FOREIGN KEY (userId) REFERENCES users (id));")
cursor.close()
connection.close()

class orderModel(Resource):
    def post(self):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統，請登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt=jwt.decode(JWTcookie, JWTkey, algorithms="HS256")
        userId=(decoded_jwt["id"])
        tz = timezone(timedelta(hours=+8))
        now = datetime.now(tz)
        payment_time = now.strftime("%Y-%m-%d %H:%M:%S")
        orderId = now.strftime("%Y%m%d%H%M%S") + str(userId)
        data = request.get_json()
        total_price = data["order"]["price"]
        prime=data["prime"]
        trip=data["order"]["trip"]
        contact = data["order"]["contact"]
        contact_name = contact["name"]
        contact_email = contact["email"]
        contact_phone = contact["phone"]
        checkName=re.match("^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,20}$",contact_name)
        checkEmail=re.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",contact_email)
        checkPhone=re.match("^(09)[0-9]{8}$",contact_phone)
        if not checkName or not checkEmail or not checkPhone:
            response=jsonify({
            "error":True,
            "message":"聯絡資訊未填寫完整，訂單建立失敗"
            })
            response.status_code="400"
            return response
        try: 
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
            for i in trip:
                attractionId = i["attraction"]["id"]
                date = i["date"]
                time = i["time"]
                price = 2000
                if time == "afternoon":
                    price = 2500
                cursor.execute("INSERT INTO order_form (orderId, userId, attractionId, date, time, price, paymentTime, contact_name, contact_email, contact_phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",[orderId,userId,attractionId,date,time,price, payment_time,contact_name,contact_email, contact_phone])
            cursor.execute("DELETE FROM booking WHERE userId=%s",[userId])
            connection.commit()
            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            headers = {
                "Content-Type": "application/json",
                "x-api-key": Partner_Key
                }
            body={
                "prime": prime,
                "partner_key": Partner_Key,
                "merchant_id": Merchant_ID,
                "details":"TapPay Test",
                "amount": total_price,
                "cardholder": {
                    "phone_number": contact_phone,
                    "name": contact_name,
                    "email": contact_email,
                },
                "remember": False
            }
            tapPay_response = requests.post(url, headers=headers, json=body).json()
            if tapPay_response["status"] == 0:
                cursor.execute("UPDATE order_form SET status=%s WHERE orderId=%s",["success",orderId])
                connection.commit()
                response=jsonify({
                    "data": {
                        "number": orderId,
                        "payment": {
                            "status": tapPay_response["status"],
                            "message": "付款成功"
                        }
                    }
                })
                return response
            response=jsonify({
                "data": {
                    "number": orderId,
                    "payment": {
                        "status": tapPay_response["status"],
                        "message": "付款失敗"
                    }
                }
            })
            return response
        except:
            response=jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            })
            response.status_code="500"
            return response
        finally:
            cursor.close()
            connection.close()

class orderStatusModel(Resource):
    def get(self, orderNumber):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統，請登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt=jwt.decode(JWTcookie, JWTkey, algorithms="HS256")
        userId=(decoded_jwt["id"])
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor(dictionary=True)
            cursor.execute("SELECT order_form.*, attractions.id, attractions.name, attractions.address, attractions.images FROM order_form INNER JOIN attractions ON attractions.id=order_form.attractionId WHERE order_form.userId =%s AND order_form.orderId=%s",[userId, orderNumber])
            result=cursor.fetchall()
            if result == []:
                response=jsonify({
                    "data":None
                })
                return response
            data=[]
            total_price=0
            for i in result:
                contact_name=i["contact_name"]
                contact_email=i["contact_email"]
                contact_phone=i["contact_phone"]
                status = i["status"]
                list={
                    "attraction":{
                        "id":i["id"],
                        "name":i["name"],
                        "address":i["address"],
                        "image":json.loads(i["images"])[0]
                    },
                    "date": str(i["date"]),
                    "time": i["time"],
                    "price": i["price"]
                }
                data.append(list)
                total_price+=i["price"]
            response=jsonify({
                "data":{
                    "number": orderNumber,
                    "price": total_price,
                    "trip":data,
                    "contact": {
                        "name": contact_name,
                        "email": contact_email,
                        "phone": contact_phone
                    },
                    "status": status
                }
            })
            return response
        except:
            response=jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            })
            response.status_code="500"
            return response
        finally:
            cursor.close()
            connection.close()
