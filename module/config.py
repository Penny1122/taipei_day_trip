import configparser
config = configparser.ConfigParser()
config.read("secretKey.ini")

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
    def TapPay(self):
        configTapPayKey=config["TapPay"]
        TapPayKey={
            "APP_ID":configTapPayKey["APP_ID"],
            "App_Key":configTapPayKey["App_Key"],
            "Merchant_ID":configTapPayKey["Merchant_ID"],
            "Partner_Key":configTapPayKey["Partner_Key"]
        }
        return TapPayKey
secretKey=secretKey()