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
var views = ['create', 'destroy', 'update', 'show', 'list', 'admin', 'layout'],
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
        options = options || {},
        args   = utile.args(arguments),
        entity = resource._resource.toLowerCase(),
        pluralEntity  = inflect(entity);

    if (typeof options === "function") {
      options = {};
    }

    $ = cheerio.load(views['create']);

    Object.keys(resource.schema.properties).forEach(function (property) {
      var input = utile.clone(resource.schema.properties[property]);
      input.name = property;
      input.value = input.default || '';
      output += renderInput(input, options);
    });

    $('h1').html(entity + ' - create');
    $('.back').html('back to ' + pluralEntity);
    $('.back').attr('href', '/' + pluralEntity);

    $('legend').html(entity + ' form');
    $('form').attr('action', '');
    $('.inputs').html(output);
    $('input[type="submit"]').attr('value', 'Create new ' + entity);

    output = $.html();
    
    if (args.callback) {
      return args.callback(null, output);
    }
    return output;

  },
  
  show: function(options, resource, callback) {

    var output        = '',
        args          = utile.args(arguments),
        entity        = resource._resource.toLowerCase(),
        pluralEntity  = inflect(entity);

    $ = cheerio.load(views['show']);

    if (options) {
      resource.get(options, function(err, record){
        if (err) {
          return args.callback(err);
        }

        Object.keys(resource.schema.properties).forEach(function(property) {
          output += ('<tr>'
                 +     '<td>' + property + '</td>'
                 +     '<td>' + record[property] + '</td>'
                 +   '</tr>');
        });

        $('h1').html(pluralEntity);
        $('.back').html('back to ' + pluralEntity);
        $('.back').attr('href', '/' + pluralEntity);
        $('.records').html(output);
        $('.create').html('Create new ' + entity);

        $('a').each(function(){
          $(this).attr('href', $(this).attr('href').replace('/:id', '/' + record._id));
        });

        output = $.html();

        if (args.callback) {
          return args.callback(null, output);
        }

        return output;
      });
    }
  },

  list: function(resource, callback) {
    var output        = '',
        args          = utile.args(arguments),
        entity        = resource._resource.toLowerCase(),
        pluralEntity  = inflect(entity);

    $ = cheerio.load(views['list']);

    $('table th').html(pluralEntity)

    resource.all(function(err, results){
      if (err) {
        return callback(err);
      }
      results.forEach(function(record){
        output += ('<tr>'
               +     '<td><a href="' + slug(record._id, resource) +'">' + (record.name || record._id) + '</a></td>'
               +     '<td><a href="' + slug(record._id, resource) +'/update">' + 'Edit' + '</a></td>'
               +     '<td><a href="' + slug(record._id, resource) +'/destroy">' + 'Destroy' + '</a></td>'
               +   '</tr>');
      });
      $('h1').html(pluralEntity);
      $('.records').html(output);
      $('.schema').html(JSON.stringify(resource.schema.properties, true, 2));
      $('.create').html('Create new ' + entity);
      $('.create').attr('href', '/' + pluralEntity + '/new');

      if(results.length === 0) {
        $('table').remove();
      }

      output = $.html();

      if (args.callback) {
        return args.callback(null, output);
      }
      return output;
    });
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
        options = options || {},
        entity  = resource._resource.toLowerCase(),
        pluralEntity = inflect(entity);

    if (typeof options === "function") {
      options = {};
    }

    $ = cheerio.load(views['update']);

    resource.get(id, function(err, record) {

      if (err) {
        return args.callback(null, JSON.stringify(err));
      }

      Object.keys(resource.schema.properties).forEach(function (property) {
        var schema = resource.schema.properties[property];
        var input = utile.clone(record);
        input.description = schema.description;
        input.name = property;
        input.value = record[property] || '';
        input.format = schema.format;
        input.type = schema.type;
        input.enum = schema.enum || '';
        output += renderInput(input, options);
      });

      $('.back').html('back to ' + pluralEntity);
      $('.back').attr('href', '/' + pluralEntity);
      $('.inputs').html(output);

      $('legend').html(entity + ' form');
      $('form').attr('action', '/' + pluralEntity + '/' + record._id + '/update');
      $('input[type="submit"]').attr('value', 'Update ' + record.resource);
      $('h1').html('Update ' + entity + ' ' + record._id);

      output = $.html();

      if (args.callback) {
        return args.callback(null, output);
      }
      return output;

    });
  },

  admin: function (resources, callback) {
    var output  = '',
        args    = utile.args(arguments);

    if (!Array.isArray(resources)) {
      resources = [resources];
    }

    $ = cheerio.load(views['admin']);

    $('.resources').html('');


    resources.forEach(function (resource) {
      var entity    = resource._resource.toLowerCase(),
      pluralEntity  = inflect(entity),
      str = '';

      $('.resources').append('<a href="./' + pluralEntity + '" class="btn btn-primary resource">' + pluralEntity + '</a>');

      resource.all(function(err, results){
        if (err) {
          return callback(err);
        }
        results.forEach(function(record){
          str += ('<tr>'
                 +     '<td><a href="' + slug(record._id, resource) +'">' + entity + '</a></td>'
                 +     '<td><a href="' + slug(record._id, resource) +'">' + record._id + '</a></td>'
                 +     '<td><a href="' + slug(record._id, resource) +'/update">' + 'Edit' + '</a></td>'
                 +     '<td><a href="' + slug(record._id, resource) +'/destroy">' + 'Destroy' + '</a></td>'
                 +   '</tr>');
        });
        $('.records').append(str);
        $('.back').html('back to ' + pluralEntity);
        $('.back').attr('href', '/' + pluralEntity);
        //$('.schema').html(JSON.stringify(resource.schema.properties, true, 2));
        /*
        if(results.length === 0) {
          $('table').remove();
        }*/
      });
    });

    output = $.html();

    if (args.callback) {
      return args.callback(null, output);
    }

    return output;


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
  return utile.inflect.pluralize(str);
}

