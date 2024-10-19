from flask import Blueprint, request, jsonify, url_for
import json, datetime, requests

bp = Blueprint('payment', __name__, url_prefix = '/payment')


@bp.route('/addRecord', methods = ('POST',))
def addRecord():
    '''
        Send a POST request to add a payment record.

        Accepts JSON -
        {
            "listingID": type int, the listing to which payment it to be added
            "amount": type float,
            "paidBy": type string, one of the participants,
            "description": type string,
            "paidFor": array of string, each one belongs to participants
        }
        Returns JSON -
        {
            "status": "success"|"failure",
            "message": type string
        }
    '''
    requestContent = request.get_json()
    try:
        listingID = str(requestContent['listingID'])
    except KeyError:
        return jsonify({'status': 'failure', 'message': 'listingID not found in POSTed JSON.'}), 400

    # reading the payments.json file
    with open('./data/payments.json', 'r') as f:
        paymentsData = json.loads(f.read())

    try:
        paymentsData[listingID]['lastPaymentID'] += 1
    except KeyError:
        return jsonify({'status': 'failure', 'message': 'Given listingID not present in payments data.'}), 400

    # converting the requestContent to the record format
    del requestContent['listingID']
    requestContent['dateOfPayment'] = str(datetime.datetime.now().strftime("%d-%b-%Y"))
    requestContent['paymentID'] = paymentsData[listingID]['lastPaymentID']

    # adding the new record to payments data
    paymentsData[listingID]['payments'].append(requestContent)

    # writing the updated data to file
    with open('./data/payments.json', 'w') as f:
        f.write(json.dumps(paymentsData, indent = 2))

    return jsonify({'status': 'success', 'message': 'Record addd.'}), 200

@bp.route('/deleteRecord', methods = ('POST',))
def deleteRecord():
    '''
        Send a POST request to delete a payment record with paymentID.

        Accepts JSON -
        {
            "listingID": type int, they listing in which payment lies,
            "paymentID": type int, the paymentID to be deleted
        }

        Returns JSON -
        {
            "status": "failure"|"success",
            "message": type string
        }
    '''
    requestContent = request.get_json()

    with open('./data/payments.json', 'r') as f:
        paymentsData = json.loads(f.read())

    try:
        count = 0
        for payment in paymentsData[str(requestContent['listingID'])]['payments']:
            if(payment['paymentID'] == requestContent['paymentID']):
                del paymentsData[str(requestContent['listingID'])]['payments'][count]
                break
            count += 1
        else:
            return jsonify({'status':'failure', 'message':'Requested paymentID not found.'}), 400
    except KeyError:
        return jsonify({'status':'failure', 'message':'Requested listingID not found.'}), 400
    
    with open('./data/payments.json','w') as f:
        f.write(json.dumps(paymentsData, indent=2))

    return jsonify({'status':'success', 'message':'paymentID deleted successfully.'}), 200

@bp.route('/getAllRecords', methods = ('POST',))
def getAllRecords():
    '''
        Send a POST request to get all the payment records for a listingID.

        Accepts JSON -
        {
            "listingID": type int,
        }

        Returns JSON -
        {
            "payments": [array with each item like following -
                {
                    "amount": 100.1,
                    "paidFor": ["A","B"],
                    "description": "Test Record",
                    "paidBy": "A",
                    "dateOfPayment": "14-Oct-2024",
                    "paymentID": 14
                }
            ]
        }
    '''
    requestContent = request.get_json()
    try:
        listingID = str(requestContent['listingID'])
    except KeyError:
        return jsonify({"status":"failure", "message":"listingID not in POSTed JSON."}),400

    with open('./data/payments.json', 'r') as f:
        paymentsData = json.loads(f.read())

    try:
        return jsonify({"payments":paymentsData[listingID]['payments']}), 200
    except KeyError:
        return jsonify({"status":"failure", "message":"listingID not found in payments data."}),400
    
