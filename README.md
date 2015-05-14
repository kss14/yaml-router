# YAML Router middleware for Express

This middleware is designed to work like the Symfony2 model of seperate routes and controllers.

Routes are defined in a .yml file; multiple controllers can be defined in their own .js file.<br>
This gives us great flexibility in setting up our routes; it's possible to change your complete url structure without touching any controller code.

To use named routing, we rely on the excellent express-reverse package (https://github.com/dizlexik/express-reverse).

## Install

```sh
npm install yaml-router
```

## Example

```js
#/app.js
var app = require('express')();
require('yaml-router')(app);
```

```yaml
#/app/config/routes.yml
home:
    pattern: /
    controller: main:home
    methods: [GET]

about:
    pattern: /about
    controller: main:about
    methods: [GET]

item:
    pattern: /item/edit/:id?
    controller: main:item
    methods: [GET, POST]

#load all routes for /api
api-loader:
    resource: routes/api.yml
    prefix: /api
```

```yaml
#/app/config/routes/api.yml
api-get:
    pattern: /get
    controller: api:get
    methods: [GET]
```

```js
#/app/controllers/main.js
module.exports = function() {
    return {
        homeController: function(req, res, next) {
            res.render('index.html.twig', {});
        },
        aboutController: function(req, res, next) {
            res.render('about.html.twig', {});
        },
        itemController: function(req, res, next) {
            
            req.params.id = req.params.id || 0;
            
            res.render('item.html.twig', {
                param: req.params.id
            });
        },
    }
};

```
The controller `main:about` will be parsed so the `aboutController` in `/app/controllers/main.js` is loaded.

Multiple .yml routing files can be loaded using the resource/prefix syntax, see code example above.

See also the `examples` folder in the project.

## Methods

### _module_(app, [options])

* `app` Express app
* `options (optional)` 

Options defaults:
```
{ 
     routingFile: __dirname + '/../../app/config/routes.yml',
     controllerPath: __dirname + '/../../app/controllers',
     helperName: 'url' //The function used in templates to call a route. See express-reverse docs.
}
```
## Test

```npm test```

## License

The MIT License (MIT)

Copyright (c) 2015 Olivier Droog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
