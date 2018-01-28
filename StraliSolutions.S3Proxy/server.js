const http = require('http');
const url = require('url');
const path = require('path');
const port = process.env.VCAP_APP_PORT || process.argv[2] || 80;
const config=require('config');
var log4js = require( "log4js" );
log4js.configure( "./config/log4js.json");
var logger = log4js.getLogger("app");

var server=http.createServer(function (req, res) {
  //block favicon
  if (req.url === '/favicon.ico') {
        res.statusCode=204;
        res.end();
  }
  else
  {//Not a favicon - so here we go
  
        logger.info(`${req.method} ${req.url}`);

        // parse URL
        const parsedUrl = url.parse(req.url);
        // extract URL path
        let pathname = `.${parsedUrl.pathname}`.replace('.','');
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...

        logger.info(pathname);

        //secure the pathname
        pathname = pathname.replace(/^(\.)+/, '.');

        if(pathname.toLowerCase().indexOf('.js')!==-1 || pathname==='/') {
              res.statusCode = 404;
              res.end(`Not found.`);
              logger.error(`Access to ${pathname} blocked`);
          }
        //***end secure the pathname*/

        const ext = path.parse(pathname).ext;

        // maps file extention to MIME typere
        const map = config.get('HeaderMapping');

        logger.info(pathname);

        const urlpartslength=pathname.split('/').length;

        if(urlpartslength<2)
        {
          res.statusCode = 404;
          res.end("Error in path");
          logger.error("Error in path");
        }

        const S3BucketName=pathname.split('/')[1]; //2nd portion of url parameter must be the bucketname
        const filepath=pathname.replace("http://","").replace("https://","").replace("/"+S3BucketName+"/","");

        var AWS = require('aws-sdk');

        logger.info("Credentials: " + AWS.config.credentials);

        if(!AWS.config.credentials) {//no environment for AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set, take credential configuration
          AWS.config.loadFromPath('./config/cred.json');
          logger.info("Credentials loaded from cred.json")
        }
        else {
          logger.info("Credentials loaded from environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY was set)")
        }

        const region=process.env.AWS_REGION;
        
        if(region) {
          AWS.config.update({region: region});
          logger.info("Region set per environment variable");
        }
        else {
          logger.info("Region set per json file");
        }

        logger.info("AWS Region: " + AWS.config.region);

        var s3 = new AWS.S3();
        var params = {Bucket: S3BucketName, Key: filepath};

        var rs=s3.getObject(params).createReadStream();
     
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.setHeader(config.get('CachingHeader.header'),config.get('CachingHeader.value'));
        
        rs.pipe(res);
        
        rs.on('error', function(err) 
        { 
           res.statusCode = 500;
           res.setHeader('Content-type','text/plain');
           res.end("Error. Check your ressource request URI. In case you need further help contact the DevOps team.");
           logger.error("Error in S3 getObject: " + err.code);
        });;
 }

}).listen(parseInt(port));

server.on('error', function (e) {
  // Handle your error here
  res.statusCode=500;
  res.end("Server error");
  logger.fatal(e);
});

logger.info(`Server listening on port ${port}`);