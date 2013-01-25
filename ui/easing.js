ig.module(
  'plugins.ui.easing'
)
.requires()
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Easing = {

  linear: {
    easeNone: function ( k ) { return k }
  },

  quadratic: {
    easeIn: function ( k ) { return k * k },
    easeOut: function ( k ) { return - k * ( k - 2 ) },
    easeInOut: function ( k ) {
        if ( ( k *= 2 ) < 1 ) return 0.5 * k * k
        return - 0.5 * ( --k * ( k - 2 ) - 1 )
    }
  },

  cubic: {
    easeIn: function ( k ) { return k * k * k },
    easeOut: function ( k ) { return --k * k * k + 1 },
    easeInOut: function ( k ) {
        if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k
        return 0.5 * ( ( k -= 2 ) * k * k + 2 )
    }
  },

  quartic: {
    easeIn: function ( k ) { return k * k * k * k },
    easeOut: function ( k ) { return - ( --k * k * k * k - 1 ) },
    easeInOut: function ( k ) {
        if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k
        return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 )
    }
  },

  quintic: {
    easeIn: function ( k ) { return k * k * k * k * k }
    easeOut: function ( k ) { return ( k = k - 1 ) * k * k * k * k + 1 }
    easeInOut: function ( k ) {
        if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k
        return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 )
    }
  },

  sinusoidal: {
    easeIn: function(k) { return - Math.cos( k * Math.PI / 2 ) + 1 },
    easeOut: function(k) { return Math.sin( k * Math.PI / 2 ) },
    easeInOut: function(k) { return - 0.5 * ( Math.cos( Math.PI * k ) - 1 ) }
  },

  exponential: {
    easeIn: function(k) { return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) ) },
    easeOut: function(k) { return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1 },
    easeInOut: function(k) {
      if ( k == 0 ) return 0
      if ( k == 1 ) return 1
      if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) )
      return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 )
    }
  }

  circular: {
    easeIn: function(k) { return - ( Math.sqrt( 1 - k * k ) - 1) },
    easeOut: function(k) { return Math.sqrt( 1 - --k * k ) },
    easeInOut: function(k) {
      if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1)
      return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1)
    }
  }

  elastic: {
    easeIn: function( k ) {
      var s, a = 0.1, p = 0.4
      if ( k == 0 ) return 0 if ( k == 1 ) return 1 if ( !p ) p = 0.3
      if ( !a || a < 1 ) { a = 1 s = p / 4 }
      else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a )
      return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) )
    },
    easeOut: function( k ) {
      var s, a = 0.1, p = 0.4
      if ( k == 0 ) return 0 if ( k == 1 ) return 1 if ( !p ) p = 0.3
      if ( !a || a < 1 ) { a = 1 s = p / 4 }
      else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a )
      return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 )
    },
    easeInOut: function( k ) {
      var s, a = 0.1, p = 0.4
      if ( k == 0 ) return 0 if ( k == 1 ) return 1 if ( !p ) p = 0.3
      if ( !a || a < 1 ) { a = 1 s = p / 4 }
      else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a )
      if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) )
      return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1
    }
  },

  back: {
    easeIn: function( k ) {
        var s = 1.70158
        return k * k * ( ( s + 1 ) * k - s )
    },
    easeOut: function( k ) {
        var s = 1.70158
        return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1
    },
    easeInOut: function( k ) {
        var s = 1.70158 * 1.525
        if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) )
        return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 )
    }
  },

  bounce: {
    easeIn: function( k ) {
        return 1 - Easing.Bounce.EaseOut( 1 - k )
    },
    easeOut: function( k ) {
        if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
            return 7.5625 * k * k
        } else if ( k < ( 2 / 2.75 ) ) {
            return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75
        } else if ( k < ( 2.5 / 2.75 ) ) {
            return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375
        } else {
            return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375
        }
    },
    easeInOut: function( k ) {
        if ( k < 0.5 ) return Easing.Bounce.EaseIn( k * 2 ) * 0.5
        return Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5
    }
  }
}

})