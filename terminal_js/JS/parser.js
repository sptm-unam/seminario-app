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
    console.log(inStr)
    let str = inStr.trim()
    console.log('trimmed string')
    console.log(str)

    // Single number in midi range
    // Single number in frequency range
    let midiMatch = str.match(/^(\d{1,3})$/gm)
    if (midiMatch) {
      console.log(midiMatch)
      console.log(midiMatch.length)
      console.log(midiMatch[0])
      if (parseFloat(midiMatch[0]) < 128) {
        console.log(`playMidi(${midiMatch[0]})`)
      } else {
        console.log(`playFrequency(${midiMatch[0]})`)
      }
    }

    // Single lilypond note
    let lilyOctaveUp = str.match(/^([abcdefg])(es|is)?(\'+|\,+)?$/m)
    if (lilyOctaveUp) {
      console.log(lilyOctaveUp)
      const note =lilyOctaveUp[1] 
      const modifier =lilyOctaveUp[2] 
      const octave =lilyOctaveUp[3] 
      console.log(`playLilypond(${note},${modifier},${octave})`)
    }

    // period (stop)
    let stopMatch = str.match(/^\.?$/gm)
    if (stopMatch) {
      console.log(stopMatch)
      console.log(stopMatch[0])
      console.log(`stopSound()`)
    }

    // change BPM
    let bpmMatch = str.match(/^(\d+)\s?(BPM|bpm)$/m)
    if (bpmMatch) {
      console.log(bpmMatch)
      console.log(bpmMatch[0])
      console.log(bpmMatch[1])
      console.log(`bpmChange(${bpmMatch[1]})`)
    }
    let bpmMatchB = str.match(/^(BPM|bpm)\s?(\d+)$/m)
    if (bpmMatch) {
      console.log(bpmMatchB)
      console.log(bpmMatchB[0])
      console.log(bpmMatchB[1])
      console.log(`bpmChange(${bpmMatchB[1]})`)
    }

    // sequence of letters without modifiers

    // Sequence of numbers in midi range without modifiers

    // Sound wave change
  }
}

module.exports = Parser
