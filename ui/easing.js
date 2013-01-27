ig.module(
  'plugins.ui.easing'
)
.requires(
  'plugins.ui.element'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Element.inject({

  easing: 'quadraticOut',
  initialPos: null,
  targetPos: null,
  animRunning: false,
  animDuration: null,
  animTimer: null,

  animateTo: function(pos, dur, easing) {
    this.initialPos = { x: this.pos.x, y: this.pos.y }
    this.animRunning = true
    this.targetPos = pos
    this.animDuration = dur
    this.easing = easing || this.easing

    this.animTimer = new ig.Timer(dur)
  },

  update: function() {
    this.parent()

    if (!this.animRunning) return

    var tDelta = this.animTimer.delta()
    if (tDelta >= 0) {
      this.animRunning = false
      return
    }

    var x = calculateDelta(
      this.initialPos.x,
      this.pos.x,
      this.targetPos.x - this.initialPos.x,
      this.animDuration,
      tDelta,
      this.easing
    )
    var y = calculateDelta(
      this.initialPos.y,
      this.pos.y,
      this.targetPos.y - this.initialPos.y,
      this.animDuration,
      tDelta,
      this.easing
    )

    this.pos.x = x
    this.pos.y = y

  }

})



function calculateDelta(initial, current, posDelta, duration, timeDelta, easing) {
  var easing = Easing[easing]
  var pctComplete = Math.abs(timeDelta).map(0, duration, 1, 0)
  if (easing) pctComplete = easing(pctComplete)

  var newPos = initial + (posDelta * pctComplete)

  if (posDelta > 0)
    newPos = current > initial + posDelta ? 0 : newPos
  else
    newPos = current < initial + posDelta ? 0 : newPos

  return newPos
}



var Easing = ui.Easing = {

  linear: function(k) { return k },

  quadraticIn: function(k) { return k * k },
  quadraticOut: function(k) { return - k * (k - 2) },
  quadraticInOut: function(k) {
    if ((k *= 2) < 1) return 0.5 * k * k
    return - 0.5 * (--k * (k - 2) - 1)
  },

  cubicIn: function(k) { return k * k * k },
  cubicOut: function(k) { return --k * k * k + 1 },
  cubicInOut: function(k) {
    if ((k *= 2) < 1) return 0.5 * k * k * k
    return 0.5 * ((k -= 2) * k * k + 2)
  },

  quarticIn: function(k) { return k * k * k * k },
  quarticOut: function(k) { return - (--k * k * k * k - 1) },
  quarticInOut: function(k) {
    if ((k *= 2) < 1) return 0.5 * k * k * k * k
    return - 0.5 * ((k -= 2) * k * k * k - 2)
  },

  quinticIn: function(k) { return k * k * k * k * k },
  quinticOut: function(k) { return (k = k - 1) * k * k * k * k + 1 },
  quinticInOut: function(k) {
    if ((k *= 2) < 1) return 0.5 * k * k * k * k * k
    return 0.5 * ((k -= 2) * k * k * k * k + 2)
  },

  sinusoidalIn: function(k) { return - Math.cos(k * Math.PI / 2) + 1 },
  sinusoidalOut: function(k) { return Math.sin(k * Math.PI / 2) },
  sinusoidalInOut: function(k) { return - 0.5 * (Math.cos(Math.PI * k) - 1) },

  exponentialIn: function(k) { return k == 0 ? 0 : Math.pow(2, 10 * (k - 1)) },
  exponentialOut: function(k) { return k == 1 ? 1 : - Math.pow(2, - 10 * k) + 1 },
  exponentialInOut: function(k) {
    if (k == 0) return 0
    if (k == 1) return 1
    if ((k *= 2) < 1) return 0.5 * Math.pow(2, 10 * (k - 1))
    return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2)
  },

  circularIn: function(k) { return - (Math.sqrt(1 - k * k) - 1) },
  circularOut: function(k) { return Math.sqrt(1 - --k * k) },
  circularInOut: function(k) {
    if ((k /= 0.5) < 1) return - 0.5 * (Math.sqrt(1 - k * k) - 1)
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1)
  },

  elasticIn: function(k) {
    var s, a = 0.1, p = 0.4
    if (k == 0) return 0
    if (k == 1) return 1
    if (!p) p = 0.3
    if (!a || a < 1) { a = 1; s = p / 4 }
    else s = p / (2 * Math.PI) * Math.asin(1 / a)
    return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p))
  },
  elasticOut: function(k) {
    var s, a = 0.1, p = 0.4
    if (k == 0) return 0
    if (k == 1) return 1
    if (!p) p = 0.3
    if (!a || a < 1) { a = 1; s = p / 4 }
    else s = p / (2 * Math.PI) * Math.asin(1 / a)
    return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1)
  },
  elasticInOut: function(k) {
    var s, a = 0.1, p = 0.4
    if (k == 0) return 0
    if (k == 1) return 1
    if (!p) p = 0.3
    if (!a || a < 1) { a = 1; s = p / 4 }
    else s = p / (2 * Math.PI) * Math.asin(1 / a)
    if ((k *= 2) < 1) return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p))
    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1
  },

  backIn: function(k) {
    var s = 1.70158
    return k * k * ((s + 1) * k - s)
  },
  backOut: function(k) {
    var s = 1.70158
    return (k = k - 1) * k * ((s + 1) * k + s) + 1
  },
  backInOut: function(k) {
    var s = 1.70158 * 1.525
    if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s))
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2)
  },

  bounceIn: function(k) {
    return 1 - Easing.bounceOut(1 - k)
  },
  bounceOut: function(k) {
    if ((k /= 1) < (1 / 2.75)) {
        return 7.5625 * k * k
    } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75
    } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375
    } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375
    }
  },
  bounceInOut: function(k) {
    if (k < 0.5) return Easing.bounceIn(k * 2) * 0.5
    return Easing.bounceOut(k * 2 - 1) * 0.5 + 0.5
  }

}

})