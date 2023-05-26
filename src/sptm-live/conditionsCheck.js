const bjorklund = require('../patrones/bjorklund')

const regex = {
  lilyNote: /^([rabcdefg])(es|is)?(\'+|\,+)?(\d)?$/m,
  lilyNoteMulti: /^(([rabcdefg])(es|is)?(\'+|\,+)?(\d)?\s?)*$/gm,
  euclideanRhythm: /^([rabcdefg])(es|is)?(\'+|\,+)?(\d)?\((\d+)\,(\d+)\)$/m,

  synthSelect: /^(sine|square|sawtooth|triangle)$/m,
  smplsqMatch:
    /smplsq\s((?:\d+(?:\.\d*)?|\.\d+)(?:\s(?:\d+(?:\.\d*)?|\.\d+))*)$/
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

// <lilyNote>(int,int)
function euclideanLily(str, handler) {
  let command
  const euclideanMatch = str.match(regex.euclideanRhythm)
  if (euclideanMatch) {
    // pattern matching
    const [_, note, modifier, octave, duration, k, n] = euclideanMatch
    console.log(euclideanMatch)
    const event = { note, modifier, octave, duration }
    // TODO: Corregir la implementación del silencio/rest
    // const rest = { duration }
    const rest = { note: 'r', modifier, octave, duration }
    const pattern = bjorklund.euclideanPattern(Number(k), Number(n))
    const notesList = pattern.map((x) => {
      if (x === 1) {
        return event
      } else {
        return rest
      }
    })
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

function smplsqMatch(str, handler) {
  let command
  let smpl = str.match(regex.smplsqMatch)
  let sq = []
  if (smpl) {
    sq = smpl[1].split(' ')
    handler(sq)
    command = `smplsq(${sq})`
  }
  return command
}

function synthMatch(str, handler) {
  let command
  // change BPM
  let synthMatch = str.match(regex.synthSelect)
  console.log('test synth')
  if (synthMatch) {
    console.log(synthMatch)
    command = `synthChange(${synthMatch[1]})`
    handler(synthMatch[1])
  }
  return command
}

module.exports = {
  midiMatch,
  multipleLily,
  euclideanLily,
  stopMatch,
  bpmMatch,
  sampleMatch,
  smplsqMatch,
  synthMatch
}
