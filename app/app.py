from flask import Flask, render_template, request
from learning import TrainHandler
import json, sys, time
import requests

app = Flask(__name__)

HOST_ADDRESSS = '0.0.0.0'
PORT_NUMBER = '8080'

train_handler = TrainHandler()

@app.route('/puts3', methods=['POST'])
def put_s3():
    img_meta = request.get_json(force=True)

    return __put_s3(img_meta)

@app.route('/learning', methods=['POST'])
def learning():
    print('in learning')
    training_meta = request.get_json(force=True)

    if training_meta['user'] == None:
        return {
            'statusCode': 404,
            'message': 'Please set user configuration'
        }

    print(training_meta)

    __call_learning(training_meta)

    return __is_train_complete(training_meta)

@app.route('/inference', methods=['POST'])
def inference():
    print('in inference')
    inference_meta = request.get_json(force=True)

def __is_train_complete(training_meta):
    url = 'https://t912mdh9s0.execute-api.ap-northeast-2.amazonaws.com/ab-dev/traincomplete'

    myobj = training_meta
    json_val = json.dumps(myobj)
    response = requests.get(url, data=json_val)

    return response.text

def __put_s3(img_meta):
    url = 'https://t912mdh9s0.execute-api.ap-northeast-2.amazonaws.com/ab-dev/uploadimg'
    
    myobj = img_meta
    json_val = json.dumps(myobj)
    response = requests.post(url, data=json_val)

    return response.text

def __call_learning(training_meta):
    train_handler.call_train_logic(training_meta)

if __name__ == '__main__':
    app.run(HOST_ADDRESSS, PORT_NUMBER)

