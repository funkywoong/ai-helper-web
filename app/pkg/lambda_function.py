import json
import base64
import boto3
from botocore.exceptions import ClientError

s3 = boto3.resource('s3')
bucket = 'ab-aihelper-bucket'

def decoding_img_rb(data_uri):
    encoded_img_b64 = data_uri.split(',')[1]
    decoded_img = base64.b64decode(encoded_img_b64)
    
    # return numpy array
    return decoded_img

def lambda_handler(event, context):
    
    for val in event.values():
        file_cnt = 0
        for src in val['imgSrc']:
            key = "data/{}_{}.png".format(val['name'], file_cnt)
            tar_obj = s3.Object(bucket, key)
            response = tar_obj.put(Body=decoding_img_rb(src))
            print(response)

            file_cnt += 1
    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('d')
    }
