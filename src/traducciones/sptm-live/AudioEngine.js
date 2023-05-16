const { Sine } = require('../../../SoundEnvironment/Sine')

const midiToFrequency = (m) => Math.pow(2, (m - 69) / 12) * 440

const AudioEngine = function (audioContext) {
  console.log('audio engine')

  const state = {
    synth: 'sin',
    duration: '1',
    octave: '2',
    bpm: '60',
    gain: 0.5
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
      osc.playDuration(freq,parseInt(state.duration))
      // add osc to hash and stack
      // setup timeout to clear element
      // remove element from hash and stock after timeout
    },
    playFreq: function (freqStr) {
      // Check current oscilator in state
      // create oscilator with current kind
      const osc = new Sine(audioContext)
      osc.gain(state.gain)
      // set frequency with midi num
      const freq = parseInt(freqStr)
      // set duration
      // start playing
      osc.playDuration(freq,parseInt(state.duration))
      // add osc to hash and stack
      // setup timeout to clear element
      // remove element from hash and stock after timeout
    },
    playLilyMultiple: function () {
      alert('lily multi engine')
    },
    stopAll: function () {
      alert('stop engine')
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
