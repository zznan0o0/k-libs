Function.prototype._before = function(func) {
  var __self = this;
  return function() {
    func.apply(__self, arguments);
    return __self.apply(__self, arguments);
  };
};

Function.prototype._after = function(func) {
  var __self = this;
  return function() {
    var ret = __self.apply(__self, arguments);
    func.apply(__self, arguments);
    return ret;
  };
};

Function.prototype._aaa = function(){
  console.log('aaa');
  return this;
}

// 代码
function a() {
  console.log("I'm a");
}

a = a._before2(function() {
  console.log("before");
});

a = a._after(function() {
  console.log("after");
});

// a = a._aaa()


a();
// a();
