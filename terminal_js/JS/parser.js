const checks = require('./conditionsCheck')

class Parser {
  constructor({
    handlerMidi,
    handlerFreq,
    handlerLilySingle,
    handlerLilyMultiple,
    handlerStop,
    handlerBpm,
    handlerSamplePlay
  }={}) {
    this.state = {
      handlerMidi,
      handlerFreq,
      handlerLilySingle,
      handlerLilyMultiple,
      handlerStop,
      handlerBpm,
      handlerSamplePlay
    }
  }

  parseString(inStr) {
    let str = inStr.trim()
    let command = ''
    // Single number in midi or range
    command = command || checks.midiMatch(str, this.state.handlerMidi, this.state.handlerFreq)
    // Single lily note
    command = command || checks.lilyNoteMatch(str, this.state.handlerLilySingle)
    // Multiple lilypond note
    command = command || checks.multipleLily(str, this.state.handlerLilyMultiple)
    // Multiple lilypond note
    command = command || checks.stopMatch(str, this.state.handlerStop)
    // change BPM
    command = command || checks.bpmMatch(str, this.state.handlerBpm)
    // Sample play, with duration and rate
    command = command || checks.sampleMatch(str, this.state.handlerSamplePlay)
    console.log(command)
    return command
  }
}

module.exports = Parser
