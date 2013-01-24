ig.module(
  'plugins.ui.hbox'
)
.requires(
  'plugins.ui.element',
  'impact.animation',
  'impact.font'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Hbox = ig.ui.Panel.extend({

  behavior: 'wrap',
  align: 'left',

  update: function() {
    this.parent()
  },

  addElement: function() {
    var prevLength = this.elements.length

    this.parent.apply(this, arguments)

    // only act upon the elements that were actually added
    if (this.elements.length <= prevLength) return

    var prevElem = this.elements[prevLength-1]
    var nextTarget = prevElem ? addVectors(prevElem.targetPos, prevElem.size) : {x:0,y:0}

    for (var i = prevLength; i < this.elements.length; i++) {
      var el = this.elements[i]
      el.targetPos = nextTarget
      el.relPos = nextTarget
      nextTarget = addVectors(nextTarget, el.size)
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
  return { x: a.x+b.x, y: a.y }
}

})