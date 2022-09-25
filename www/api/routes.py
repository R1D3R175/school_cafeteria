from flask import Blueprint

from www.models import Food


api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/get_foods')
def get_foods():
    pass