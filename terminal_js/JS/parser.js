const regex = {
  lilyNote: /^([abcdefg])(es|is)?(\'+|\,+)?(\d)?$/m,
  lilyNoteMulti: /^(([abcdefg])(es|is)?(\'+|\,+)?(\d)?\s?)*$/gm
}

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
    let command = "N/A"

    // Single number in midi range
    // Single number in frequency range
    let midiMatch = str.match(/^(\d{1,3})$/gm)
    if (midiMatch) {
      console.log(midiMatch)
      if (parseFloat(midiMatch[0]) < 128) {
        command = `playMidi(${midiMatch[0]})`
      } else {
        command = `playFrequency(${midiMatch[0]})`
      }
    }

    // Single lilypond note
    let lilyOctaveUp = str.match(regex.lilyNote)
    if (lilyOctaveUp) {
      console.log(lilyOctaveUp)
      const [_, note, modifier, octave, duration] = lilyOctaveUp
      command = `playLilypond(${note},${modifier},${octave},${duration})`
    }

    // Multiple lilypond note
    let lilyMelodyMatch = str.match(regex.lilyNoteMulti)
    if (lilyMelodyMatch) {
      const notesList = str.split(' ').reduce((prev, current) => {
        let lilyOctaveUp = current.match(regex.lilyNote)
        if (lilyOctaveUp) {
          const [_, note, modifier, octave, duration] = lilyOctaveUp
          prev.push({ note, modifier, octave, duration })
        }
        return prev
      }, [])
      console.table(notesList)
      command = `playMultipleMidiNum(${notesList.length})`
    }

    // period (stop)
    let stopMatch = str.match(/^\.?$/gm)
    if (stopMatch) {
      console.log(stopMatch)
      command = `stopSound()`
    }

    // change BPM
    let bpmMatch = str.match(/^(\d+)\s?(BPM|bpm)$/m)
    if (bpmMatch) {
      console.log(bpmMatch)
      command = `bpmChange(${bpmMatch[1]})`
    }
    let bpmMatchB = str.match(/^(BPM|bpm)\s?(\d+)$/m)
    if (bpmMatch) {
      console.log(bpmMatchB)
      command = `bpmChange(${bpmMatchB[1]})`
    }

    // Sample play, with duration and rate
    let sampleSingle = str.match(/^#(\w+)\s?(\d)?\|?(\d)?$/m)
    if (sampleSingle) {
      console.log(sampleSingle)
      const [_, sample, duration, rate] = sampleSingle
      command = `playSample(${JSON.stringify({sample, duration,rate})})`
    }


    // Sequence of numbers in midi range without modifiers
    console.log(command)
    // Sound wave change
    return command
  }
}

module.exports = Parser
