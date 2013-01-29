ig.module(
  'plugins.ui.hbox'
)
.requires(
  'plugins.ui.element',
  'plugins.ui.easing',
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

    // only reposition children if new elements were added
    if (this.elements.length <= prevLength) return

    var nextX = 0
    var nextY = 0
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i]
      // make the position absolute
      this.makePosAbsolute(el.pos)
      // initialize the animation
      el.animateTo({x:nextX+this.pos.x, y:nextY+this.pos.y}, 2)
      // make the postion relative
      this.makePosRelative(el.pos)
      nextX += el.size.x
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