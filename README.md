# Advanced

A simple MVC framework based on [Express](https://github.com/strongloop/express)

# Install

```
npm install advanced -g
```

# Create an application

```shell
# create demo
advanced new app
# install app
cd app
npm install
# start app
node server.js
```

Visit [http://localhost:8586](http://localhost:8586)

# Create a controller

Controllers are placed in `app/controllers`.

For example `app/controllers/test.js`:

```javascript
var Controller = require('advanced').Controller;

module.exports = Controller.extend({
    index: function() {
        this.res.send('Hello World!');
    }
});
```

Visit [http://localhost:8586/test](http://localhost:8586/test)

# Router

Router inherits Router of Express. But there are some enhanced features.

## Custom router

You can use a string to specify a controller and a method. i.e. `controller@method`

In `app/routes.js`

```javascript
var Router = require('advanced').Router,
    router = Router();

// a string to specify a controller and a method. i.e. controller@method
router.get('/test/add/:id(\\d+)', 'test@addTest');

module.exports = router;
```

Specify routes with group. It likes `router.use`. The difference is that you don't need to create a router manually.

```javascript
var Router = require('advanced').Router,
    router = Router();

router.group('/group', function(router) {
    router.get('/a', 'test@a'); // /group/a
    router.get('/b', 'test@b'); // /group/b
}

module.exports = router;
```

## Default router

A simple router based on file of controller is supported.

If doesn't match any custom router, it will go here.

For example:

```javascript
req.path = '/this/is/a/path'
```

1. is exists `/this/is/a/path/index.js@index`
2. is exists `/this/is/a/path.js@index`
3. is exists `/this/is/a.js@path`
4. is exists `/this/is.js@a`, `this.req.params[0] = 'path'`

# Mock data

If set `env = 'development'` and `isMock = true` in `config.js`, it will load the middleware of `mock`. The request which created by invoking `Cotroller::request` method will be mocked.

For example. Assume that the request path is `/test/api`. If there is a json file whose path is `/mock/test/api.json`, the json data will be sent by reading the file.

# Debug template data

Add `debug=true` to query string. When you want render a template, in development mode, it will output json data that will be rendered to the template.

For example: Visit [http://127.0.0.1:8586/?debug=true](http://127.0.0.1:8586/?debug=true) will get
```json
{
    "test": 1
}
```

# Create http request in node

This method uses [request](https://github.com/request/request) module.

Call `Controller::request` to create a request in node. A promise will be returned. The arguments pass to the function like below.

> The baseUrl is `Utils.c('api')` which is assigned to `this._api`

```javascript
{
    dataKey1: '/path1',
    datakey2: '/path2'
}
```

The data returned likes below.

```javascript
{
    dataKey1: {...},
    dataKey2: {...}
}
```

The response data will be assigned to the corresponding key totally. But you can filter the response data by overriding the `_filerData` method.

```javascript
module.exports = Controller.extend({
    _filterData: function(data) {
        return data.data;
    },

    index: function() {
        this.request({
            dataKey1: '/path1',
            datakey2: '/path2'
        }).then(function(data) {
            this.render('index.swig', data);
        }.bind(this));
    }
})
```

You can pass data to destination when you create a request. Any `options` that can be passed to [request](https://github.com/request/request) module
also can be passed to `request` method.

1. `qs` object containing querystring values to be appended to the `uri`
2. `form` object to be passed to destination like to submit a form.

For example:

```javascript
module.exports = Controller.extend({
    index: function() {
        this.request({
            dataKey1: {
                uri: '/path1',
                qs: {
                    name: 'Javey'
                },
                form: {
                    password: '123'
                }
            },
            datakey2: '/path2'
        }).then(function(data) {
            this.render('index.swig', data);
        }.bind(this));
    }
})
```

# Api Proxy

## Utils.proxy(req, res, host)

You don't need to do anything, When you want to forward a request(`req`). The `apiProxy` middleware can do anything for you.
It can forward a request which is created by AJAX to the `host` server transparently.

# Config

Config file is placed in `config/`. If the filename starts with `config`, it will be loaded automatically.

## Utils.c(key, [value])

* @param `key` {String|Object}
* @param `value` {*}
* @return {*} The config you get or set.

### Set config

Use `Utils.c(key, value)` to set config. The `key` can be a object, if you want set a block of config.
If the value depends the other one. You can specify it like below:

```js
var conf = {
    a: 'a',
    ab: '{a}b' // ab depends a
}
Utils.c(conf);
```

### Get config

Use `Utils.c(key)` to get config. The `key` is a string.

```js
Utils.c('ab'); // the value is 'ab'
```

# License

MIT