import database
from flask import *
from flask_restful import Resource

connection=database.DBconnect().get_connection()
cursor=connection.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS users(id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);")
cursor.close()
connection.close()

class userSignup(Resource):
    def post(self):
        try:
            name=request.form["name"]
            email=request.form["email"]
            password=request.form["password"]
        except:
            error=jsonify({
            "error":True,
            "message":"Requset Error"
            })
            error.status_code="500"
            error.headers["Content-Type"] = "application/json"
            error.headers["Access-Control-Allow-Origin"] = "*"
            return error
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
        except:
            error=jsonify({
            "error":True,
            "message":"Connection Error"
            })
            error.status_code="500"
            error.headers["Content-Type"] = "application/json"
            error.headers["Access-Control-Allow-Origin"] = "*"
            return error