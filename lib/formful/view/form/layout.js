/*

  TODO: CLEANUP this entire file

*/


var layout = exports;
var viewful = require('viewful')

layout.utile = require('utile');

layout.slug = function (record) {
  return record.resource.toLowerCase() + '/' + record.id;
}

var controls = new viewful.View({ path: './lib/formful/view/form/controls', input: 'html' });
controls.load();

layout.renderControl = function (control, options) {
  var output = "", _control, v;
  //
  // determine the type of control to render
  //
  _control = "string"; // forcing everything to string input as default for now

  if(control.type === "boolean") {
    _control = "boolean";
  }

  if(Array.isArray(control.enum)){
    _control = "enum";
  }

  //
  // determine if there is a View available for that type of control
  //
  if(typeof controls.inputs[_control] === 'undefined') {
    throw new Error('invalid control ' + _control);
  }

  //
  // If there is an index.js available, use that as the presenter,
  // if not, use the control itself
  //
  v = controls.inputs[_control].index || controls.inputs[_control];

  // Present the View template
  output = v.present(control, options);
  return output;
}

/*

//
// TODO: Replace proceeding string concating with Viewful / Plates HTML template
//
function texttinput (input) {

  var value = ''
      str   = '',
      addon = '',
      placeholder = '',
      classes = '',
      disabled = '',
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

  if (typeof input.value !== 'undefined') {
    value = "value='" + input.value + "'";
  }

  if (input.error) {
    classes += ' error';
    help += '<span class="help-inline">' + input.error.message + '</span>';
  }

  if (input.editable === false) {
    //disabled = " DISABLED='DISABLED' ";
  }

  if (input.enum) {
    str += "<div class='control-group " + classes + "'>"
             +   "<label class='control-label' for='" + input.name + "'>"
             +     (input.label || input.name)
             +   "</label>"
             +   "<div class='controls`>";
             str += "<select id='" + input.name + "' name='" + input.name + "'" + disabled + ">"
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
     } else if (input.type === "object"){
       str = controls.inputs.string.present(input);
       str = "<div class='control-group " + classes + "'>"
                +   "<label class='control-label' for='" + input.name + "'>"
                +     (input.label || input.name)
                +   "</label>"
                +   "<div class='controls`>"
                +   addon
                +     "<textarea class='input-xlarge' " + placeholder + " id='" + input.name + "' name='" + input.name + "'" + disabled + ">"+ JSON.stringify(input.value, true, 2) + "</textarea>"
                +   help
                +   "</div>"
                + "</div>";
     } else {
        str = controls.inputs.string.present(input);
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


*/

/*
layout.renderInput = function (input, options) {

  var output = "";

  if (input.private) {
    return output;
  }

  if(options && options.errors && options.errors.validate) {

    //
    // Handle any generic errors
    //

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
};*/