var layout = require('./layout'),
    utile = require('utile');

module['exports'] = function (options, callback) {
  var resource = options.resource;
 //
 // Presenter is scoped with the following variables for convience:
 //
 var $ = this.$,
     self = this,
     output = '',
     options = options || {},
     entity = resource.lowerResource,
     pluralEntity  = utile.inflect.pluralize(entity);

  output += "id: <input name='id' id='id'>" + "</input> optional";

  Object.keys(resource.schema.properties).forEach(function (property) {
    var input = utile.clone(resource.schema.properties[property]);
    input.name = property;
    input.value = input.default || '';
    if (input.writeable !== false) {
      output += layout.renderInput(input, options);
    }
  });

  if(options.errors) {
    console.log(options.errors)
  }

  $('h1').html(entity + ' - create');
  $('.back').html('back to ' + pluralEntity);
  $('.back').attr('href', '/' + pluralEntity);

  $('legend').html(entity + ' form');
  $('form').attr('action', '/' + pluralEntity + '/new');
  $('.inputs').html(output);
  $('input[type="submit"]').attr('value', 'Create new ' + entity);

  output = $.html();

  if (callback) {
    return callback(null, output);
  }
  return output;

}