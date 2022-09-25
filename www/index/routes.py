from flask import Blueprint, render_template, request
from flask_login import login_user
from werkzeug.security import generate_password_hash, check_password_hash

from www.models import User

index = Blueprint('index', __name__)

def authenticate(class_name: str, password: str, remember: bool) -> bool:
    class_query = User.query.filter(User.username.upper() == class_name.upper()).first()
    
    if not class_query:
        return False
    
    if check_password_hash(class_query.password, password):
        login_user(class_query, remember=remember)
        return True
    
    return False
        

@index.route('/')
def main():
    return render_template('index.html')

@index.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        class_input = request.form['class-input']
        password_input = request.form['password-input']
        remember_checkbox = request.form['remember-checkbox'] == "remember"
        
        if authenticate(class_input, password_input, remember_checkbox):
            return render_template('')