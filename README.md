# Formful

Reflect HTML forms from [Resourceful](http://github.com/flatiron/resourceful) resources.

# Online Demo

<a href="http://formful.jit.su">http://formful.jit.su</a>

# Installation

     npm install formful

## Warning: This is still a very young project. You might find it's still rough around the edges. Act accordingly!

# Features

  - Can reflect HTML forms [Resourceful](http://github.com/flatiron/resourceful) resources
  - Full [Resourceful](http://github.com/flatiron/resourceful) resource integration ( persistence / validation / schema )
  - Built on [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [Viewful](http://github.com/flatiron/viewful) and [Restful](http://github.com/flatiron/restful)

# Usage

## Define resource(s)

```js
var resourceful = require('resourceful'),
    Creature    = resourceful.define('creature');

Creature.property('type', String, { default: "dragon" });
Creature.property('email', String, { format: "email" });
Creature.property('life', Number, { default: 10, min: 0, max: 20 });
```

*[additional API documentation for defining resources](http://github.com/flatiron/resourceful)*

## As a stand-alone server

```js
formful.createServer([Creature]).listen(8000, function () {
  console.log(' > formful server started on port 8000');
});
```

Here is a code example of using formful as a stand-alone server: <a href="https://github.com/flatiron/formful/blob/master/examples/server.js">https://github.com/flatiron/formful/blob/master/examples/server.js</a>

### TODO: SCREENSHOTS

# Validation

Formful will respect Resourceful validation through [revalidator](http://github.com/flatiron/revalidator). Not all types and formats are current implemented, but some are!

Here is an example of trying to create a new creature without a valid email. Bad creature!

<img src="https://raw.github.com/flatiron/formful/master/assets/validation.png"></img>

<img src="https://raw.github.com/flatiron/formful/master/assets/show.png"></img>

# Persistence

Formful persists to data-providers using the Resourceful engine. You can find more information about Resourceful [here](http://github.com/flatiron/resourceful).

# Customization of forms

As of the `v0.1.0` release, form customization is not so awesome. This will be improved soon. If you want to re-design the layouts of the default forms, I will accept the pull request.

The form **View** is created by the [viewful](http://github.com/flatiron/viewful) library and is a `viewful.View` instance. Viewful provides a rich set of features including support for **22** different JavaScript templating engines!

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