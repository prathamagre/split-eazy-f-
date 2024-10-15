import requests, json

backendURL = "http://127.0.0.1:5000"

listOfTests = (
    ('listing/createListing', 'POST', {'name':'Test Listing', 'description':'Dummy Description', 'participants': ['A', 'B']}),
    ('listing/getAllListings', 'GET', {}),
    ('listing/editListing', 'POST', {'listingID':1,'newName':'Name Changed', 'newParticipants':['C',"D"]}),
    ('listing/deleteListing', 'POST', {'listingID':5}),

    ('payment/addRecord', 'POST', {"listingID":1, "amount": 100, "paidFor":["A", "B", "C", "D"], "description":"Test Record", "paidBy":"A"}),
    ('payment/deleteRecord', 'POST', {"listingID":3, "paymentID":1}),
    ('payment/getAllRecords', 'GET', {"listingID":3}),
    ('payment/editRecord', 'POST', {"listingID":1, "paymentID":2, "paidBy":"A", "description":"Edited with payment/editRecord"}),
    ('payment/settlement', 'GET', {"listingID":1})
    
)

for test in listOfTests:
    print('Requesting {} ...'.format(test[0]))
    try:
        if test[1] == 'GET':
            res = requests.get("{}/{}".format(backendURL, test[0]), json = test[2])
        else:
            res = requests.post("{}/{}".format(backendURL, test[0]), json = test[2])

        if not res.ok:
            print('-- ! --\nFailure with {} request at {}/{}. Error status - {}'.format(test[1],backendURL,test[0], res.status_code))
            if(res.status_code == 500):
                #print(res.content)
                pass
            else:print(json.loads(res.content)['message'],'\n-------')
        #else:
        #    print(json.loads(res.content))
    except:
        print('---!---\nError with {} request at {}/{}\n-------'.format(test[1],backendURL,test[0]))

print('TEST COMPLETE.')