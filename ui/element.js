ig.module(
  'plugins.ui.element'
)
.requires(
  'impact.animation',
  'impact.font'
)
.defines(function(){

var ui = ig.ui = ig.ui || {}

// todo: move this to the ui definition
var lastId = 0
ui.nextId = function() {
  return lastId++
}

ui.STATE = {
  NORMAL: 'normal',
  ACTIVE: 'active',
  HOVER: 'hover',
  DISABLED: 'disabled'
}


ui.Element = ig.Class.extend({
  id: 0,
  settings: {},

  pos: { x:0, y:0 },
  size: { x:0, y:0 },
  offset: { x:0, y:0 },

  anims: {},
  animSheet: null,
  // currentAnim: null,
  outline: false,

  state: 'normal', // STATE.NORMAL

  init: function(settings) {
    this.id = ui.nextId()
    ig.merge(this, settings)
  },

  addAnim: function(name, frameTime, sequence, stop) {
    if (!this.animSheet)
      throw(new Error('No animSheet to add the animation "' + name + '" to.'))

    var anim = new ig.Animation(this.animSheet, frameTime, sequence, stop)
    this.anims[name] = anim
  },

  update: function() {
    // this method could probably benefit from a FSM
    var oldState = this.state
    var hovering = this.includes(ig.input.mouse)
    if (this.state != ui.STATE.DISABLED) {
      if (hovering) {
        this.state = ig.input.state('click') ?
          ui.STATE.ACTIVE :
          ui.STATE.HOVER
      } else {
        this.state = ui.STATE.NORMAL
      }
    }
    var anim = this.anims[this.state]
    if (anim) anim.update()

    var st = ui.STATE
    if (oldState != this.state) {
      if (oldState == st.HOVER && this.state == st.ACTIVE) {
        // the button has just been clicked or touched
        this.pressDown(this)
      }
      else if (oldState == st.ACTIVE && this.state == st.HOVER) {
        // the button was just released
        this.pressUp(this)
      }
      else if (oldState == st.NORMAL && this.state == st.ACTIVE) {
        // invalid transition. change the state back to normal
        this.state = st.NORMAL
      }
    }
    else if (this.state == st.ACTIVE) {
      this.pressed(this)
    }
  },

  draw: function() {
    var anim = this.anims[this.state]
    if (anim) {
      anim.draw(
        this.pos.x - this.offset.x - ig.game._rscreen.x,
        this.pos.y - this.offset.y - ig.game._rscreen.y
      )
    }

    if (this.outline) {
      this.drawBoarder()
    }
  },

  drawBoarder: function() {
    var ctx = ig.system.context
    ctx.beginPath()
    ctx.rect(
      this.pos.x - this.offset.x - ig.game._rscreen.x,
      this.pos.y - this.offset.y - ig.game._rscreen.y,
      this.size.x,
      this.size.y
    )
    ctx.strokeStyle = '#FF0000'
    ctx.stroke()
  },

  includes: function(point) {
    return !(
      this.pos.x - ig.game._rscreen.x > point.x ||
      this.pos.x - ig.game._rscreen.x + this.size.x < point.x ||
      this.pos.y - ig.game._rscreen.y > point.y ||
      this.pos.y - ig.game._rscreen.y + this.size.y < point.y
    )
  },

  enable: function() {
    this.state = ui.STATE.NORMAL
  },

  disable: function() {
    this.state = ui.STATE.DISABLED
  },

  pressed: function() {},
  pressDown: function() {},
  pressUp: function() {}

})


})