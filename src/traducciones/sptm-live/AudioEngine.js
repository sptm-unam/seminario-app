const { Sine } = require('../../../SoundEnvironment/Sine')
const { midiToFrequency, letterToNote, durationToTime } = require('./utils')

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
    },
    stopAll: function () {
      state.lastOsc.stop()
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
