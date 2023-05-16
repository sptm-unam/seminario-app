const regex = {
  lilyNote: /^([abcdefg])(es|is)?(\'+|\,+)?(\d)?$/m,
  lilyNoteMulti: /^(([abcdefg])(es|is)?(\'+|\,+)?(\d)?\s?)*$/gm
}

function midiMatch(str, handlerMidi, handlerFreq) {
  let command = ''
  let midiMatch = str.match(/^(\d{1,5})$/gm)
  if (midiMatch) {
    console.log('midi match')
    if (parseFloat(midiMatch[0]) < 128) {
      console.log('parser midi')
      command = `playMidi(${midiMatch[0]})`
      handlerMidi(midiMatch[0])
    } else {
      command = `playFrequency(${midiMatch[0]})`
      handlerFreq(midiMatch[0])
    }
  }
  return command
}

function multipleLily(str, handler) {
  let command
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
    command = `playMultipleMidiNum(${notesList.length})`
    handler(notesList)
  }
  return command
}

function stopMatch(str, handler) {
  let command
  // period (stop)
  let stopMatch = str.match(/^\.?$/gm)
  if (stopMatch) {
    command = `stopSound()`
    handler()
  }
  return command
}

function bpmMatch(str, handler) {
  let command
  // change BPM
  let bpmMatch = str.match(/^(\d+)\s?(BPM|bpm)$/m)
  if (bpmMatch) {
    command = `bpmChange(${bpmMatch[1]})`
    handler(bpmMatch[1])
  }
  return command
}

function sampleMatch(str, handler) {
  let command
  // Sample play, with duration and rate
  let sampleSingle = str.match(/^#(\w+)\s?(\d)?\|?(\d)?$/m)
  if (sampleSingle) {
    const [_, sample, duration, rate] = sampleSingle
    command = `playSample(${JSON.stringify({ sample, duration, rate })})`
    handler({ sample, duration, rate })
  }
  return command
}

module.exports = {
  midiMatch,
  multipleLily,
  stopMatch,
  bpmMatch,
  sampleMatch
}
