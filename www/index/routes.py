from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import current_user, login_required

index_bp = Blueprint('index', __name__, url_prefix='/')

@index_bp.route('/', methods=["GET", "POST"])
@index_bp.route('/order', methods=["GET", "POST"])
@login_required
def index():
    if request.method == "GET":
        return render_template("index.html")
    else:
        pass