@bp.route('/editRecord', methods = ('POST',))
def editRecord():
    '''
        Send a POST request to edit a payment record.

        Accepts JSON -
        {
            "listingID": type int, must,
            "paymentID": type int, must,
            "amount": type float, optional,
            "paidFor": [list of strings, new list of participants to replace earlier ones], optional,
            "description": type string, new description, optional
            "paidBy": type string, new paidBy, optional
            "dateOfPayment": type string (like "14-Oct-2024"), new dateOfPayment, optional
        }

        Returns JSON -
        {
            "status": "failure"|"success",
            "message": type string
        }
    '''
    requestContent = request.get_json()
    try:
        listingID = requestContent['listingID']
        paymentID = requestContent['paymentID']
    except KeyError:
        return jsonify({"status":"failure", "message":"listingID and/or paymentID not provided in request."}), 400

    del requestContent['listingID'], requestContent['paymentID']

    with open('./data/payments.json', 'r') as f:
        paymentsData = json.loads(f.read())

    try:
        count = 0
        for payment in paymentsData[str(listingID)]['payments']:
            if(payment['paymentID'] == paymentID):
                break
            count += 1
        else:
            return jsonify({"status":"failure", "message":"paymentID not found."}), 400
    except KeyError:
        return jsonify({"status":"failure", "message":"listingID not found."}), 400
    
    for key in requestContent.keys():
        paymentsData[str(listingID)]['payments'][count][key] = requestContent[key]

    with open('./data/payments.json', 'w') as f:
        f.write(json.dumps(paymentsData, indent = 2))

    return jsonify({"status":"success", "message":"paymentID updated sucessfully."}), 200
    
@bp.route('/settlement', methods = ('POST',))
def settlement():
    '''
        Send a POST request to get settlement data for a listingID.

        Accepts JSON -
        {
            "listingID": type int
        }

        Returns JSON -
        {
            "settlement": [
                (<from:string>, <to:string>, <amount:float>),
                (<from:string>, <to:string>, <amount:float>),
                (<from:string>, <to:string>, <amount:float>)
            ]
        }

        - Author: Abhijeet Verma
        - Algorithm Author: Abhijeet Verma

    '''

    # getting the listingID from the request
    try:
        listingID = request.get_json()['listingID']
    except KeyError:
        return jsonify({"status": "failure", "message":"listingID not found in POSTed JSON."}), 400
    
    # getting the list of payments for the requested listingID
    response = requests.get(
        '{}{}'.format(request.host_url,url_for("payment.getAllRecords")),
        json={'listingID':listingID}
    )
    if not response.ok: return response.content, response.status_code
    
    paymentList = response.json()['payments']

    # getting the list of participants for the requested listingID
    response = requests.get('{}{}'.format(request.host_url, url_for("listing.getAllListings")))
    if not response.ok: return response.content, response.status_code

    participantsList = None
    for listing in response.json()['listings']:
        if(listing['listingID'] == listingID):
            participantsList = listing['participants']
            break

    # creating the toPayMatrix
    noOfParticipants = len(participantsList)
    pMap = {}
    for i in range(noOfParticipants): pMap[participantsList[i]] = i
    toPayMatrix = [[0 for i in range(noOfParticipants)] for i in range(noOfParticipants)]

    for payment in paymentList:
        splitAmount = payment['amount']/len(payment['paidFor'])
        for pfor in payment['paidFor']:
            toPayMatrix[pMap[pfor]][pMap[payment['paidBy']]] += splitAmount

    # processing the toPayMatrix (according to an algorithm)
    for k in range(noOfParticipants-2):
        for i in range(k+2,noOfParticipants):
            for j in range(k+1,i+1):
                toPayMatrix[j-1][j] += toPayMatrix[k][i]
                toPayMatrix[j][j-1] += toPayMatrix[i][k]

    # translating the processed toPayMatrix to settlement
    settlement = []
    for i in range(1,noOfParticipants):
        amount = toPayMatrix[i-1][i] - toPayMatrix[i][i-1]
        if(amount != 0): # since adding a transaction with amount 0 doens't make sense
            if(amount > 0):
                settlement.append([participantsList[i-1], participantsList[i],amount])
            else:
                settlement.append([participantsList[i], participantsList[i-1],-amount])

    # further reducing no. of transactions by unifying transactions where possible
    i = 0
    while(i<len(settlement)-1 and i+1 < len(settlement)):
        if(settlement[i][2] == settlement[i+1][2] and settlement[i][1] == settlement[i+1][0]):
            settlement.insert(i, [settlement[i][0], settlement[i+1][1], settlement[i][2]])
            del settlement[i+1], settlement[i+1]  # we want to delete i+1 and i+2 but after first deletion, i+2 is at i+1
        else:
            i+= 1

    # creating an order in which smaller payments are completed first
    settlement.sort(key=lambda x:x[2])
    
    #print('settlement after optimization - ', settlement) #DEBUG

    # !! There can be further optimization of settlement by making transactinon amounts shorter. For example, if A -> B is 500 and
    #    B -> D is 1000, we can do A -> D 500 and B -> D 500 (i.e instead of paying to B, A paid to D for B)

    return jsonify({"settlement":settlement}), 200