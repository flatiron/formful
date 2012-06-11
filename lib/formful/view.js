var fs = require('fs'),
    restful = require('restful'),
    utile   = require('utile'),
    cheerio = require('cheerio');

//
// Remark: `cheerio` library is simple server-side jQuery port ( useful for quick traversing )
//

//
// Load views into memory on load
//
var views = ['create', 'destroy', 'update', 'show', 'layout'],
    templates = {};

views.forEach(function(p){
  templates[p] = fs.readFileSync('./lib/formful/view/' + p + '.html').toString();
});

//
// Remark: Remove "layout" from views array, since we don't want to merge it into itself.
//
views.pop();

var $ = cheerio.load(templates['layout']);

views.forEach(function(p) {
  $('#content').html('');
  $('#content').html(templates[p]);
  views[p] = $.html();
});

module['exports'] = {
  
  create: function(resource, options, callback) {

    var output = '',
        args   = utile.args(arguments);

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
    
    if (args.callback) {
      return args.callback(null, output);
    }
    return output;

  },
  
  show: function(options, resource, callback) {

    var output = '',
        args   = utile.args(arguments),
        entity = inflect(resource._resource.toLowerCase());

    $ = cheerio.load(views['show']);

    if (options) {
      resource.get(options, function(err, record){
        if (err) {
          return args.callback(err);
        }

        output += ('<li><a href="' + slug(record._id, resource) + '/edit">' + slug(record._id, resource) + '/edit</a></li><li><a href="' + slug(record._id, resource) + '/destroy">' + slug(record._id, resource)+ '/destroy</a></li><li><div>' + JSON.stringify(record, true, 2) + '</div></li>');

        $('.records').html(output);
        $('h2').html('Reading ' + record.resource + ' ' + record._id);

        output = $.html();

        if (args.callback) {
          return args.callback(null, output);
        }

        return output;
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
        $('h2').html(entity);
        $('.create').html('Create new ' + entity);

        output = $.html();

        if (args.callback) {
          return args.callback(null, output);
        }
        return output;

      });
    }
  },

  destroy: function(id, resource, options, callback) {

    var output = '',
        args   = utile.args(arguments),
        entity = inflect(resource._resource.toLowerCase());

    $ = cheerio.load(views['destroy']);


    resource.get(id, function(err, record){

      if (err) {
        return args.callback(null, JSON.stringify(err));
      }
      
      Object.keys(record).forEach(function(key){
        var html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>";
        output += html;
      });

      $('.inputs').html(output);
      $('form').attr('action', '/' + entity + '/' + record._id + '/destroy');
      $('input[type="submit"]').attr('value', 'Delete ' + record.resource);
      $('h2').html('Deleting ' + record.resource + ' ' + record._id);

      output = $.html();

      if (args.callback) {
        return args.callback(null, output);
      }
      return output;

    });
  },
  
  update : function(id, resource, options, callback) {

    var output = '',
        args   = utile.args(arguments),
        entity = inflect(resource._resource.toLowerCase());

    $ = cheerio.load(views['update']);

    resource.get(id, function(err, record){

      if (err) {
        return args.callback(null, JSON.stringify(err));
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
      $('form').attr('action', '/' + entity + '/' + record._id + '/update');
      $('input[type="submit"]').attr('value', 'Update ' + record.resource);
      $('h2').html('Updating ' + record.resource + ' ' + record._id);

      output = $.html();

      if (args.callback) {
        return args.callback(null, output);
      }
      return output;

    });
  }

};

//
// Remark: Trivial helper method for string concat
//
function slug (id, resource) {
  var str;
  str = '/' + inflect(resource._resource.toLowerCase()) + '/' + id;
  return str;  
}

function inflect (str) {
  //
  // TODO: replace with proper inflection / pluralization library
  // see: https://github.com/flatiron/utile/blob/master/lib/index.js#L32
  return str = (str + 's');
}