from flask import Blueprint, jsonify, request, Response
from flask_login import login_required, current_user

from www.models import Food, Drink, Order, FoodInOrder, db

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/get/food/')
def get_foods():
    return jsonify(food=Food.query.all())

@api_bp.route('/get/food/<int:id>')
def get_food_by_id(id):
    return jsonify(food=Food.query.filter(Food.id == id).first())

@api_bp.route('/get/food/<int_list:values>')
def exclude_foods(values):
    return jsonify(food=Food.query.filter(Food.id.not_in(values)).all())

@api_bp.route('/get/drink/')
def get_drinks():
    return jsonify(drink=Drink.query.all())

@api_bp.route('/get/drink/<int:id>')
def get_drink_by_id(id):
    return jsonify(drink=Drink.query.filter(Drink.id == id).first())

@api_bp.route('/get/drink/<int_list:values>')
def exclude_drinks(values):
    return jsonify(drink=Drink.query.filter(Drink.id.not_in(values)).all())

@login_required
@api_bp.route('/handle_order', methods=["POST"])
def handle_order():
    try:
        # TODO: Verify if user has already order, if so
        #       check if it's expired, if not 400 status
        json_request = request.get_json()

        order = Order(user=current_user)
        db.session.add(order)

        for food_json in json_request["food"]:
            food = Food.query.filter(Food.id == food_json["id"]).first()
            food_in_order = FoodInOrder(order=order, food=food, amount=food_json["amount"])

            db.session.add(food_in_order)

        for drink_json in json_request["drink"]:
            drink = Drink.query.filter(Drink.id == drink_json["id"]).first()
            drink_in_order = FoodInOrder(order=order, drink=drink, amount=drink_json["amount"])

            db.session.add(drink_in_order)
    except:
        return Response(status=400)
            
    db.session.commit()
    return Response(status=200)

# TODO: Implement cafeteria worker