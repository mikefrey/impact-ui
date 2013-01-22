ig.module(
  'plugins.ui.checkbox'
)
.requires(
  'plugins.ui.button',
  'impact.animation',
  'impact.font'
)
.defines(function(){

var ui = ig.ui = ig.ui || {}

ui.Checkbox = ig.ui.Button.extend({
  isChecked: false,
  checkAnimSheet: null,
  checkAnims: {},

  addCheckAnim: function(name, frameTime, sequence, stop) {
    if (!this.checkAnimSheet)
      throw(new Error('No checkAnimSheet to add the animation "' + name + '" to.'))

    var anim = new ig.Animation(this.checkAnimSheet, frameTime, sequence, stop)
    this.checkAnims[name] = anim
  },

  update: function() {
    this.parent()
    if (this.isChecked) {
      var anim = this.checkAnims[this.state]
      if (anim) anim.update()
    }
  },

  draw: function() {
    this.parent()
    if (!this.isChecked) return

    var anim = this.checkAnims[this.state]
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

  pressUp: function() {
    this.isChecked = !this.isChecked
    if (this.isChecked)
      this.checked()
    else
      this.unchecked()
  }

})


})