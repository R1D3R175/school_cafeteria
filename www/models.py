from dataclasses import dataclass

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    """
        Pass this:
        username: str
        password: str (hash)

        is_worker: bool
        is_admin: bool
    """

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True, unique=True, nullable=False)
    username = db.Column(db.String(31), unique=True, nullable=False)
    password = db.Column(db.String(102), nullable=False)
    order = db.relationship("Order", backref="user")

    is_worker = db.Column(db.Boolean, default=False) # For the Cafeteria workers
    is_admin = db.Column(db.Boolean, default=False) # For me

    def __repr__(self):
        return f"<User ID: {self.id}>"

class Order(db.Model):
    """
        Pass this:
        user_id: int|User
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True, unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def __repr__(self):
        return f"<Order ID: {self.id}>"

class FoodInOrder(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True, unique=True, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    order = db.relationship("Order", foreign_keys=[order_id])

    food_id = db.Column(db.Integer, db.ForeignKey('food.id'))
    food = db.relationship("Food", foreign_keys=[food_id])

    drink_id = db.Column(db.Integer, db.ForeignKey('drink.id'))
    drink = db.relationship("Drink", foreign_keys=[drink_id])

    def __repr__(self):
        return (
            f"<FoodInOrder ID: {self.id}>\n"
            f"    Order: {self.order}\n"
            f"    Food: {self.food}\n"
            f"    Drink: {self.drink}\n"
        )

@dataclass
class Food(db.Model):
    """
        Pass this:
        name: str
        price: float
    """
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True, unique=True, nullable=False)
    name: str = db.Column(db.String(31), nullable=False)
    price: float = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Food ID: {self.id} ({self.name})>"

@dataclass
class Drink(db.Model):
    """
        Pass this:
        name: str
        price: float
    """
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True, unique=True, nullable=False)
    name: str = db.Column(db.String(31), nullable=False)
    price: float = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Drink ID: {self.id} ({self.name})>"