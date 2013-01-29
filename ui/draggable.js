ig.module(
  'plugins.ui.draggable'
)
.requires(
  'plugins.ui.element',
  'impact.animation',
  'impact.font'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Draggable = ig.ui.Element.extend({

  prevMouse: {},

  init: function(settings) {
    this.parent(settings)
    this.on('pressed', this.reposition.bind(this))
  },

  update: function() {
    this.parent()
  },

  setPrevMouse: function() {
    this.prevMouse.x = ig.input.mouse.x
    this.prevMouse.y = ig.input.mouse.y
  },

  onDropped: function() {},

  onEndClick: function() {
    this.parent()
    this.emit({type:'drop'})
  },

  onStartClick: function() {
    this.parent()
    this.setPrevMouse()
  },

  reposition: function() {
    if (this.prevMouse) {
      var mx = ig.input.mouse.x
      var my = ig.input.mouse.y
      var px = this.prevMouse.x
      var py = this.prevMouse.y
      var dx = mx - px
      var dy = my - py
      this.pos.x += dx
      this.pos.y += dy
    }
    this.setPrevMouse()
    this.emit({type:'drag'})
  }

})

})
