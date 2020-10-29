from flask import Flask, render_template, request
from sk_learning import SkHandler
from sm_learning import SmHandler
from learning import TrainHandler
import json, sys, time
import requests

app = Flask(__name__)

HOST_ADDRESSS = '0.0.0.0'
PORT_NUMBER = '8080'

skhandler = SkHandler()
smhandler = SmHandler()
train_handler = TrainHandler()

@app.route('/puts3', methods=['POST'])
def put_s3():
    img_meta = request.get_json(force=True)

    response = __put_s3(img_meta)
    # __call_sm_training()

    return response.text

@app.route('/learning', methods=['POST'])
def learning():
    training_meta = request.get_json(force=True)
    print(training_meta)

    __call_learning(training_meta)

def __put_s3(img_meta):
    url = 'https://t912mdh9s0.execute-api.ap-northeast-2.amazonaws.com/ab-dev/uploadimg'
    
    myobj = img_meta
    json_val = json.dumps(myobj)
    response = requests.post(url, data=json_val)

    return response

def __call_learning(training_meta):
    train_handler.call_train_logic(training_meta)

if __name__ == '__main__':
    app.run(HOST_ADDRESSS, PORT_NUMBER)

