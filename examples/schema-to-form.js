var http        = require('http'),
    formful     = require('../lib/formful');

var resource = {
  _resource: "Creature",
  schema : {
    "properties": {
      "name": {
          "description": "the name of your awesome new site",
          "type": "string",
          "default": "my awesome app",
          "required": true
      },
      "port": {
          "description": "the port your application should listen on",
          "type": "number",
          "default": 8080,
      },
      "host": {
          "description": "the host your application should listen on",
          "type": "any",
          "default": "localhost"
      }
    }
  }
};

// TODO: this works, but should be a .render() call instead
console.log(formful.view.form.create.present({ resource: resource }));
