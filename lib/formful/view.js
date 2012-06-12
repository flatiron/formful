var fs = require('fs'),
    path = require('path'),
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
  templates[p] = fs.readFileSync(path.normalize(__dirname + '/view/' + p + '.html')).toString();
});

//
// Remark: Remove "layout" from views array, since we don't want to merge it into itself.
//
views.pop();

var $ = cheerio.load(templates['layout']);

views.forEach(function(p) {
  $('title').html('formful - ' + p);
  $('#content').html('');
  $('#content').html(templates[p]);
  views[p] = $.html();
});

module['exports'] = {

  create: function (resource, options, callback) {
    var output = '',
        args   = utile.args(arguments),
        entity = resource._resource.toLowerCase(),
        pluralEntity  = inflect(entity);

    $ = cheerio.load(views['create']);

    Object.keys(resource.schema.properties).forEach(function(property){
      var input = resource.schema.properties[property];
      input.name = property;
      input.value = input.default || '';
      output += generateInputControlGroup(input);
    });

    $('h1').html('create a new ' + entity);
    $('.back').html('back to ' + pluralEntity);
    $('.back').attr('href', '/' + pluralEntity);

    $('legend').html(entity + ' form');
    $('form').attr('action', '/' + pluralEntity);
    $('.inputs').html(output);
    $('input[type="submit"]').attr('value', 'Create new ' + entity);

    output = $.html();
    
    if (args.callback) {
      return args.callback(null, output);
    }
    return output;

  },
  
  show: function(options, resource, callback) {

    var output = '',
        args          = utile.args(arguments),
        entity        = resource._resource.toLowerCase(),
        pluralEntity  = inflect(entity);

    $ = cheerio.load(views['show']);

    if (options) {
      resource.get(options, function(err, record){
        if (err) {
          return args.callback(err);
        }

        output += ('<li><a href="' + slug(record._id, resource) + '/edit">' + slug(record._id, resource) + '/edit</a></li><li><a href="' + slug(record._id, resource) + '/destroy">' + slug(record._id, resource)+ '/destroy</a></li><li><div>' + JSON.stringify(record, true, 2) + '</div></li>');

        $('.records').html(output);
        $('h1').html('Reading ' + record.resource + ' ' + record._id);

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
          output += ('<tr>'
                 +     '<td><a href="' + slug(record._id, resource) +'/show">' + record._id + '</a></td>'
                 +     '<td><a href="' + slug(record._id, resource) +'/edit">' + 'Edit' + '</a></td>'
                 +     '<td><a href="' + slug(record._id, resource) +'/destroy">' + 'Destroy' + '</a></td>'
                 +   '</tr>');
        });
        $('h1').html(pluralEntity);

        $('.back').html('back to ' + pluralEntity);
        $('.back').attr('href', '/' + pluralEntity);
        $('.records').html(output);
        $('.schema').html(JSON.stringify(resource.schema.properties, true, 2));
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
        entity = resource._resource.toLowerCase()
        pluralEntity = inflect(entity);

    $ = cheerio.load(views['destroy']);

    resource.get(id, function(err, record){

      if (err) {
        return args.callback(null, JSON.stringify(err));
      }
      
      Object.keys(record).forEach(function(key){
        var html = "<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>";
        output += html;
      });
      $('h1').html('deleting ' + record.resource + ' ' + record._id);
      $('.back').html('back to ' + pluralEntity);
      $('.back').attr('href', '/' + pluralEntity);
      $('form').attr('action', '/' + pluralEntity + '/' + record._id + '/destroy');
      $('input[type="submit"]').attr('value', 'Delete ' + record.resource);

      output = $.html();

      if (args.callback) {
        return args.callback(null, output);
      }
      return output;

    });
  },
  
  update: function(id, resource, options, callback) {

    var output = '',
        args   = utile.args(arguments),
        entity  = resource._resource.toLowerCase(),
        pluralEntity = inflect(entity);

    $ = cheerio.load(views['update']);

    resource.get(id, function(err, record){

      if (err) {
        return args.callback(null, JSON.stringify(err));
      }

      Object.keys(resource.schema.properties).forEach(function(property){
        var input = {};
        input.name = property;
        input.value = record[property] || '';
        output += generateInputControlGroup(input);
      });

      $('.back').html('back to ' + pluralEntity);
      $('.back').attr('href', '/' + pluralEntity);
      $('.inputs').html(output);
      $('form').attr('action', '/' + pluralEntity + '/' + record._id + '/update');
      $('input[type="submit"]').attr('value', 'Update ' + record.resource);
      $('h1').html('Updating ' + record.resource + ' ' + record._id);

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

function generateInputControlGroup (input) {

  var value = ''
      str   = '';

  input.value = input.value || '';

  if (input.value) {
    value = "value='" + input.value + "'";
  }

  str = "<div class=`control-group`>"
           +   "<label class='control-label' for='" + input.name + "'>"
           +     input.name
           +   "</label>"
           +   "<div class='controls`>"
           +     "<input class='input-large' id='" + input.name + "' name='" + input.name + "' " + value + "/>"
           +   "</div>"
           + "</div>";
  return str;
};