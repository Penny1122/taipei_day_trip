import database
from flask import *
from flask_restful import Resource
from flask_bcrypt import *
from config import secretKey
from verify import *
import jwt

key=secretKey.jwtconfig()

class Member_system(Resource):
    def patch(self):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統，請登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt = jwt.decode(JWTcookie, key, algorithms="HS256")
        user_id = decoded_jwt["id"]
        user_email = decoded_jwt["email"]
        name = request.json["name"]
        check_name=valid_name(name)
        if not check_name:
            response=jsonify({
                "error": True,
                "message": "姓名需為2-20個中、英文字"
            })
            response.status_code="400"
            return response
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
            cursor.execute("UPDATE users SET name = %s WHERE email = %s AND id = %s", [name, user_email, user_id])
            connection.commit()
            JWT = {
                "id":user_id,
                "name":name,
                "email":user_email
            }
            encoded_jwt = jwt.encode(JWT,key,algorithm="HS256")
            response = make_response(jsonify({
                    "ok":True,
            }))
            response.set_cookie("token",value=encoded_jwt, max_age=604800)
            return response
        except:
            response=jsonify({
            "error":True,
            "message":"Connection Error"
            })
            response.status_code="500"
            return response
        finally:
            cursor.close()
            connection.close()

    def post(self):
        JWTcookie = request.cookies.get("token")
        if JWTcookie == None:
            response=jsonify({
                "error": True,
                "message": "未登入系統，請登入系統"
            })
            response.status_code="403"
            return response
        decoded_jwt = jwt.decode(JWTcookie, key, algorithms="HS256")
        user_id = decoded_jwt["id"]
        user_email = decoded_jwt["email"]
        origin_password = request.json["originPassword"]
        new_password = request.json["newPassword"]
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor(dictionary = True)
            cursor.execute("SELECT password FROM users WHERE id = %s AND email = %s",[user_id, user_email])
            result=cursor.fetchone()
            check_password = check_password_hash(result["password"], origin_password)
            if not check_password:
                response=jsonify({
                "error": True,
                "message": "原密碼輸入錯誤"
            })
                response.status_code="400"
                return response
            check_password = valid_password(new_password)
            if not check_password:
                response=jsonify({
                    "error": True,
                    "message": "密碼需為6-12個字元或數字"
                })
                response.status_code="400"
                return response
            password = generate_password_hash(new_password).decode('utf-8')
            cursor.execute("UPDATE users SET password = %s WHERE email = %s AND id = %s", [password, user_email, user_id])
            connection.commit()
            response=jsonify({
                "ok":True
            })
            return response
        except:
            response=jsonify({
            "error":True,
            "message":"Connection Error"
            })
            response.status_code="500"
            return response
        finally:
            cursor.close()
            connection.close()