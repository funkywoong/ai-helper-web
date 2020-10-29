import boto3
import time
import requests
import websocket

class SmHandler():
    def __init__(self):
        self.__sm_client = boto3.client('sagemaker')
        self.__nb_inst_name = 'ab-nb-inst'

    def call_sm_training(self, training_meta):
        
        url = self.__sm_client.create_presigned_notebook_instance_url(NotebookInstanceName=self.__nb_inst_name)['AuthorizedUrl']

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

        ws.send("[\"stdin\", \"source activate tensorflow2_p36\\r\"]")
        ws.send("[ \"stdin\", \"NB_ARGS=data jupyter nbconvert --execute --to notebook --inplace /home/ec2-user/SageMaker/custom_training.ipynb --ExecutePreprocessor.kernel_name=python3 --ExecutePreprocessor.timeout=1500\\r\" ]")
        
        time.sleep(2)

        ws.close()

        return None
