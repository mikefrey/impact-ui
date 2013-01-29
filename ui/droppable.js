ig.module(
  'plugins.ui.droppable'
)
.requires(
  'plugins.ui.element',
  'plugins.ui.draggable',
  'impact.animation',
  'impact.font'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Droppable = ig.ui.Element.extend({

  init: function(settings) {
    this.parent(settings)

    for (var i = 0; i < ui.Element.all.length; i++) {
      if (ui.Element.all[i] instanceof ui.Draggable) {
        ui.Element.all[i].on('drop', this.checkDrop)
        ui.Element.all[i].on('drag', this.checkHover)
      }
    }
  },

  checkDrop: function(draggable) {
    if (this.isMouseInside()) {
      this.emit({type:'drop', draggable:draggable})
    }
  },

  checkHover: function(draggable) {
    if (this.isMouseInside()) {
      this.emit({type:'hoverDrag'})
    }
  }

})

})
