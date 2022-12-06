import configparser
config = configparser.ConfigParser()
config.read("secret.ini")

class secretKey():
    def dbconfig(self):
        configData=config["database"]
        databaseKey = {
        "host" : configData["host"],
        "database" : configData["database"],
        "user" : configData["user"],
        "password" : configData["password"],
        "pool_name" : configData["pool_name"],
        "pool_size" : int(configData["pool_size"]),
        "pool_reset_session" : configData["pool_reset_session"],
        }
        return databaseKey
    def jwtconfig(self):
        configKey=config["jwt_key"]
        key=configKey["key"]
        return key
secretKey=secretKey()