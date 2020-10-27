from flask import Flask, render_template, request
from sk_learning import SkHandler
from sm_learning import SmHandler
import json, sys, time
import requests

app = Flask(__name__)

HOST_ADDRESSS = '0.0.0.0'
PORT_NUMBER = '8080'

skhandler = SkHandler()
smhandler = SmHandler()

@app.route('/learning', methods=['POST'])
def sm_learning():
    img_meta = request.get_json(force=True)

    __put_s3(img_meta)
    __call_sm_training()

    return "hi"

@app.route('/sklearn', methods=['POST'])
def sk_learning():
    training_meta = request.get_json(force=True)

    __call_sk_training(training_meta)

def __put_s3(img_meta):
    print('in put_s3 function')
    url = 'https://t912mdh9s0.execute-api.ap-northeast-2.amazonaws.com/ab-dev/uploadimg'
    
    myobj = img_meta
    json_val = json.dumps(myobj)
    response = requests.post(url, data=json_val)
    print(response.text)
    print(response)

    return response.text

def __call_sm_training():
    smhandler.call_sm_training()

def __call_sk_training(training_meta):
    skhandler.construct(training_meta)
    skhandler.training_test()


if __name__ == '__main__':
    app.run(HOST_ADDRESSS, PORT_NUMBER)

