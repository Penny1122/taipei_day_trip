import mysql.connector
from config import secretKey

def DBconnect():
    databaseKey=secretKey.dbconfig()
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        **databaseKey
    )
    return connection_pool