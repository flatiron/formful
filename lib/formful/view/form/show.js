var utile = require('utile'),
inflect = utile.inflect.pluralize;

module['exports'] = function(options, callback) {
  var resource = options.resource, 
      record = options.data;

  var $             = this.$,
      output        = '',
      entity        = resource.lowerResource,
      pluralEntity  = inflect(entity);

    if (record) {

      output += ('<tr>'
             +     '<td>' + "id" + '</td>'
             +     '<td>' + record.id + '</td>'
             +   '</tr>');

             /*
             output += ('<tr>'
                    +     '<td>' + "key" + '</td>'
                    +     '<td>' + record.key + '</td>'
                    +   '</tr>');
             */

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

        $('h1').html(pluralEntity);
        $('.back').html('back to ' + pluralEntity);
        $('.back').attr('href', '/' + pluralEntity);
        $('.records').html(output);
        $('.create').html('Create new ' + entity);

        $('a').each(function(){
//          $(this).attr('href', $(this).attr('href').replace('/:id', "/" + pluralEntity + '/' + record._id));
        });

        $('.edit').attr('href', '/' + record.slug + '/update');
        $('.destroy').attr('href', '/' + record.slug + '/destroy');


        output = $.html();
    }
    
    if (callback) {
      return callback(null, output);
    }

    return output;
    
}