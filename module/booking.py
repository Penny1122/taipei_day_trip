import database
from flask import *
from flask_bcrypt import *
from flask_restful import Resource
from config import secretKey
import jwt

JWTkey=secretKey.jwtconfig()

connection=database.DBconnect().get_connection()
cursor=connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS booking (id BIGINT PRIMARY KEY AUTO_INCREMENT, userId BIGINT NOT NULL, attractionId INT NOT NULL, date DATE NOT NULL, time VARCHAR(255) NOT NULL, price BIGINT NOT NULL,FOREIGN KEY (attractionId) REFERENCES attractions (id),FOREIGN KEY (userId) REFERENCES users (id));")
cursor.close()
connection.close()

class bookingModel(Resource):
    def post(self):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統，請登入系統"
            })
            response.status_code="403"
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        decoded_jwt=jwt.decode(JWTcookie, JWTkey, algorithms="HS256")
        userId=(decoded_jwt["id"])
        attractionId=request.json["attractionId"]
        date=request.json["date"]
        time=request.json["time"]
        price=(request.json["price"])
        if date == "":
            response=jsonify({
                "error": True,
                "message": "建立失敗，請輸入日期"
            })
            response.status_code="400"
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        try:    
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
            cursor.execute("SELECT * FROM booking WHERE userId=%s AND attractionId=%s AND date=%s AND time=%s AND price=%s",[userId,attractionId,date,time,price])
            result=cursor.fetchone()
            if result != None:
                response=jsonify({
                "error": True,
                "message": "已有相同預定行程"
                })
                response.status_code="400"
                response.headers["Access-Control-Allow-Origin"] = "*"
                return response
            cursor.execute("INSERT INTO booking (userId, attractionId, date, time, price) VALUES (%s, %s, %s, %s, %s)",[userId,attractionId,date,time,price])
            connection.commit()
            response=jsonify({
                "ok":True
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

    def get(self):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt=jwt.decode(JWTcookie, JWTkey, algorithms="HS256")
        userId=(decoded_jwt["id"])
        try:    
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor(dictionary=True)
            cursor.execute("SELECT attractions.id,attractions.name,attractions.address,attractions.images, booking.date, booking.time, booking.price FROM booking INNER JOIN attractions ON attractions.id=booking.attractionId WHERE booking.userId = %s;",[userId])
            result=cursor.fetchall()
            if result == []:
                response=jsonify({
                    "data":None
            })
                return response
            data=[]
            for i in result:
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
            response=jsonify({
                    "data":data
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

    def delete(self):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt=jwt.decode(JWTcookie, JWTkey, algorithms="HS256")
        userId=(decoded_jwt["id"])
        attractionId=request.json["attractionId"]
        date=request.json["date"]
        time=request.json["time"]
        try:    
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor(dictionary=True)
            cursor.execute("DELETE FROM booking WHERE userId=%s AND attractionId=%s AND date=%s AND time=%s ",[userId,attractionId,date,time])
            connection.commit()
            response=jsonify({
                "ok":True
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
