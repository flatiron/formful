var utile = require('utile'),
    layout = require('./layout'),
    inflect = utile.inflect.pluralize;

module['exports'] = function(options, callback) {
  var resource = options.resource, 
      record = options.data;

  var $             = this.$,
      output        = '',
      entity        = resource.lowerResource;

    //
    // Remark: Sorry for the follow string concats.
    //
    if (typeof record === "object") {

        Object.keys(resource.schema.properties).forEach(function(property) {
          if (!resource.schema.properties[property].private) {
            var value = record[property];
            if (resource.schema.properties[property].type === "object") {
              value = JSON.stringify(value);
            }
            output += ('<tr>'
                   +     '<td>' + property + '</td>'
                   +     '<td>' + (value || '') + '</td>'
                   +   '</tr>');
         }

        });

        $('h1').html(entity);
        $('.back').html('back to ' + entity);
        $('.back').attr('href', '/' + entity);
        $('.records').html(output);
        $('.create').html('Create new ' + entity);

        $('a').each(function(){
//          $(this).attr('href', $(this).attr('href').replace('/:id', "/" + entity + '/' + record._id));
        });
        $('.edit').attr('href', '/' + layout.slug(record) + '/update');
        $('.destroy').attr('href', '/' + layout.slug(record) + '/destroy');

    } else {
      $('h1').html('Could not find ' + record);
      $('table').remove();
    }

    output = $.html();

    if (callback) {
      return callback(null, output);
    }

    return output;

}

