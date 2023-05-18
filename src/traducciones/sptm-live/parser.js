const checks = require('./conditionsCheck')

/*
Handlers expected
  handlerMidi,
  handlerFreq,
  handlerLilySingle,
  handlerLilyMultiple,
  handlerStop,
  handlerBpm,
  handlerSamplePlay
*/

class Parser {
  constructor(handlers = {}) {
    this.state = handlers
  }

  parseString(inStr) {
    let str = inStr.trim()
    let command = ''
    // Single number in midi or range
    command =
      command ||
      checks.midiMatch(str, this.state.handlerMidi, this.state.handlerFreq)
    // Multiple lilypond note
    command =
      command || checks.multipleLily(str, this.state.handlerLilyMultiple)
    // Multiple lilypond note
    command = command || checks.stopMatch(str, this.state.handlerStop)
    // change BPM
    command = command || checks.bpmMatch(str, this.state.handlerBpm)
    // Sample play, with duration and rate
    command = command || checks.sampleMatch(str, this.state.handlerSamplePlay)
    // smplsq
    command = command || checks.smplsqMatch(str, this.state.handlerSmplsq);  
    return command
  }
}

module.exports = Parser
