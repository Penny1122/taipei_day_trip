import database
from flask import *
from flask_bcrypt import *
from flask_restful import Resource
from config import secretKey
import jwt
from datetime import *
import requests
from verify import *
# import re

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
        userId=decoded_jwt["id"]
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
        check_name=valid_name(contact_name)
        check_email=valid_email(contact_email)
        check_phone=valid_phone(contact_phone)
        if not check_name or not check_email or not check_phone:
            response=jsonify({
            "error":True,
            "message":"請填寫聯絡資訊。"
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
                payment_time=i["paymentTime"]
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
                    "payment_time": payment_time,
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

class historicalOrderModel(Resource):
    def get(self, userNumber):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統，請登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt = jwt.decode(JWTcookie, JWTkey, algorithms="HS256")
        userId = (decoded_jwt["id"])
        if int(userNumber) == int(userId):
            try:
                connection=database.DBconnect().get_connection()
                cursor=connection.cursor(dictionary=True)
                cursor.execute("SELECT DISTINCT(orderId), paymentTime, contact_name, contact_email, contact_phone,status FROM order_form WHERE userId = %s",[userNumber])
                result=cursor.fetchall()
                totalList=[]
                for i in result:
                    orderId = i["orderId"]
                    cursor.execute("SELECT order_form.*, attractions.id, attractions.name, attractions.address, attractions.images FROM order_form INNER JOIN attractions ON attractions.id=order_form.attractionId WHERE order_form.userId =%s AND order_form.orderId = %s",[userNumber,orderId])
                    clist=cursor.fetchall()
                    if clist == []:
                        response=jsonify({
                            "data":None
                        })
                        return response
                    data=[]
                    total_price=0
                    for x in clist:
                        contact_name=x["contact_name"]
                        contact_email=x["contact_email"]
                        contact_phone=x["contact_phone"]
                        payment_time=x["paymentTime"]
                        status = x["status"]
                        list={
                            "attraction":{
                                "id":x["id"],
                                "name":x["name"],
                                "address":x["address"],
                                "image":json.loads(x["images"])[0]
                            },
                            "date": str(x["date"]),
                            "time": x["time"],
                            "price": x["price"]
                        }
                        total_price+=x["price"]
                        data.append(list)
                    list2={
                        "number": i["orderId"],
                        "total_price": total_price,
                        "payment_time": i["paymentTime"],
                        "trip":data,
                        "contact": {
                            "name": i["contact_name"],
                            "email": i["contact_email"],
                            "phone": i["contact_phone"]
                        },
                        "status": i["status"]
                    }
                    totalList.append(list2)

                    response=jsonify({
                    "data":totalList
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
