import boto3
import time
import requests
import websocket

CONDA_EXC_CMD = "[\"stdin\", \"source activate tensorflow2_p36\\r\"]"
BASE_CMD = "[\"stdin\", \"NB_ARGS_ALGO={} NB_ARGS_EPOC={} NB_ARGS_BATCH={} NB_ARGS_LR={} NB_ARGS_PFIX={} " \
            + "jupyter nbconvert --execute --to notebook --inplace /home/ec2-user/SageMaker/{}.ipynb " \
            + "--ExecutePreprocessor.kernel_name=python3 --ExecutePreprocessor.timeout=1500\\r\"]"

class TrainHandler():
    def __init__(self):
        self.__nb_inst_name = 'ab-nb-inst-dl'
        self.__nb_inst_ml_name = 'ab-nb-inst-ml'

    def call_train_logic(self, training_meta):
        sm_client = boto3.client('sagemaker', region_name='ap-northeast-2')

        usr_name = training_meta['user']
        ml_algorithm = training_meta['algorithm']
        ai_epochs = training_meta['epochs']
        ai_batch = training_meta['batch']
        ai_learning_rate = training_meta['learning_rate']

        self.__call_dl_logic(sm_client, usr_name, ai_epochs, ai_batch, ai_learning_rate)
        self.__call_ml_logic(sm_client, usr_name, ml_algorithm)

    def __call_dl_logic(self, sm_client, usr_name, ai_epochs, ai_batch, ai_learning_rate):

        ws = self.__init_ws(sm_client, self.__nb_inst_name)
        AI_CMD = BASE_CMD.format("", ai_epochs, ai_batch, ai_learning_rate, usr_name, 'ai_training')

        # source activate tensorflow2_p36 conda virtual environment
        ws.send(CONDA_EXC_CMD)

        # execute deep learning logic
        ws.send(AI_CMD)
        print(AI_CMD)

        time.sleep(2)
        ws.close()

    def __call_ml_logic(self, sm_client, usr_name, ml_algorithm):
        ws = self.__init_ws(sm_client, self.__nb_inst_ml_name)
        ML_CMD = BASE_CMD.format(ml_algorithm, "", "", "", usr_name, 'ml_training')

        # source activate tensorflow2_p36 conda virtual environment
        ws.send(CONDA_EXC_CMD)

        # execute machine learning logic
        ws.send(ML_CMD)
        print(ML_CMD)

        time.sleep(2)
        ws.close()

    def __init_ws(self, sm_client, nb_instance_name):

        url = sm_client.create_presigned_notebook_instance_url(NotebookInstanceName=nb_instance_name)['AuthorizedUrl']

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

        return ws