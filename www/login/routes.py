from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user
from werkzeug.security import check_password_hash

from www.models import User

login_bp = Blueprint('login', __name__, url_prefix="/login")

def authenticate(class_name: str, password: str, remember: bool) -> bool:
    class_query = User.query.filter(User.username == class_name.upper()).first()
    
    if not class_query:
        return False
    
    if check_password_hash(class_query.password, password):
        login_user(class_query, remember=remember)
        return True
    
    return False

@login_bp.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        class_input = request.form['class-input']
        password_input = request.form['password-input']
        remember_checkbox = 'remember-checkbox' in request.form
        
        if authenticate(class_input, password_input, remember_checkbox):
            return redirect(url_for('index.index'))
        else:
            flash("Wrong credentials.")
            return redirect(url_for('login.login'))