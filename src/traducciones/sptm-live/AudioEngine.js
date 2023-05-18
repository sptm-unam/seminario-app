const { Sine } = require('../../../SoundEnvironment/Sine')
const {
  midiToFrequency,
  letterToNote,
  durationToTime,
  createTimeId
} = require('./utils')

const AudioEngine = function (audioContext) {
  console.log('audio engine')

  const state = {
    synth: 'sin',
    duration: '1',
    octave: '2',
    bpm: '60',
    gain: 0.5,
    lastOsc: null
  }

  const hashNodes = {}
  const stackNodes = []

  function printState() {
    console.log('===> State')
    console.log(hashNodes)
    console.log(stackNodes)
  }

  function addElementToEngine(element) {
    const id = createTimeId()
    console.log({ id })
    hashNodes[id] = element
    stackNodes.push(id)
  }
  
  function stopAndRemoveLast() {
    if (stackNodes.length > 0) {
      const idPop = stackNodes.pop()
      hashNodes[idPop].stop()
      delete hashNodes[idPop]
    } else {
      console.log('Engine empty')
    }
  }

  return {
    playMidi: function (midiNum) {
      // Check current oscilator in state
      // create oscilator with current kind
      const osc = new Sine(audioContext)
      osc.gain(state.gain)
      // set frequency with midi num
      const freq = midiToFrequency(parseInt(midiNum))
      // set duration
      // start playing
      osc.playDuration(freq, parseInt(state.duration))
      // add osc to hash and stack
      // setup timeout to clear element
      // remove element from hash and stock after timeout
      addElementToEngine(osc)
      printState()
    },
    playFreq: function (freqStr) {
      const osc = new Sine(audioContext)
      osc.gain(state.gain)
      const freq = parseInt(freqStr)
      osc.playDuration(freq, parseInt(state.duration))
      // add osc to hash and stack
      // setup timeout to clear element
      // remove element from hash and stock after timeout
      state.lastOsc = osc
      addElementToEngine(osc)
      printState()
    },
    playLilyMultiple: function (notesList) {
      console.table(notesList)
      const osc = new Sine(audioContext)
      const freqList = notesList.map((e) =>
        midiToFrequency(60 + letterToNote(e.note))
      )
      const durationList = notesList.map((e) => durationToTime(e.duration))
      console.log({ freqList })
      console.log({ durationList })
      osc.playList(freqList, durationList)
      osc.gain(state.gain)
      state.lastOsc = osc
      addElementToEngine(osc)
      printState()
    },
    stopAll: function () {
      stopAndRemoveLast()
      printState()
    },
    changeBPM: function () {
      alert('bpm engine')
    },
    samplePlay: function () {
      alert('sample engine')
    }
  }
}

module.exports = AudioEngine
