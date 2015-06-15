# nginx-server
Utility for starting and stopping an Nginx server.

## Example

```javascript
var nginx = require('nginx-server');

var options = {
    config: '/Users/dewe/github/nginx-server/test/stubs/nginx.conf',
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

__config:__ Path to configuration file

__prefix:__ Set nginx path prefix, i.e. a directory that will keep server files. 

__globals:__ String array of global configuration directives.

__command:__ Nginx executable (default: 'nginx').

__log:__ Pass in function for logging nginx output. 