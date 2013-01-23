// Description: StateMachine Plugin - see description in code comments below
// Author     : Heiko W. Risser
// Created    : May 2012
// SourceLink : https://github.com/HeikoR/Impact-ButtonStateMachine
// Revision   : 1.0
//
// Todo       : - handle zIndex and option to prevent click from being sent to next entity on entity hit
//            :   this code should probably go somewhere else though.

ig.module (
  'plugins.ui.statemachine'
)
.requires (
  'impact.entity'
)
.defines( function () {

  var ui = ig.ui = ig.ui || {}

  ui.INPUTSTATE = {               // nb: name needs to match property since we use name to access state table properties
    DISABLED:     { value: 0, name: 'DISABLED' },
    ENABLED:      { value: 1, name: 'ENABLED' },
    MOUSEIN:      { value: 2, name: 'MOUSEIN' },
    MOUSEOUT:     { value: 3, name: 'MOUSEOUT' },
    MOUSEINDOWN:  { value: 4, name: 'MOUSEINDOWN' },
    MOUSEOUTDOWN: { value: 5, name: 'MOUSEOUTDOWN' },
    MOUSEINUP:    { value: 6, name: 'MOUSEINUP' },
    MOUSEOUTUP:   { value: 7, name: 'MOUSEOUTUP' },
    INVALID:      { value: 255, name: 'INVALID' }
  }
  ui.BUTTONSTATE = {
    IGNORE:       { value: 0, name: 'IGNORE' },
    DISABLED:     { value: 1, name: 'DISABLED' },
    OUTSIDE:      { value: 2, name: 'OUTSIDE' },
    INSIDE:       { value: 3, name: 'INSIDE' },
    INSIDEACTIVE: { value: 4, name: 'INSIDEACTIVE' }
  }

  var FUNCTION = 'function'


  // =================================================================================================================
  // StateMachine
  //
  // - create instance of StateMachine in your button entity
  // - set the following button state input functions in your button entity (if required, else keep defaults)
  //    isMouseInside - return true if mouse is inside of button clickable area, else false
  //    isEnabled   - return enabled state of your button, or keep default if your button can't be disabled
  //    isMouseDown   - return true if mouse.STATE is down, else false (note mouse state should return down continuosly
  //                until button up, not just once on transition)
  // - set the following state transition handlers - if required
  //   Note: these events only get called ONCE on state transition.
  //    startHover    - notifies when mouse over clickable area
  //    endHover    - notifies when mouse leaves clickable area
  //    startClick    - notifies when mouse button down on clickable area
  //    endClick    - notifies when mouse button up on clickable area
  //    endClickIgnore  - notifies when mouse button up outside of clickable area
  // - call updateState() in your button entity's update handler

  ui.StateMachine = ig.Class.extend({
    stateTable: null,
    currentState: null,
    mouseIsActive: false,
    lastInputState: ui.INPUTSTATE.INVALID,

    init: function(stateTable) {
      this.stateTable = stateTable || ui.StateMachine.stateTable
      this.currentState = ui.BUTTONSTATE.OUTSIDE
    },

    updateState: function() {

      var inputState = ui.INPUTSTATE.INVALID

      if (!this.isEnabled()) {
        inputState = ui.INPUTSTATE.DISABLED
      } else if (this.isMouseInside()) {
        inputState = ui.INPUTSTATE.MOUSEIN
        if (this.isMouseDown()) {
          if (!this.mouseIsActive){
            this.mouseIsActive = true
            inputState = ui.INPUTSTATE.MOUSEINDOWN
          }
        } else if (this.mouseIsActive) {
          this.mouseIsActive = false
          inputState = ui.INPUTSTATE.MOUSEINUP
        }
      } else {
        inputState = ui.INPUTSTATE.MOUSEOUT
        if (this.isMouseDown()) {
          if (!this.mouseIsActive){
            this.mouseIsActive = true
            inputState = ui.INPUTSTATE.MOUSEOUTDOWN
          }
        } else if (this.mouseIsActive) {
          this.mouseIsActive = false
          inputState = ui.INPUTSTATE.MOUSEOUTUP
        }
      }

      // only update state if we have a change in input
      if (inputState.value !== this.lastInputState.value)
      {
        var stateFunc = null           // called on state transition (if valid function configured)
        var newState = null

        this.lastInputState = inputState

        var stateDef = this.stateTable[this.currentState.name][inputState.name]
        if (!stateDef)
          return false

        // get output state for given input state, and if valid, then set new button state
        newState = stateDef[0]
        if (this.isValidButtonState(newState))
          this.currentState = newState
        else
          return false

        // get state transition function (if specified)
        stateFunc = this[stateDef[1]]
        if (stateFunc && typeof(stateFunc) === FUNCTION) {
          stateFunc()
        }
      }
      return true
    },

    // validate that 'state' is a valid button state.
    // note: for ui.BUTTONSTATE.IGNORE we return false, since we want to 'ignore' this state
    isValidButtonState: function(state) {
      if (/*(state === ui.BUTTONSTATE.IGNORE) ||*/
        (state === ui.BUTTONSTATE.DISABLED) ||
        (state === ui.BUTTONSTATE.OUTSIDE) ||
        (state === ui.BUTTONSTATE.INSIDE) ||
        (state === ui.BUTTONSTATE.INSIDEACTIVE))
        return true
      else
        return false
    },

    // State Inputs
    isMouseInside: function() { return false },
    isEnabled: function() { return true },
    isMouseDown: function () { return false },

    // Events Out
    noEvent: null,
    startHover: null,
    endHover: null,
    startClick: null,
    endClick: null,
    endClickIgnore: null
  })


  ui.StateMachine.stateTable = {
    // Current buttonState
    OUTSIDE: {
      // inputState.name    Output buttonState      Output Event
      DISABLED:       [ui.BUTTONSTATE.DISABLED,     'noEvent'],
      MOUSEIN:        [ui.BUTTONSTATE.INSIDE,       'startHover'],
      MOUSEOUT:       [ui.BUTTONSTATE.IGNORE,       'noEvent'],
      MOUSEINDOWN:    [ui.BUTTONSTATE.INSIDEACTIVE, 'startClick'],
      MOUSEOUTDOWN:   [ui.BUTTONSTATE.IGNORE,       'noEvent'],
      MOUSEINUP:      [ui.BUTTONSTATE.INSIDE,       'startHover'],
      MOUSEOUTUP:     [ui.BUTTONSTATE.IGNORE,       'noEvent']
    },
    INSIDE: {
      DISABLED:       [ui.BUTTONSTATE.DISABLED,     'noEvent'],
      MOUSEIN:        [ui.BUTTONSTATE.IGNORE,       'noEvent'],
      MOUSEOUT:       [ui.BUTTONSTATE.OUTSIDE,      'endHover'],
      MOUSEINDOWN:    [ui.BUTTONSTATE.INSIDEACTIVE, 'startClick'],
      MOUSEOUTDOWN:   [ui.BUTTONSTATE.OUTSIDE,      'endHover'],
      MOUSEINUP:      [ui.BUTTONSTATE.IGNORE,       'noEvent'],
      MOUSEOUTUP:     [ui.BUTTONSTATE.OUTSIDE,      'endHover']
    },
    INSIDEACTIVE: {
      DISABLED:       [ui.BUTTONSTATE.DISABLED,   'endClickIgnore'],
      MOUSEIN:        [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEOUT:       [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEINDOWN:    [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEOUTDOWN:   [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEINUP:      [ui.BUTTONSTATE.INSIDE,     'endClick'],
      MOUSEOUTUP:     [ui.BUTTONSTATE.OUTSIDE,    'endClickIgnore']
    },
    DISABLED: {
      DISABLED:       [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEIN:        [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEOUT:       [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEINDOWN:    [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEOUTDOWN:   [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEINUP:      [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      MOUSEOUTUP:     [ui.BUTTONSTATE.IGNORE,     'noEvent'],
      ENABLED:        [ui.BUTTONSTATE.OUTSIDE,    'noEvent']
    }
  }
})

