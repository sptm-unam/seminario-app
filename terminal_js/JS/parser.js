import checks from './conditionsCheck'

class Parser {
  constructor(params) {
    this.state = {
      synth: 'sine',
      duration: 1,
      bpm: 60,
      octave: 4,
      note: 60,
      lastPulse: 0,
      nextPulse: 0,
      metronomeOn: false
    }
  }

  parseString(inStr) {
    console.log('>>> Parsing')
    let str = inStr.trim()
    let command = 'N/A'

    // Single number in midi or range
    command = checks.checkMidiMatch(
      str,
      () => console.log('handler midi'),
      () => console.log('handler freq')
    )
    // Single lily note
    command = checks.checkLilyNote(str, () =>
      console.log('handler single lily')
    )
    // Multiple lilypond note
    command = checks.checkMultipleLily(str, () =>
      console.log('handler multiple lily')
    )
    // Multiple lilypond note
    command = checks.checkStop(str, () => console.log('handler stop'))
    // change BPM
    command = checks.changeBPM(str, () => console.log('handler bpm'))
    // Sample play, with duration and rate
    command = checks.samplePlay(str, () => console.log('handler samplePlay'))

    console.log(command)
    alert(command)
    return command
  }
}

module.exports = Parser
