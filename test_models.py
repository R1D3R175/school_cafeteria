from werkzeug.security import generate_password_hash
from www import create_app

from www.models import *
def create_basic():
    db.drop_all()
    db.create_all()

    user_test = User(username="5AINF", password=generate_password_hash("prova"), is_worker=True, is_admin=True)
    db.session.add(user_test)

    food_test = [
        Food(name="Siciliana al Salame", price=1),
        Food(name="Hot Dog", price=1.30),
        Food(name="Pizza", price=1.30),
        Food(name="Pizza solo formaggio", price=1.30),
        Food(name="Cipollina", price=1.30),
    ]
    db.session.add_all(food_test)

    drink_test = [
        Drink(name="Pepsi", price=1.25),
        Drink(name="Sprite", price=1.23)
    ]
    db.session.add_all(drink_test)

    db.session.commit()
    return user_test

def create_order_for(user):
    order = Order(user_id=user.id)
    db.session.add(order)

    db.session.commit()

    food_list = []
    for i in range(5):
        food_list.append(FoodInOrder(order=order, food_id=i))

    db.session.add_all(food_list)
    db.session.commit()

    for t in food_list:
        print(t)

    return order

def get_user_orders(user: User):
    return Order.query.filter(Order.id == user.id).all()


def main():
    app = create_app()
    app.app_context().push()
    
    user_test = create_basic()
    order_test = create_order_for(user_test)
    print(get_user_orders(order_test))

if __name__ == "__main__":
    main()