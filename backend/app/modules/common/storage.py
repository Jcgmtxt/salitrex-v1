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
        self.bucket = settings.S3_BUCKET

    def upload_file(self, file_content: bytes, object_name: str, content_type: Optional[str] = None) -> Optional[str]:
        """
        Uploads a file to S3 and returns the public URL.
        """
        if not self.bucket:
            logger.error("S3_BUCKET is not configured.")
            return None

        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            # Note: Depending on bucket policy, you might need ACL='public-read'
            # But usually it's better to use IAM policies or generate signed URLs.
            # For this MVP, we assume the bucket allows public read or uses a policy.
            
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=object_name,
                Body=file_content,
                **extra_args
            )
            
            url = f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{object_name}"
            return url
            
        except ClientError as e:
            logger.error(f"Error uploading to S3: {e}")
            return None

storage = S3Storage()
