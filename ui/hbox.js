ig.module(
  'plugins.ui.hbox'
)
.requires(
  'plugins.ui.element',
  'impact.animation',
  'impact.font'
)
.defines(function(){

var ui = ig.ui = ig.ui || {}

ui.Hbox = ig.ui.Panel.extend({

  behavior: 'wrap',
  align: 'left',

  update: function() {

  },

  addElement: function() {
    var prevLength = this.elements.length

    this.parent.apply(this, arguments)

    // only act upon the elements that were actually added
    var els = this.elements.slice(prevLength)
    if (!els || !els.length) return

    var prevElem = this.elements[prevLength-1]
    var nextTarget = prevElem ? addVectors(prevElem.target, prevElem.size) : this.pos

    for (var i = 0; i < els.length; i++) {

    }
  }

})

ui.Hbox.BEHAVIOR = {
  WRAP: 'wrap',
  SMOOSH: 'smoosh'
}

ui.Hbox.ALIGN = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center'
}

function addVectors(a, b) {
  return { x: a.x+b.x, y: a.y+b.y }
}

})