from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import current_user, login_required

index_bp = Blueprint('index', __name__, url_prefix='/')

@index_bp.route('/')
@login_required
def index():
    return render_template("index.html")