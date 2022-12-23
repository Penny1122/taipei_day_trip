from flask import *
from flask_restful import Api
from flask_bcrypt import Bcrypt
import sys
sys.path.append("module")
from module.attractions import Search, SearchID, SearchCategory
from module.users import userSignup,userAuth
from module.booking import bookingModel
from module.order import orderModel, orderStatusModel, historicalOrderModel


app=Flask(__name__,static_folder="public",static_url_path="/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))
app.config["JSON_SORT_KEYS"]=False
api = Api(app)
bcrypt = Bcrypt(app)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/order/<orderId>")
def order(orderId):
	return render_template("order.html")
@app.route("/myorder/<userId>")
def allorder(userId):
	return render_template("historical-orders.html")


api.add_resource(Search,"/api/attractions")
api.add_resource(SearchID,"/api/attraction/<attractionID>")
api.add_resource(SearchCategory,"/api/categories")
api.add_resource(userSignup, "/api/user")
api.add_resource(userAuth, "/api/user/auth")
api.add_resource(bookingModel, "/api/booking")
api.add_resource(orderModel, "/api/orders")
api.add_resource(orderStatusModel, "/api/order/<orderNumber>")
api.add_resource(historicalOrderModel, "/api/myorder/<userNumber>")

app.run(host="0.0.0.0", port=3000, debug=True)