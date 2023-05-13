const regex = {
  lilyNote: /^([abcdefg])(es|is)?(\'+|\,+)?(\d)?$/m,
  lilyNoteMulti: /^(([abcdefg])(es|is)?(\'+|\,+)?(\d)?\s?)*$/gm
}

function checkMidiMatch(str, handlerMidi, handlerFreq) {
  let command = ''
  let midiMatch = str.match(/^(\d{1,3})$/gm)
  if (midiMatch) {
    console.log(midiMatch)
    if (parseFloat(midiMatch[0]) < 128) {
      command = `playMidi(${midiMatch[0]})`
      handlerMidi()
    } else {
      command = `playFrequency(${midiMatch[0]})`
      handlerFreq()
    }
  }
  return command
}

function checkLilyNote(str, handler) {
  // Single lilypond note
  let command
  let lilyOctaveUp = str.match(regex.lilyNote)
  if (lilyOctaveUp) {
    console.log(lilyOctaveUp)
    const [_, note, modifier, octave, duration] = lilyOctaveUp
    command = `playLilypond(${note},${modifier},${octave},${duration})`
    handler()
  }
}

function checkMultipleLily(str, handler) {
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
    console.table(notesList)
    command = `playMultipleMidiNum(${notesList.length})`
  }
  return command
}

function checkStop(str, handler) {
  let command
  // period (stop)
  let stopMatch = str.match(/^\.?$/gm)
  if (stopMatch) {
    console.log(stopMatch)
    command = `stopSound()`
    handler()
  }
  return command
}

function changeBPM(str, handler) {
  let command
  // change BPM
  let bpmMatch = str.match(/^(\d+)\s?(BPM|bpm)$/m)
  if (bpmMatch) {
    console.log(bpmMatch)
    command = `bpmChange(${bpmMatch[1]})`
    handler()
  }
  return command
}

function samplePlay(str, handler) {
  let command
  // Sample play, with duration and rate
  let sampleSingle = str.match(/^#(\w+)\s?(\d)?\|?(\d)?$/m)
  if (sampleSingle) {
    console.log(sampleSingle)
    const [_, sample, duration, rate] = sampleSingle
    command = `playSample(${JSON.stringify({ sample, duration, rate })})`
    handler()
  }
}

module.exports = {
  checkMidiMatch,
  checkLilyNote,
  checkMultipleLily,
  checkStop,
  changeBPM,
  samplePlay
}
