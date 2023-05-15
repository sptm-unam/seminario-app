const AudioEngine = function (audioContext) {
  console.log('audio engine')

  const state = {
    synth: 'sin',
    duration: '1',
    octave: '2',
    bpm: '60'
  }

  const hashNodes = {}
  const stackNodes = []

  return {
    playMidi: function () {
      // Check current oscilator in state
      // create oscilator with current kind
      // set frequency with midi num
      // set duration
      // start playing
      // add osc to hash and stack
      // setup timeout to clear element
      // remove element from hash and stock after timeout
      console.log('engine')
      alert('midi engine')
    },
    playFreq: function () {
      alert('freq engine')
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
