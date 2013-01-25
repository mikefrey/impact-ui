ig.module(
  'plugins.ui.panel'
)
.requires(
  'plugins.ui.element',
  'impact.animation',
  'impact.font'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Panel = ig.ui.Element.extend({

  elements: [],

  invoke: function(method) {
    var args = Array.prototype.slice.call(arguments, 1)
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i]
      if (el[method]) el[method].apply(el, args)
    }
  },

  addElement: function() {
    var els = Array.prototype.slice.call(arguments, 0)
    if (els.length > 0) {
      for (var i = 0; i < els.length; i++) {
        var el = els[i]
        if (el && !~this.elements.indexOf(el)) {
          el.relPos = { x:el.pos.x, y:el.pos.y }
          this.elements.push(el)
        }
      }
    }
  },

  update: function() {
    this.parent()
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i]
      el.pos.x = el.relPos.x + this.pos.x
      el.pos.y = el.relPos.y + this.pos.y
      el.targetPos.x = el.targetRelPos.x + this.targetPos.x
      el.targetPos.y = el.targetRelPos.y + this.targetPos.y
    }
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
