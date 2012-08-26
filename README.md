# Formful - Unreleased Experimental v0.0.0

Isomorphic HTML forms for [Director](http://github.com/flatiron/director) routers and [Resourceful](http://github.com/flatiron/resourceful) models.

# Online Demo

<a href="http://formful.jit.su">http://formful.jit.su</a>

# Installation

     npm install formful

# Features

  - Can generate isomorphic HTML CRUD forms
  - Built on [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [Director](http://github.com/flatiron/director), [Restful](http://github.com/flatiron/restful), and [Resourceful](http://github.com/flatiron/resourceful) 
  - Supports [Resourceful](http://github.com/flatiron/resourceful)  models or regular JSON-schemas
  - Hassle-free mark-up customization through simple HTML and jQuery

# Customization of forms

As of the `v0.1.0` release, form customization is not so awesome. This will be improved soon.

Form "views" are created using the [viewful](http://github.com/flatiron/viewful). This means that you have full access to the `viewful.View` class and you could write your forms in one of **22** JavaScript templating engines.

Right now, all forms and form components are stored as plain html files. Formful currently ships with no templating engine. All rendering and data-binding is handling through Presenters for each view. This is not ideal, and will be changing soon.

# Usage

  More documentation coming soon.
  
  For now, see `examples/server.js` for now or run `npm start`
  
# Tests

     npm test

# TODO
 - Full `revalidator` property type support ( numeric, boolean, array, object )
 - Better Twitter Bootstrap component integration / styling
 - Replace string concats with $() selectors
 - Implement as Flatiron plugin
 - Implement client-side routing support
 - Fully implement relational resources
 - Add integration tests