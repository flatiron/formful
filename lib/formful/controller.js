var fs = require('fs'),
    cheerio = require('cheerio');

//
// Remark: `cheerio` library is simple server-side jQuery port ( useful for quick traversing )
//

//
// Load views into memory on load
//
var views = ['create', 'destroy', 'update', 'show'];
views.forEach(function(p){
  views[p] = fs.readFileSync('./lib/view/' + p + '.html').toString();
});


module['exports'] = {
  
  create : function(options, resource, callback) {

    var output = '';
    $ = cheerio.load(views['create']);

    Object.keys(resource.schema.properties).forEach(function(property){
      var obj = resource.schema.properties[property];
      obj.name = property;
      var html = "<label for='" + obj.name + "'>" + obj.name + "</label><input name='" + obj.name + "' />" + "<br/>";
      output += html;
    });

    $('.inputs').html(output);
    $('h2').html('Creating new  ' + resource._resource);
    $('input[type="submit"]').attr('value', 'Create new ' + resource._resource);

    output = $.html();
    callback(null, output);
    
  },
  
  show : function(options, resource, callback) {

    var output = '';
    $ = cheerio.load(views['show']);

    if (options) {
      resource.get(options, function(err, record){
        if (err) {
          return callback(err);
        }

        output += ('<li><a href="' + slug(record._id, resource) + '/edit">' + slug(record._id, resource) + '/edit</a></li><li><a href="' + slug(record._id, resource) + '/destroy">' + slug(record._id, resource)+ '/destroy</a></li><li><div>' + JSON.stringify(record, true, 2) + '</div></li>');

        $('.records').html(output);
        $('h2').html('Reading ' + record.resource + ' ' + record._id);

        output = $.html();
        callback(null, output);

      });
    } else {
      resource.all(function(err, results){
        if (err) {
          return callback(err);
        }

        results.forEach(function(record){
          output += ('<li><a href="' + slug(record._id, resource) +'/show">' + slug(record._id, resource)  + '/show</a></li>');
        });

        $('.records').html(output);
        $('.schema').html(JSON.stringify(resource.schema.properties, true, 2));
        $('h2').html(resource._resource);
        $('.create').html('Create new ' + resource._resource);

        output = $.html();
        callback(null, output);
      });
    }
  },
  destroy : function(options, resource, callback) {
    var output = '';
    $ = cheerio.load(views['destroy']);

    resource.get(options, function(err, record){

      if (err) {
        return callback(null, JSON.stringify(err));
      }
      
      Object.keys(record).forEach(function(key){
        var html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>";
        output += html;
      });

      $('.inputs').html(output);
      $('form').attr('action', '/' + resource._resource + '/' + record._id + '/destroy');
      $('input[type="submit"]').attr('value', 'Delete ' + record.resource);
      $('h2').html('Deleting ' + record.resource + ' ' + record._id);

      output = $.html();
      callback(null, output);
    });
  },
  
  update : function(options, resource, callback) {
    
    var output = '';
    $ = cheerio.load(views['update']);
    
    resource.get(options, function(err, record){

      if (err) {
        return callback(null, JSON.stringify(err));
      }

      Object.keys(record).forEach(function(key){
        var value = '', html = '';
        record[key] = record[key] || "";
        if (record[key].toString().length > 0) {
          value = "value='" + record[key] + "'";
        };
        html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' " + value + "/><br/>";
        output += html;
      });

      $('.inputs').html(output);
      $('form').attr('action', '/' + resource._resource + '/' + record._id + '/update');
      $('input[type="submit"]').attr('value', 'Update ' + record.resource);
      $('h2').html('Updating ' + record.resource + ' ' + record._id);

      output = $.html();
      callback(null, output);
    });
  }

};

//
// Remark: Trivial helper method for string concat
//
function slug (id, resource) {
  var str;
  str = '/' + resource._resource + '/' + id;
  return str;  
}