from flask import *
from flask_restful import Api
import sys
sys.path.append("module")
from module.attractions import Search

app=Flask(__name__,static_folder="public",static_url_path="/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))
api = Api(app)

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

api.add_resource(Search,"/api/attractions")

app.run(port=3000, debug=True)