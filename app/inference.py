import boto3  # AWS S3 접근용
from botocore.exceptions import ClientError
import sys, os
import pickle
from io import BytesIO
from PIL import Image
import numpy as np
import math

from tensorflow.keras.models import load_model

BUCKET_NAME = 'ab-aihelper-bucket'
BASE_DL_KEY = '{}/model/deep_learning/{}'
BASE_ML_KEY = '{}/model/machine_learning/{}'

s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')

test_event = {
    'user' : 'peter',
    'algorithm' : 'svm',
    'epochs' : 50,
    'batch' : 16,
    'learning_rate' : 0.001
}

def down_dl_model(usr):
    target_model = '{}_ai_model.h5'.format(usr)
    target_label = '{}_ai_label'.format(usr)

    model_key = BASE_DL_KEY.format(usr, target_model)
    label_key = BASE_DL_KEY.format(usr, target_label)

    # dl_model = s3_resource.Object(BUCKET_NAME, model_key).get()['Body'].read()
    tmp_model_name = 'tmp_{}_model.h5'.format(usr)
    try:
        s3_resource.Bucket(BUCKET_NAME).download_file(model_key, tmp_model_name)
    except ClientError as e:
        print(e)
    
    dl_model = load_model(tmp_model_name)
    dl_model.summary()

    os.remove(tmp_model_name)

    dl_label = s3_resource.Object(BUCKET_NAME, label_key).get()['Body'].read().decode('utf-8')
    dl_label = parse_label_txt(dl_label)

    return dl_model, dl_label

def down_ml_model(usr):
    target_model = '{}_ml_model.pkl'.format(usr)
    target_label = '{}_ml_label'.format(usr)

    model_key = BASE_ML_KEY.format(usr, target_model)
    label_key = BASE_ML_KEY.format(usr, target_label)

    ml_model = s3_resource.Object(BUCKET_NAME, model_key).get()['Body'].read()
    ml_model = pickle.loads(ml_model)

    ml_label = s3_resource.Object(BUCKET_NAME, label_key).get()['Body'].read().decode('utf-8')
    ml_label = parse_label_txt(ml_label)

    return ml_model, ml_label

def parse_label_txt(label_txt):
    label_list = [label for label in label_txt.split('\n') if label != ""]

    return label_list

def ml_predict(ml_model, ml_label, tar_img):

    tmp_tar_list = []
    tmp_tar_list.append(tar_img.flatten())

    pred_val = ml_model.predict(tmp_tar_list)

    result_obj = {
        'type': 'machine-learning',
        'result': {}
    }

    for index in range(0, len(ml_label)):
        if index == int(pred_val[0]):
            result_obj['result'][ml_label[index]] = 1
        else:
            result_obj['result'][ml_label[index]] = 0

    return result_obj

def dl_predict(dl_model, dl_label, tar_img):

    tar_img = np.reshape(tar_img, (1, 480, 640, 3))
    pred_val = dl_model.predict(tar_img)
    
    result_obj = {
        'type': 'deep-learning',
        'result': {}
    }
    print(pred_val)

    for index in range(0, len(dl_label)):
        result_obj['result'][dl_label[index]] = round(pred_val[0][index] * 100, 2)

    return result_obj

def down_tmp_img(usr):
    tmp_img = s3_resource.Object(BUCKET_NAME, 'peter/data/Class2_1.png')
    tmp_img = BytesIO(tmp_img.get()['Body'].read())
    decoded_tmp_img = np.array(Image.open(tmp_img).convert("RGB")).astype(np.float16)

    print(decoded_tmp_img.shape)

    return decoded_tmp_img

def tmp_handler(event):
    usr = event['user']

    decoded_tmp_img = down_tmp_img(usr)
    
    dl_model, dl_label = down_dl_model(usr)
    ml_model, ml_label = down_ml_model(usr)

    ml_result = ml_predict(ml_model, ml_label, decoded_tmp_img)
    dl_result = dl_predict(dl_model, dl_label, decoded_tmp_img)

    return {
        'status' : 200,
        'message' : {
            ml_result['type'] : ml_result['result'], 
            dl_result['type'] : dl_result['result']
        }
    }


# if __name__ == '__main__':
#     print(tmp_handler(test_event))
