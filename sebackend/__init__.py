from flask import Flask

def create_app(test_config = None):
    app = Flask(__name__, instance_relative_config = True)

    from . import listing, payment
    app.register_blueprint(listing.bp)
    app.register_blueprint(payment.bp)

    return app
