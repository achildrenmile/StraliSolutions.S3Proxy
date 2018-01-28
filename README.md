StraliSolutions.S3Proxy
===================================

LICENSE: MIT

Introduction
------------

Node-config organizes hierarchical configurations for your app deployments.

StraliSolutions.S3 is a S3 proxy nodejs app for public read access.

It forwards content of a private s3 bucket to the requester publicly by using pipelining mechanism.

Configurations are stored in ./config/default.json. 

Quick Start
---------------
The following examples are in JSON format, but configurations can be in other [file formats](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-formats).

**Configuration**
```json
{
    "CachingHeader": {
      "header":"Cache-Control",
      "value": "public, max-age=31557600"
    },
    "HeaderMapping": {
      ".ico": "image/x-icon",
      ".html": "text/html",
      ".js": "text/javascript",
      ".json": "application/json",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".wav": "audio/wav",
      ".mp3": "audio/mpeg",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword"
    }
  }
```
CachingHeader...defines header for cache control. Note: in the default configuration, this header is set to 31557600=one year.
HeaderMapping...this will b used to define the metadata type of the content returned to the client. In case the file extension cannot be mapped, it will use
text/plain.

**Authentication Configuration** (see http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html)
There are 2 ways of setting the AWS credentials for the oneka-proxy. The first method is to use the environment variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION. In case these variables are not set, the oneka-proxy will use the configuration provided in ./config/cred.json. In case AWS_REGION is not set in any configuration the parameter will be ignored (AWS can handle this without region information on several locations except China).

The content ./config/cred.json is defined as follows:
```json
{ "accessKeyId": "ACCESSKEYID", "secretAccessKey": "SECRETACCESSKEY", "region": "AWS_REGION" }
```

**Logger configuration**
As logger component log4s is used. Currently the logger is configured to log to console. Additonal log capabilities can be enabled using log appender. For more information see https://www.npmjs.com/package/log4js. 

**Run in development system**
At first it must be ensured that Node.js is installed on the dev system. You can download it under https://nodejs.org/en/download/.

For installing all needed libraries and dependencies use

```shell
$ npm install
```

```shell
$ node ./server.js [Optional: Portnumber]
```
If the app is deployed to a cloud foundry environment, Portnumber parameter will be ignored. If you don't spefify a port number, port 80 will be taken as default.

**Push to cloud foundry environment**

```shell
$ cf push <ApplicationContainerName>  -c "node server.js" -b https://github.com/cloudfoundry/nodejs-buildpack
```

Used Licenses
-------

**Node-Config**
[MIT license](https://raw.githubusercontent.com/lorenwest/node-config/master/LICENSE).

**AWS-SDK**
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

**log4js**
[Apache 2.0](http://spdx.org/licenses/Apache-2.0.html)



