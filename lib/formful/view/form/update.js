var layout = require('./layout'),
    utile = require('utile');

module['exports'] = function (options, callback) {

  var resource = options.resource;

  var output = '',
     $ = this.$,
     _id = options.data._id,
     inflect = utile.inflect.pluralize,
     record = options.data,
     entity  = resource.lowerResource,
     pluralEntity = inflect(entity);

   Object.keys(resource.schema.properties).forEach(function (property) {
     var schema = resource.schema.properties[property];
     var input = utile.clone(record);
     input.description = schema.description;
     input.name = property;
     input.value = record[property] || '';
     input.format = schema.format;
     input.type = schema.type;
     input.enum = schema.enum || '';
     input.editable = schema.editable;
     output += layout.renderInput(input, options);
   });

   $('h1').html('Update ' + (record.name || record.id));
   $('.back').html('back to ' + pluralEntity);
   $('.back').attr('href', '/' + pluralEntity);
   $('.inputs').html(output);
   $('legend').html(entity + ' form');
   $('form').attr('action', '/' + pluralEntity + '/' + record.id + '/update');
   $('input[type="submit"]').attr('value', 'Update ' + record.resource);

   output = $.html();

   if (callback) {
     return callback(null, output);
   }
   return output;

 };