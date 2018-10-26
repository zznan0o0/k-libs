var route_json = {
  bind_login: '/THK/mobile/login.html',
  nav_frame: '/THK/mobile/nav_frame.html',
  my_checkout: '/THK/mobile/my_checkout.html?v=0.1',
  checkout_detail: '/THK/mobile/checkout_detail.html',
  checkout_list: '/THK/mobile/checkout_list.html',
  matched_checkout_detail: '/THK/mobile/matched_checkout_detail.html'
}


var Route = function(route_json){
  this.route = route_json;
}

Route.prototype = {
  constructor: Route,
  query: function(selector){
    return document.querySelectorAll(selector);
  },
  
  render: function(){
    var d = this.route;
    var src = this.query('[data-src]'),
      href = this.query('[data-href]');
    src.forEach(function(v){v.src = d[v.dataset.src]});
    href.forEach(function(v){v.href = d[v.dataset.href]});
  }
}




var route = new Route(route_json);