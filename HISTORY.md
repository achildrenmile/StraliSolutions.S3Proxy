
1.0.0 / 2018-01-28
==================
* Use log4JS as logging component
* Logging to console configured
* Errorhandling added --> error in request will not cause to stop the server any more
* AWS credential configuration also possible by using environment variables. If AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set, 
the credentials will be loaded from environment. In case the configuration is not set, the credentials will be loaded using ./config/cred.json.
* Remove Knox library and add AWS-SDK for supporting http pipelining --> streaming to save ressources on nodejs server side.
* add cred.json for storing the credentials to connect to AWS
* remove S3.Connction from default.json and production.json as it is not needed any more
* handling of buckets directly in the url --> the bucket name is the first param after the domain
e.g. https://oneka-proxy-dev.cloud.pcftest.com/cf-s3-56c910ac-1a4b-4d4c-addf-b57f6f1e796a/development/a3fc9ef3-3590-4e60-a49d-e482bf172e89.jpg
Bucketname = cf-s3-56c910ac-1a4b-4d4c-addf-b57f6f1e796a
* don't allow root access to bucket to prohibit exposing bucket content information.
* Initial release