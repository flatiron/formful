var utile = require('utile'),
    layout = require('./layout'),
    inflect = utile.inflect.pluralize;

module['exports'] = function(options, callback) {
  var resource = options.resource, 
      record = options.data;

  var $             = this.$,
      output        = '',
      entity        = resource.lowerResource;

    if (typeof record === "object") {

        //
        // Interate through all non-private schema properties,
        // and create table rows with the values of the record
        //
        Object.keys(resource.schema.properties).forEach(function(property) {
          if (!resource.schema.properties[property].private) {
            var value = record[property];
            if (resource.schema.properties[property].type === "object") {
              value = JSON.stringify(value);
            }
            value = value.toString();

            // Bad string concat man!
            output += ('<tr>'
                   +     '<td>' + property + '</td>'
                   +     '<td>' + (value) + '</td>'
                   +   '</tr>');
         }
        });

        //
        // Check to see if there are any remote methods to show
        //

        for(var m in resource) {
          var _found = false;
          if (typeof resource[m] === 'function' && resource[m].remote === true) {
            // Bad string concat man!
            output += ('<tr>'
                   +     '<td colspan = "2">' + layout.controls.buttons.remote.present({ value: m, id: record.id }) + '</td>'
                   +   '</tr>');
          }
        }

        $('h1').html(entity);
        $('.back').html('back to ' + entity);
        $('.back').attr('href', '/' + entity);
        $('.records').html(output);
        $('.create').html('Create new ' + entity);
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

