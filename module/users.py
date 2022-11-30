import database
import re
import jwt
from flask import *
from flask_restful import Resource

key="123456789"

connection=database.DBconnect().get_connection()
cursor=connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS users(id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);")
cursor.close()
connection.close()

class userSignup(Resource):
    def post(self):
        name=request.json["name"]
        email=request.json["email"]
        password=request.json["password"]

        checkName=re.match("^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,20}$",name)
        checkEmail=re.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",email)
        checkPassword=re.match("[0-9a-zA-z]{6,12}",password)
        if checkName == None or checkEmail == None or checkPassword == None:
            response=jsonify({
            "error":True,
            "message":"註冊失敗，重複的 Email 或其他原因"
            })
            response.status_code="400"
            response.headers["Content-Type"] = "application/json"
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
            cursor.execute("SELECT * FROM users WHERE email = %s",[email])
            result=cursor.fetchone()
            if result == None:
                cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",[name,email,password])
                connection.commit()
                response=jsonify({
                        "ok":True
                })
                return response
            else:
                error=jsonify({
                    "error":True,
                    "message": "此 email 已被註冊"
                })
                error.status_code="400"
                return error
        except:
            response=jsonify({
            "error":True,
            "message":"Connection Error"
            })
            response.status_code="500"
            response.headers["Content-Type"] = "application/json"
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        finally:
            cursor.close()
            connection.close()
class userAuth(Resource):
    def put(self):
        email=request.json["email"]
        password=request.json["password"]
        checkEmail=re.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",email)
        checkPassword=re.match("[0-9a-zA-z]{6,12}",password)
        print(checkPassword)
        if checkEmail == None or checkPassword == None: 
            response=jsonify({
            "error":True,
            "message":"登入失敗，帳號或密碼格式錯誤"
            })
            response.status_code="400"
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
            cursor.execute("SELECT id, name, email FROM users WHERE email = %s AND password = %s",[email,password])
            result=cursor.fetchone()
            # print(result)
            if result != None:
                JWT={
                    "id":result[0],
                    "name":result[1],
                    "email":result[2]
                }
            # print(JWT)
                encoded_jwt = jwt.encode(JWT,key,algorithm="HS256")
                # print(encoded_jwt)
                response = make_response(jsonify({
                    "ok":True,
            }))
                response.set_cookie("token",value=encoded_jwt, max_age=604800)
                response.headers["Access-Control-Allow-Origin"] = "*"
                return response
            else:
                response=jsonify({
                "error":True,
                "message":"登入失敗，帳號或密碼錯誤或其他原因"
                })
                response.status_code="400"
                response.headers["Access-Control-Allow-Origin"] = "*"
                return response
        except:
            response=jsonify({
            "error":True,
            "message":"Connection Error"
            })
            response.status_code="500"
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        finally:
            cursor.close()
            connection.close()
    def get(self):
        JWTcookie = request.cookies.get("token")
        # print(JWTcookie)
        if JWTcookie == None:
            response=jsonify({
                "data":None
            })
            response.headers["Access-Control-Allow-Origin"] = "*"
            return response
        
        decoded_jwt=jwt.decode(JWTcookie, key, algorithms=["HS256"])
        # print(decoded_jwt)
        response = make_response(jsonify({
            "data":decoded_jwt
        }))
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    def delete(self):
        response = make_response(jsonify({
                "ok":True,
            }))
        response.delete_cookie("token")
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response