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
    if (els.length == 1 && Array.isArray(els[0])) els = els[0]

    if (els.length > 0) {
      for (var i = 0; i < els.length; i++) {
        var el = els[i]
        if (el && !~this.elements.indexOf(el)) {
          this.elements.push(el)
        }
      }
    }
  },

  update: function() {
    this.parent()
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i]
      // make the position absolute
      this.makePosAbsolute(el.pos)
      // run update on the element
      el.update()
      // make the postion relative
      this.makePosRelative(el.pos)
    }
  },

  draw: function() {
    this.parent()
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i]
      // make the position absolute
      this.makePosAbsolute(el.pos)
      // run draw on the element
      el.draw()
      // make the postion relative
      this.makePosRelative(el.pos)
    }
  },

  enable: function() {
    this.invoke('enable')
  },

  disable: function() {
    this.invoke('disable')
  },

  makePosRelative: function(pos) {
    pos.x -= this.pos.x
    pos.y -= this.pos.y
  },

  makePosAbsolute: function(pos) {
    pos.x += this.pos.x
    pos.y += this.pos.y
  }

})

})
