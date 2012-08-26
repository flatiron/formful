//
// string.js - input fields for String types
//

module['exports'] = function (input, options, callback) {
  //
  // Todo: move to Viewful
  //
  var $ = this.$.load(this.template);
  if(options.error) {
    options.error.validate.errors.forEach(function(error){
      if(input.name === error.property){
        $('.control-group').addClass('error');
        $('.help-inline').html(error.message);
        input.value = options.error.value[error.property] || '';
      }
    })
  }

  $('.control-label').attr('for', input.name);
  $('.control-label').html(input.name);
  $('input').attr('id',  input.name);
  $('input').attr('name', input.name);
  $('input').attr('value', input.value.toString());
  $('input').attr('placeholder', input.description || '');

  return $.html();
};
