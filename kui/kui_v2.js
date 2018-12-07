var KUI = function(){}

KUI.prototype = {
  constructor: KUI,
}

var KElement = function(){}

KElement.prototype = {
  constructor: KElement,

  query: function(selector, parent){
    if(parent) return parent.querySelector(selector);
    return document.querySelector(selector);
  },

  queryAll: function(selector, parent){
    if(parent) return parent.querySelectorAll(selector);
    return document.querySelectorAll(selector);
  },

  removeAll: function(elms){
    for(var i = 0; i < elms.length; i++){
      
    }
  }
}