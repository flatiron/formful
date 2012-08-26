var layout = require('./layout'),
    utile = require('utile');

module['exports'] = function (options, callback) {

  var resource = options.resource,
       $ = this.$,
       output = '',
       record = options.data,
       entity  = resource.lowerResource;

    Object.keys(record).forEach(function(key){
      var html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>";
      output += html;
    });
    $('h1').html('Destroy ' + (record.name || record.id));
    $('.back').html('back to ' + record.id);
    $('.back').attr('href', '/' + layout.slug(record));
    var confirm = $('.confirm').html();;
    confirm = confirm.replace(':id', record.id);
    $('.confirm').html(confirm);
    $('form').attr('action', '/' + layout.slug(record) + '/destroy');
    $('input[type="submit"]').attr('value', 'Destroy ' + record.resource);

    output = $.html();

    if (callback) {
      return callback(null, output);
    }
    return output;
  
}
