from flask import Flask, render_template, request
from sk_learning import SkHandler
from boto3_test import put_object_test
import requests, json, sys

app = Flask(__name__)

HOST_ADDRESSS = '0.0.0.0'
PORT_NUMBER = '8080'

skhandler = SkHandler()

@app.route('/learning', methods=['POST'])
def learning():
    training_meta = request.get_json(force=True)

    # skhandler.construct(training_meta)
    # skhandler.training_test()
    # print(type(training_meta))
    # print(training_meta)

    put_s3(training_meta)
    # numpyTest(training_meta)
    # put_object_test(training_meta)

    return "hi"

{
    'class1' : {
        'id' : 1,
        'name' : "Class1",
        'sampleCnt' : 0,
        'capShowHTML': null,
        'gatBoxHTML' : null,
        'imgSrc': []
    },
    'class2' : {
        'id' : 2,
        'name' : "Class2",
        'sampleCnt' : 0,
        "capShowHTML": null,
        "gatBoxHTML": null,
        'imgSrc': []
    }
}

def put_s3(training_meta):
    print('in')
    url = 'https://t912mdh9s0.execute-api.ap-northeast-2.amazonaws.com/ab-dev/uploadimg'
    print(len(training_meta.values().values()['imgSrc']))
    
    print('size : ', size)
    myobj = training_meta
    # header = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    json_val = json.dumps(myobj)
    response = requests.post(url, data=json_val)
    print(response.text)

    return response.text

if __name__ == '__main__':
    app.run(HOST_ADDRESSS, PORT_NUMBER)

