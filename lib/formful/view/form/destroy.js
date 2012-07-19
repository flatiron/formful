var layout = require('./layout'),
    utile = require('utile');

module['exports'] = function (options, callback) {

  var resource = options.resource,
       $ = this.$,
       output = '',
       inflect = utile.inflect.pluralize,
       record = options.data,
       entity  = resource.lowerResource,
       pluralEntity = inflect(entity);

    Object.keys(record).forEach(function(key){
      var html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>";
      output += html;
    });
    $('h1').html('Destroy ' + (record.name || record.id));
    $('.back').html('back to ' + record.id);
    $('.back').attr('href', '/' + record.slug);
    var confirm = $('.confirm').html();;
    confirm = confirm.replace(':id', record.id);
    $('.confirm').html(confirm);
    $('form').attr('action', '/' + record.slug + '/destroy');
    $('input[type="submit"]').attr('value', 'Destroy ' + record.resource);

    output = $.html();

    if (callback) {
      return callback(null, output);
    }
    return output;
  
}
