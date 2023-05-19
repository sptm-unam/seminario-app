const midiToFrequency = (m) => Math.pow(2, (m - 69) / 12) * 440

const letterToNote = (letter) => {
  let note
  switch (letter) {
    case 'a':
      note = 9
      break
    case 'b':
      note = 10
      break
    case 'c':
      note = 0
      break
    case 'd':
      note = 2
      break
    case 'e':
      note = 4
      break
    case 'f':
      note = 5
      break
    case 'g':
      note = 7
      break
    case 'r':
      note = -40
    default:
      break
  }
  return note
}

const modifierToNumeric = (modifier) => {
  const value = 0
  switch (modifier) {
    case 'is':
      value = 1
      break
    case 'es':
      value = -1
      break
    default:
      value = 0
      break
  }
  return value
}

const calculateOctave = (octaveModifier) => {
  const upOctave = octaveModifier.filter((e) => e === "'").length
  const downOctave = octaveModifier.filter((e) => e === ',').length
  return upOctave - downOctave
}

const durationToTime = (durationString = 1) => 1 / parseInt(durationString)

const createTimeId = () => `${new Date().getTime()}`
module.exports = {
  midiToFrequency,
  letterToNote,
  modifierToNumeric,
  calculateOctave,
  durationToTime,
  createTimeId
}
