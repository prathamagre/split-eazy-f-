from flask import Blueprint, request, jsonify
import datetime, json

bp = Blueprint('listing', __name__, url_prefix = '/listing')

@bp.route('/createListing', methods = ['POST'])
def createListing():
    '''
        Send a POST request to create a new listing.

        Accepts JSON -
        {
            "name": type string, name of the listing, must,
            "description": type string, descriptin of the liting, must,
            "participants": type [array of strings], participants in the listing, must
        }
        
        Returns JSON -
        {
            status: 'success'|'failure',
            message: type string
        }
    '''

    content = request.get_json()

    # reading content of the file
    with open('./data/listOfListings.json', 'r') as f:
        listOfListingsContent = json.loads(f.read())

    # Adding the new listing details into the listOfListingsContent
    listOfListingsContent['lastListingID'] += 1
    content['dateOfCreation'] = str(datetime.datetime.now().strftime("%d-%b-%Y"))
    content['listingID'] = listOfListingsContent['lastListingID']
    listOfListingsContent['listings'].append(content)

    # writing the updated content to the file
    with open('./data/listOfListings.json', 'w') as f:
        f.write(json.dumps(listOfListingsContent,indent=2))

    # reading the content of the payments.json file
    with open('./data/payments.json', 'r') as f:
        paymentsContent = json.loads(f.read())

    # adding the storage structure for the new listing in paymentsContent
    paymentsContent[int(listOfListingsContent['lastListingID'])] = {'lastPaymentID':0,'payments':[]}

    # writing the updated content to payments.json file
    with open('./data/payments.json', 'w') as f:
        f.write(json.dumps(paymentsContent, indent=2))

    return jsonify({'status':'success', 'message':''}), 200

@bp.route('/getAllListings', methods = ['GET'])
def getAllListings():
    '''
        Send a GET request to get a list of all the listings.

        Accepts - None
        Returns JSON -
        {
            'listings': [ array with each value like -
                {
                    "name": type string,
                    "description": type string,
                    "participants": array of strings,
                    "dateOfCreation": type string, example "12-Oct-2024",
                    "listingID": type int
                }
            ]
        }

    '''

    with open('./data/listOfListings.json', 'r') as f:
        listOfListingContent = json.loads(f.read())

    l = listOfListingContent['listings']
    # sorting in descending order, so latest entry appears on top
    l.sort(key=lambda x: x["listingID"], reverse=True)
    return jsonify({'listings':l})

@bp.route('/editListing', methods = ['POST'])
def editListing():
    '''
        Send a POST request to edit a listing's details.

        Accepts JSON - 
        {
            "listingID": type int, must,
            "newName": type string, optional,
            "newDescription": type string, optional,
            "newParticipants": type array of strings, optional
        }
        
        Returns JSON - 
        {
            status: 'success'|'failure',
            message: type string
        }
    '''

    requestContent = request.get_json()

    try:
        listingID = requestContent['listingID']
    except KeyError:
        return jsonify({'status':'failure', 'message':'listingID not provided in POSTed JSON.'}), 400
    
    listOfListingsContent = None

    # reading the content of listOfListings.json file
    with open('./data/listOfListings.json', 'r') as f:
        listOfListingsContent = json.loads(f.read())

    # finding the position of the listing in the file
    listingPosition = 0
    for row in listOfListingsContent["listings"]:
        if(row['listingID'] == listingID):
            break
        listingPosition += 1 
    else:
        return jsonify({'status':'failure', 'message':'listingID {} not found.'.format(requestContent['listingID'])}), 400

    # updating the content
    if('newName' in requestContent.keys()):
        listOfListingsContent['listings'][listingPosition]['name'] = requestContent["newName"]
    if('newDescription' in requestContent.keys()):
        listOfListingsContent['listings'][listingPosition]['description'] = requestContent["newDescription"]
    if('newParticipants' in requestContent.keys()):
        for newParticipant in requestContent['newParticipants']:
            if newParticipant not in listOfListingsContent['listings'][listingPosition]['participants']:
                listOfListingsContent['listings'][listingPosition]['participants'].append(newParticipant)

    # writing the updated content to the file
    with open('./data/listOfListings.json', 'w') as f:
        f.write(json.dumps(listOfListingsContent, indent=2))

    return jsonify({'status':'success', 'message':''}), 200

@bp.route('/deleteListing', methods = ['POST'])
def deleteListing():
    '''
        Send a POST request to delete a listing with listingID.

        Accepts JSON -
        {
            "listingID": type int, the listing to be deleted
        }

        Returns JSON -
        {
            status: 'success'|'failure',
            message: type string
        }
    '''

    requestContent = request.get_json()
    try:
        listingID = requestContent['listingID']
    except KeyError:
        return jsonify({'status': 'failure', 'message':'listingID not provided in POSTed JSON.'}), 400
    
    # reading the content of listOfListings.json file
    with open('./data/listOfListings.json', 'r') as f:
        listOfListingsContent = json.loads(f.read())

    count = 0
    for listing in listOfListingsContent['listings']:
        if(listing['listingID']==listingID):
            break
        count += 1
    else:
        return jsonify({'status': 'failure', 'message':'listingID not found in data.'}), 400
    
    # removing the listing's data from listOfListings
    del listOfListingsContent['listings'][count]

    # writing the updated content to listOfListings.json file
    with open('./data/listOfListings.json', 'w') as f:
        f.write(json.dumps(listOfListingsContent,indent=2))

    # reading the payments.json file
    with open('./data/payments.json', 'r') as f:
        paymentsData = json.loads(f.read())

    # removing the listings payment details and structure from payments
    del paymentsData[str(listingID)]

    # writing the updated payments to file
    with open('./data/payments.json', 'w') as f:
        f.write(json.dumps(paymentsData, indent=2))

    return jsonify({'status':'failure', 'message':'listingID:{} deleted successfully.'.format(listingID)}), 200
