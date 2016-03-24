# nginx-server
Utility for starting and stopping an Nginx server. Useful when testing an nginx configuration, having a
start and stop for every test.

## Example

```javascript
var nginx = require('nginx-server');

var options = {
    config: __dirname + '/test/stubs/nginx.conf',
};

var server = nginx(options);

server.start(function () {
    console.log('started');
});

server.stop(function () {
    console.log('stopped');
});
```

## Options

**config:** `string` Path to configuration file.  
**prefix:** `string` Set nginx path prefix, i.e. a directory that will keep server files.   
**globals:** `[string]` String array of global configuration directives.  
**command:** `string` Nginx executable (default: 'nginx').  
**log:** `function` Pass in function for logging nginx output.  

# Development

## Run tests

```
docker build -f docker/Dockerfile.test -t test-nginx-server .
docker run --rm -v $(pwd):/usr/src/app -it test-nginx-server
```
