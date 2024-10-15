# 

# Known errors and problems

Don't know why serving with 1 worker on gunicorn hangs with /payment/settlement/
while not with 2 or more workers or the flask-development server. Maybe using requests.get inside
settlement route causes issue or maybe any timeouts since the settlement route does bit more processing
compared to the other routes. Whether requests.get is the issue can be easily tested by removing
the requests and using the actual code of the requested route instead (so there is no requests.get).