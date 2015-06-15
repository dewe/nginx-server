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

**config:** `string` Path to configuration file

**prefix:** `string` Set nginx path prefix, i.e. a directory that will keep server files. 

**globals:** `[string]` String array of global configuration directives.

**command:** `string` Nginx executable (default: 'nginx').

**log:** `function` Pass in function for logging nginx output. 