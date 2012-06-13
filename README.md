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
 - Implement nested schema properties
 - Add integration tests