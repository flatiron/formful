var utile = require('utile'),
    layout = require('./layout'),
    inflect = utile.inflect.pluralize;

module['exports'] = function(options, callback) {
  var resource = options.resource, 
      message = options.message;

  var $             = this.$,
      output        = '',
      entity        = resource.lowerResource;

  $('h1').html(message);
  $('.back').attr('href', '../' + options.data.id);
  $('.back').html('back to ' + options.data.id);

  output = $.html();

  if (callback) {
    return callback(null, output);
  }

  return output;

}

