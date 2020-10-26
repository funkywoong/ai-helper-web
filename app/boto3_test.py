import logging, json
import base64
from io import BytesIO
import boto3
from botocore.exceptions import ClientError


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def get_bucket_list():
    s3_client = boto3.client('s3')
    return s3_client.list_buckets()

def put_object_test(training_meta):
    s3 = boto3.resource('s3')
    cls_names = []
    cls_img_list = []
    bucket = 'ab-aihelper-bucket'

    def decoding_img_rb(data_uri):
        encoded_img_b64 = data_uri.split(',')[1]
        # decoded_img = encoded_img_b64.encode()
        decoded_img = base64.b64decode(encoded_img_b64)
        
        # return numpy array
        return decoded_img

    def s3_upload():
        file_cnt = 0
        for each_img in cls_img_list:
            key = "data/{}_{}.png".format(cls_names[file_cnt], file_cnt)
            obj = s3.Object(bucket, key)
            response = obj.put(Body=each_img)

            file_cnt += 1

        return response

    def lambda_handler(training_meta):
        
        for val in training_meta.values():
            file_cnt = 0
            for src in val['imgSrc']:
                key = "data/{}_{}.png".format(val['name'], file_cnt)
                obj = s3.Object(bucket, key)
                response = obj.put(Body=decoding_img_rb(src))
                # cls_img_list.append(decoding_img_rb(src))
                # cls_names.append(val['name'])
                file_cnt += 1
        
        # response = s3_upload()
        print(response)
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda!')
        }

    response = lambda_handler(training_meta)
    return response
