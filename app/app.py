from flask import Flask, render_template

app = Flask(__name__)

HOST_ADDRESSS = '0.0.0.0'
PORT_NUMBER = '8080'

# @app.route('/')
# def index():
#     return "index"

# @app.route('/learning', methods=['POST'])
# def learning():
#     value = request.form['value']
#     print('in')
#     print(value)
#     return 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/learning')
def learning():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(HOST_ADDRESSS, PORT_NUMBER)

