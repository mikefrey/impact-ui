ig.module(
  'plugins.ui.events'
)
.defines(function(){ "use strict"

var ui = ig.ui = ig.ui || {}

ui.Events = function () {
  var listeners = {}

  this.on = function(type, listener) {
    if (listeners[type] === undefined) {
      listeners[type] = []
    }
    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener)
    }
  }

  this.off = function(type, listener) {
    if (!listener) return listeners[type] = []
    if (!type) return listeners = null
    var index = listeners[type].indexOf(listener)
    if (index !== -1) {
      listeners[type].splice(index, 1)
    }
  }

  this.emit = function(event) {
    var listenerArray = listeners[event.type]
    if (listenerArray !== undefined) {
      var args = Array.prototype.slice.call(arguments, 0)
      event.target = this
      for (var i = 0, l = listenerArray.length; i < l; i++) {
        listenerArray[i].call(this, event)
      }
    }
  }

}

})
