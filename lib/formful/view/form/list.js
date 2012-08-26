var utile = require('utile'),
inflect = utile.inflect.pluralize;

module['exports'] = function(options, callback) {

  var resource = options.resource,
      data     = options.data;
  if(typeof resource === "undefined") {
    return callback(new Error('No resource specified'));
  }

  var $             = this.$,
      output        = '',
      entity        = resource.lowerResource;

  $('table th').html(entity);

    data.forEach(function(record){
      output += ('<tr>'
             +     '<td><a href="/'  + entity + '/' + record.key +'">' + record.key + '</a></td>'
             +     '<td><a href="/'  + entity + '/' + record.key  + '/update">' + 'Edit' + '</a></td>'
             +     '<td><a href="/'  + entity + '/' + record.key  + '/destroy">' + 'Destroy' + '</a></td>'
             +   '</tr>');
    });
    $('h1').html(entity);
    $('.records').html(output);
    $('.schema').html(JSON.stringify(resource.schema.properties, true, 2));
    $('.create').html('Create new ' + entity);
    $('.create').attr('href', '/' + entity + '/new');

    if(data.length === 0) {
      $('table').remove();
    }

    output = $.html();

    if (callback) {
      return callback(null, output);
    }
    return output;

}
