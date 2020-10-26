import json
import numpy as np
import base64
import boto3
from botocore.exceptions import ClientError
from PIL import Image
from io import BytesIO

s3 = boto3.client('s3')
bucket = 'ab-aihelper-bucket'

cls_names = []
cls_img_list = []

def decoding_img(data_uri):
    encoded_img_b64 = data_uri.split(',')[1]
    decoded_img = Image.open(BytesIO(base64.b64decode(encoded_img_b64)))
    decoded_img = np.array(decoded_img)
    
    # return numpy array
    return decoded_img

def s3_upload():
    file_cnt = 0
    for each_np_arr in cls_img_list:
        key = "/data/{}_{}.png".format(cls_names[file_cnt], file_cnt)
        
        response = s3.put_object(
            Body=each_np_arr.tobytes(),
            Bucket=bucket,
            Key=key
        )
        # im = Image.fromarray(each_np_arr)
        file_cnt += 1

    return response

def lambda_handler(event):
    
    for val in event.values():
        for src in val['imgSrc']:
            cls_img_list.append(decoding_img(src))
            cls_names.append(val['name'])
    
    response = s3_upload()
    print(response)
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

if __name__ == "__main__":
    
    lambda_handler()