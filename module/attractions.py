import database
from flask import *
from flask_restful import Resource

class Search(Resource):
    def get(self):
        try:    
            page=int(request.args.get("page","0"))
            keyword=request.args.get("keyword","")
        except:
            error=jsonify({
                "error":True,
                "message":"type Wrong"
            })
            error.status_code="500"
            error.headers["Content-Type"] = "application/json"
            error.headers["Access-Control-Allow-Origin"] = "*"
            return error

        if keyword == "":
            try:
                connection=database.DBconnect().get_connection()
                cursor=connection.cursor()
                cursor.execute("SELECT COUNT(id) FROM attractions")
                IDnum=cursor.fetchone()

                cursor.execute("SELECT * FROM attractions LIMIT %s,12 ",[page*12]) 
                result=cursor.fetchall()
                data=[]
                for i in result:
                    data1={"id":i[0],
                            "name":i[1],
                            "category":i[2],
                            "description":i[3],
                            "address":i[4],
                            "transport":i[5],
                            "mrt":i[6],
                            "lat":i[7],
                            "lng":i[8],
                            "images":json.loads(i[9]),
                        }
                    data.append(data1)
                if page < IDnum[0]/12-1:
                    data=jsonify({
                        "nextPage":page+1,
                        "data":data
                    })
                    data.headers["Content-Type"] = "application/json"
                    data.headers["Access-Control-Allow-Origin"] = "*"
                    return data
                elif page >= IDnum[0]//12:
                    data=jsonify({
                        "nextPage":None,
                        "data":data
                    })
                    data.headers["Content-Type"] = "application/json"
                    data.headers["Access-Control-Allow-Origin"] = "*"
                    return data
            except:
                error=jsonify({
                "error":True,
                "message":"Server Error"
                })
                error.status_code="500"
                error.headers["Content-Type"] = "application/json"
                error.headers["Access-Control-Allow-Origin"] = "*"
                return error
            finally:
                cursor.close()
                connection.close()

        if keyword != "":
            try:
                connection=database.DBconnect().get_connection()
                cursor=connection.cursor()
                cursor.execute("SELECT COUNT(id) FROM attractions WHERE category=%s OR LOCATE( %s ,name)",[keyword,keyword])
                IDnum=cursor.fetchone()

                cursor.execute("SELECT * FROM attractions WHERE category=%s OR LOCATE( %s ,name) LIMIT %s,12 ",[keyword,keyword,page*12]) 
                result=cursor.fetchall()
                data=[]
                for i in result:
                    data1={"id":i[0],
                            "name":i[1],
                            "category":i[2],
                            "description":i[3],
                            "address":i[4],
                            "transport":i[5],
                            "mrt":i[6],
                            "lat":i[7],
                            "lng":i[8],
                            "images":json.loads(i[9]),
                        }
                    data.append(data1)
                if page < IDnum[0]/12-1:
                    data=jsonify({
                        "nextPage":page+1,
                        "data":data
                    })
                    data.headers["Content-Type"] = "application/json"
                    data.headers["Access-Control-Allow-Origin"] = "*"
                    return data
                elif page >= IDnum[0]//12:
                    data=jsonify({
                        "nextPage":None,
                        "data":data
                    })
                    data.headers["Content-Type"] = "application/json"
                    data.headers["Access-Control-Allow-Origin"] = "*"
                    return data
            except:
                print("Connection Error")
            finally:
                cursor.close()
                connection.close()
class SearchID(Resource):
    def get(self,attractionID):
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor() 
            cursor.execute("SELECT * FROM attractions WHERE id=%s",[attractionID])
            data=cursor.fetchone()
            if data != None:
                data=jsonify({"data":{
                    "id":data[0],
                    "name":data[1],
                    "category":data[2],
                    "description":data[3],
                    "address":data[4],
                    "transport":data[5],
                    "mrt":data[6],
                    "lat":data[7],
                    "lng":data[8],
                    "images":json.loads(data[9]),
                }})
                data.headers["Content-Type"] = "application/json"
                data.headers["Access-Control-Allow-Origin"] = "*"
                return data
            else:
                error=jsonify({
                "error":True,
                "message":"ID Wrong"
            })
            error.status_code="400"
            error.headers["Content-Type"] = "application/json"
            error.headers["Access-Control-Allow-Origin"] = "*"
            return error
        except:
                error=jsonify({
                "error":True,
                "message":"Server Error"
            })
                error.status_code="500"
                error.headers["Content-Type"] = "application/json"
                error.headers["Access-Control-Allow-Origin"] = "*"
                return error
        finally:
            cursor.close()
            connection.close()
class SearchCategory(Resource):
    def get(self):
        try:
            connection=database.DBconnect().get_connection()
            cursor=connection.cursor()
            cursor.execute("SELECT DISTINCT(category) FROM attractions")
            result=cursor.fetchall()
            data=[]
            for i in result:
                data1=i[0]
                data.append(data1)
            data=jsonify({
                "data":data
            })
            data.headers["Content-Type"] = "application/json"
            data.headers["Access-Control-Allow-Origin"] = "*"
            return data

        except:
                error=jsonify({
                "error":True,
                "message":"Server Error"
            })
                error.status_code="500"
                error.headers["Content-Type"] = "application/json"
                error.headers["Access-Control-Allow-Origin"] = "*"
                return error
        finally:
            cursor.close()
            connection.close()


    
        


print("OK")