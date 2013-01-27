ig.module(
  'plugins.ui.element'
)
.requires(
  'impact.animation',
  'impact.font',
  'plugins.ui.statemachine'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

// todo: move this to the ui definition
var lastId = 0
ui.nextId = function() {
  return lastId++
}

var stateMap = {
  IGNORE:       'normal',
  DISABLED:     'disabled',
  OUTSIDE:      'normal',
  INSIDE:       'hover',
  INSIDEACTIVE: 'active'
}


ui.Element = ig.Class.extend({
  id: 0,
  settings: {},

  pos: { x:0, y:0 },
  size: { x:0, y:0 },
  offset: { x:0, y:0 },

  anims: {},
  animSheet: null,
  outline: false,

  state: 'normal', // STATE.NORMAL,
  stateMachine: null,

  init: function(settings) {
    this.id = ui.nextId()
    ig.merge(this, settings)

    var sm = this.stateMachine = new ui.StateMachine()
    sm.isMouseInside = this.isMouseInside.bind(this)
    sm.isMouseDown = this.isMouseDown.bind(this)
    // sm.isEnabled = this.isEnabled.bind(this)
    sm.startHover = this.onStartHover.bind(this)
    sm.endHover = this.onEndHover.bind(this)
    sm.startClick = this.onStartClick.bind(this)
    sm.endClick = this.onEndClick.bind(this)
    sm.endClickIgnore = this.onEndClickIgnore.bind(this)
  },

  addAnim: function(name, frameTime, sequence, stop) {
    if (!this.animSheet)
      throw(new Error('No animSheet to add the animation "' + name + '" to.'))

    var anim = new ig.Animation(this.animSheet, frameTime, sequence, stop)
    this.anims[name] = anim
  },

  update: function() {
    this.stateMachine.updateState()
    if (this.stateMachine.currentState === ui.BUTTONSTATE.INSIDEACTIVE) {
      this.pressed && this.pressed(this)
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

  setCurrentState: function() {
    this.state = stateMap[this.stateMachine.currentState.name]
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
    this.stateMachine.currentState = ui.BUTTONSTATE.DISABLED
    // this.state = ui.STATE.DISABLED
  },

  pressed: null,
  pressDown: null,
  pressUp: null,


  /* State Machine input functions */

  isMouseInside: function() {
    return this.includes(ig.input.mouse)
  },

  isMouseDown: function() {
    return ig.input.state('click')
  },

  isEnabled: function() {
    return !this.stateMachine.currentState === ui.BUTTONSTATE.DISABLED
  },

  /* State Machine transition handlers */

  onStartHover: function() {
    this.setCurrentState()
  },

  onEndHover: function() {
    this.setCurrentState()
  },

  onStartClick: function() {
    this.setCurrentState()
    this.pressDown && this.pressDown(this)
  },

  onEndClick: function() {
    this.setCurrentState()
    this.pressUp && this.pressUp(this)
  },

  onEndClickIgnore: function() {
    this.setCurrentState()
  }

})


})