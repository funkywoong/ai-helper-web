from flask import Flask, render_template, request
from sk_learning import SkHandler

app = Flask(__name__)

HOST_ADDRESSS = '0.0.0.0'
PORT_NUMBER = '8080'

skhandler = SkHandler()

@app.route('/learning', methods=['POST'])
def learning():
    training_meta = request.get_json(force=True)

    skhandler.construct(training_meta)
    skhandler.training_test()

    return "hi"

if __name__ == '__main__':
    app.run(HOST_ADDRESSS, PORT_NUMBER)

