import json
import mysql.connector

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    host="localhost",
    user="root",
    password="free4321",
    database="taipeitrip",
    pool_name = "mypool",
    pool_size = 5,
    pool_reset_session = True,
)

src="C:/taipei_day_trip/data/taipei-attractions.json"
file=open(src, "r", encoding="utf-8")
data=json.load(file)
clist=data["result"]["results"]
for i in clist:
    name=i["name"]
    category=i["CAT"]
    description=i["description"]
    address=i["address"].replace(" ","")
    transport=i["direction"]
    mrt=i["MRT"]
    lat=i["latitude"]
    lng=i["longitude"]
    images=i["file"].lower().replace("https"," https").split()
    list=[]
    for x in images:
        if x.endswith(("jpg", "png")):
            list.append(x)
    list=json.dumps(list,ensure_ascii=False)
    try:
        connection=connection_pool.get_connection()
        cursor=connection.cursor()
        insert="INSERT INTO attractions (name,category,description,address,transport,mrt,lat,lng,images) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        value=(name,category,description,address,transport,mrt,lat,lng,list)
        cursor.execute(insert, value)
        connection.commit()
    except:
            print("Unexpected Error")
    finally:
        cursor.close()
        connection.close()