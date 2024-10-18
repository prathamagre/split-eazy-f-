from flask import Flask
from flask_cors import CORS

def create_app(test_config = None):
    app = Flask(__name__, instance_relative_config = True)

    from . import listing, payment
    app.register_blueprint(listing.bp)
    app.register_blueprint(payment.bp)


    # CORS - Cross Origin Resource Sharing allows the flask app to handle
    # requests from different domains. Required by the frontend app to
    # send requests from a different domain (even on localhost).
    # Here requests are allowed from the members of the origins list.
    # To allow from everywhere, remove the origins parameter at all.
    #CORS(app, origins=["http://127.0.0.1:3000", "http://127.0.0.1:5000"])
    CORS(app)

    return app
