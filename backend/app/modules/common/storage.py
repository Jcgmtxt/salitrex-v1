import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class S3Storage:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
    @property
    def bucket(self) -> Optional[str]:
        return settings.S3_BUCKET

    def upload_file(self, file_content: bytes, object_name: str, content_type: Optional[str] = None) -> Optional[str]:
        """
        Uploads a file to S3 and returns the object key (object_name).
        """
        if not self.bucket:
            logger.error("S3_BUCKET is not configured.")
            return None

        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=object_name,
                Body=file_content,
                **extra_args
            )
            
            return object_name #
            
        except ClientError as e:
            logger.error(f"Error uploading to S3: {e}")
            return None

    def get_presigned_url(self, object_name: str, expires_in: int = 3600) -> Optional[str]:
        """
        Generates a presigned URL for a private S3 object.
        """
        if not self.bucket:
            return None
            
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': object_name},
                ExpiresIn=expires_in
            )
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            return None

storage = S3Storage()
