import boto3
import time
import requests
import websocket
# from websock.web import websocket
# from botocore.vendored import requests
BASE_CMD = "[\"stdin\", \"" \
            + "jupyter nbconvert --execute --to notebook --inplace /home/ec2-user/SageMaker/{}.ipynb " \
            + "--ExecutePreprocessor.kernel_name=python3 --ExecutePreprocessor.timeout=1500\\r\"]"

# def lambda_handler(event, context):
def call_sm_training():
    sm_client = boto3.client('sagemaker')
    notebook_instance_name = 'ab-nb-inst'
    url = sm_client.create_presigned_notebook_instance_url(NotebookInstanceName=notebook_instance_name)['AuthorizedUrl']

    url_tokens = url.split('/')
    http_proto = url_tokens[0]
    http_hn = url_tokens[2].split('?')[0].split('#')[0]
    
    s = requests.Session()
    r = s.get(url)
    cookies = "; ".join(key + "=" + value for key, value in s.cookies.items())

    ws = websocket.create_connection(
        "wss://{}/terminals/websocket/1".format(http_hn),
        cookie=cookies,
        host=http_hn,
        origin=http_proto + "//" + http_hn
    )
    test1 = BASE_CMD.format('svm', '50', '', '', '', 'test')
    test2 = BASE_CMD.format('', '', '124', '0.001', 'data', 'ai_training')
    test3 = BASE_CMD.format('ai_training')
    print(test3)

    # ws.send("[\"stdin\", \"source activate tensorflow2_p36\\r\"]")
    # ws.send(test1)
    # ws.send(test3)

    tmp = '50'
    int_tmp = int(tmp)
    print(type(int_tmp))

    tmp_f = '50.5'
    flot_tmp_f = float(tmp_f)
    print(type(flot_tmp_f))
    time.sleep(2)

    ws.close()

    return None

if __name__ == "__main__":
    call_sm_training()