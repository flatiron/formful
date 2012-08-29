//
// string.js - input fields for String types
//

module['exports'] = function (input, callback) {
  //
  // Todo: This load statement should be moved to Viewful
  //
  var $ = this.$.load(this.template);
  console.log(input)
  $('form').attr('action', './' + input.id + '/' + input.value);
  $('input').attr('name', input.value);
  $('input').attr('value', input.value.toString());

  return $.html();
};
