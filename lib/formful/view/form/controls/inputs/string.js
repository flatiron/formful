module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.control-label').attr('for', options.name);
  $('.control-label').html(options.name);
  $('input').attr('id',  options.name);
  $('input').attr('name', options.name);
  $('input').attr('value', options.value);
  return $.html();
};



        
/*
str = "<div class='control-group " + classes + "'>"
         +   "<label class='control-label' for='" + input.name + "'>"
         +     (input.label || input.name)
         +   "</label>"
         +   "<div class='controls`>"
         +   addon
         +     "<input class='input-large' " + placeholder + " id='" + input.name + "' name='" + input.name + "' " + value + disabled + ">"
         +   help
         +   "</div>"
         + "</div>";
         */
