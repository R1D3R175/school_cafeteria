from flask import Blueprint, jsonify, request

from www.models import Food, Drink

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

@api_bp.route('/handle_order', methods=["POST"])
def handle_order():
    return request.form