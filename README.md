# Formful - Unreleased Experimental v0.0.0

Reflect HTML forms from [Resourceful](http://github.com/flatiron/resourceful) resources.

# Online Demo

<a href="http://formful.jit.su">http://formful.jit.su</a>

# Installation

     npm install formful

## Warning: This is still a very young project. You might find it's still rough around the edges. Act accordingly!

# Features

  - Can reflect HTML forms from JSON-Schema or [Resourceful](http://github.com/flatiron/resourceful) resources
  - Full [Resourceful](http://github.com/flatiron/resourceful) resource integration ( persistence / validation / schema )
  - Built on [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [Viewful](http://github.com/flatiron/viewful) and [Restful](http://github.com/flatiron/restful)

# Usage

## Define resource(s)

```js
var resourceful = require('resourceful'),
    Creature    = resourceful.define('creature');

Creature.property('type', String, { default: "dragon" });
Creature.property('life', Number, { default: 10, min: 0, max: 20 });
```

*[additional API documentation for defining resources](http://github.com/flatiron/resourceful)*

## As a stand-alone server

To use formful as a stand-alone server you will have to:

 - Define resource(s)
 - Create a new server based on the resource(s) using `formful.createServer`

Here is a code example of using formful as a stand-alone server: <a href="https://github.com/flatiron/formful/blob/master/examples/server.js">https://github.com/flatiron/formful/blob/master/examples/server.js</a>

### TODO: SCREENSHOTS

# Validation

## TODO

# Persistence

## TODO

# Customization of forms

As of the `v0.1.0` release, form customization is not so awesome. This will be improved soon.

Form "views" are created using the [viewful](http://github.com/flatiron/viewful). This means that you have full access to the `viewful.View` class and you could write your forms in one of **22** JavaScript templating engines.

Right now, all forms and form components are stored as plain html files. Formful currently ships with no templating engine. All rendering and data-binding is handling through Presenters for each view. This is not ideal, and will be changing soon.
  
# Tests

     npm test

# TODO
 - Make isomorphic ( blocked by `Viewful` )
 - Full `revalidator` property type support ( numeric, boolean, array, object )
 - Better Twitter Bootstrap component integration / styling
 - Replace **all** string concats
 - Implement Flatiron plugin / Add Flatiron example
 - Fully implement relational resources
 - Add integration tests for all browsers