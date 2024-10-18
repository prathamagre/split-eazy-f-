from flask import Flask
from flask_cors import CORS

def create_app(test_config = None):
    app = Flask(__name__, instance_relative_config = True)

    from . import listing, payment
    app.register_blueprint(listing.bp)
    app.register_blueprint(payment.bp)

    CORS(app)
    return app
