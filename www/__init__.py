from flask import Flask
from flask_login import LoginManager

from www.models import db
from www.models import User

from www.index.routes import index_bp
from www.login.routes import login_bp

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    app.register_blueprint(index_bp, url_prefix='/')
    app.register_blueprint(login_bp, url_prefix='/login')

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = "login.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app