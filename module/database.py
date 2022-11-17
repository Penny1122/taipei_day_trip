import mysql.connector

def DBconnect():
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        host="localhost",
        user="root",
        password="free4321",
        database="taipeitrip",
        pool_name = "mypool",
        pool_size = 5,
        pool_reset_session = True,
    )
    return connection_pool