//
// TODO: Replace proceeding string concating with Viewful / Plates HTML template
//
function texttinput (input) {

  var value = ''
      str   = '',
      addon = '',
      placeholder = '',
      classes = '',
      help = '';

  input.value = input.value || '';

  if (input.description && input.value.length > 0) {
    placeholder = 'placeholder="' + input.description + '"';
  }

  if (input.format === "email") {
    addon = '<div class="input-prepend"><span class="add-on"><i class="icon-envelope"></i></span></div>';
  }

  if (input.format === "date") {
    addon = '<div class="input-prepend"><span class="add-on"><i class="icon-calendar"></i></span></div>';
  }

  if (input.format === "date-time") {
    addon = '<div class="input-prepend"><span class="add-on"><i class="icon-time"></i></span></div>';
  }

  if (input.value) {
    value = "value='" + input.value + "'";
  }

  if (input.error) {
    classes += ' error';
    help += '<span class="help-inline">' + input.error.message + '</span>';
  }

  if (input.enum) {
    str += "<div class='control-group " + classes + "'>"
             +   "<label class='control-label' for='" + input.name + "'>"
             +     input.name
             +   "</label>"
             +   "<div class='controls`>";
             str += "<select id='" + input.name + "' name='" + input.name + "'>"
             str += "<option> Please select " + input.name + "</option>"
             input.enum.forEach(function(v, i) {
               selected = '';
               if(input.value === v) {
                 selected = "SELECTED='SELECTED'";
               }
               str += "<option " + selected + " value='" + v + "'>" + v + "</option>"
             });
     str +=      "</select>"
             +   help
             +   "</div>"
             + "</div>";
  } else {
    str = "<div class='control-group " + classes + "'>"
             +   "<label class='control-label' for='" + input.name + "'>"
             +     input.name
             +   "</label>"
             +   "<div class='controls`>"
             +   addon
             +     "<input class='input-large' " + placeholder + " id='" + input.name + "' name='" + input.name + "' " + value + "/>"
             +   help
             +   "</div>"
             + "</div>";
  }
  return str;
};


function checkbox (input) {

  var value = ''
      str   = '';

  input.value = input.value || '';

  if (input.value) {
    value = "checked=`CHECKED` value='" + input.value + "'";
  }

  str += '<label class="control-label" for="' + input.name + '">' + input.name + '<input type="checkbox" id="' + input.name + ' name="' + input.name + ' ' + value + '></input></label>';

  return str;
};

function renderInput (input, options) {

  var output = "";

  if (input.private) {
    return;
  }

  if(options && options.errors) {
    //
    // Remark: Find any errors that are about this input,
    // we will bind the error to the input for later user
    //
    options.errors.validate.errors.forEach(function (e) {
      if (e.property === input.name) {
        input.error = e;
        input.value = e.actual;
      }
    });

    //
    // Remark: Bind existing values to input that were previously submitted,
    // but did not contain any errors
    //
    if (typeof options.errors.value[input.name] !== 'undefined') {
      input.value = options.errors.value[input.name];
    }
  }

  switch (input.type) {
    case 'boolean':
      output += checkbox(input);
    break;
    default:
      output += texttinput(input);
    break;
  }

  return output;
};