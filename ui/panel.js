ig.module(
  'plugins.ui.panel'
)
.requires(
  'plugins.ui.element',
  'impact.animation',
  'impact.font'
)
.defines(function(){

var ui = ig.ui = ig.ui || {}

ui.Panel = ig.ui.Element.extend({

  elements: {},

  invoke: function(method) {
    var args = Array.prototype.slice.call(arguments, 1)
    for (var id in this.elements) {
      var el = this.elements[id]
      if (el[method]) el[method].apply(el, args)
    }
  },

  addElement: function() {
    var els = Array.prototype.slice.call(arguments, 0)
    if (els.length > 0) {
      for (var i = 0; i < els.length; i++) {
        var el = els[i]
        if (el && el.id && !(el.id in this.elements)) {
          this.elements[el.id] = el
        }
      }
    }
  },

  update: function() {
    this.parent()
    this.invoke('update')
  },

  draw: function() {
    this.parent()
    this.invoke('draw')
  },

  enable: function() {
    this.invoke('enable')
  },

  disable: function() {
    this.invoke('disable')
  }

})

})
