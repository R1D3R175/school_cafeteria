from flask import Flask
from flask_login import LoginManager

from www.models import db
from www.models import User

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app