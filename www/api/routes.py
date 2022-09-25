from flask import Blueprint, jsonify

from www.models import Food, Drink

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/get_foods')
def get_foods():
    return jsonify(food=Food.query.all())

@api_bp.route('/get_drinks')
def get_drinks():
    return jsonify(drink=Drink.query.all())