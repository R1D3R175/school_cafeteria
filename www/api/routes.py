from flask import Blueprint, jsonify

from www.models import Food, Drink

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/get_foods')
def get_foods():
    return jsonify(food=Food.query.all())

@api_bp.route('/get_foods/<int:id>')
def get_food_by_id(id):
    return jsonify(food=Food.query.filter(Food.id == id).first())

@api_bp.route('/get_drinks')
def get_drinks():
    return jsonify(drink=Drink.query.all())

@api_bp.route('/get_drinks/<int:id>')
def get_drink_by_id(id):
    return jsonify(drink=Drink.query.filter(Drink.id == id).first())