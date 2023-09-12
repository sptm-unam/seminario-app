const { Sine } = require('../SoundEnvironment/Sine')
const { Player } = require('../SoundEnvironment/Player')
const { Grain } = require('../SoundEnvironment/Grain')
const { Load } = require('../SoundEnvironment/Load')

const {
  midiToFrequency,
  letterToNote,
  durationToTime,
  createTimeId,
  calculateOctave
} = require('./utils')

const AudioEngine = function (audioContext) {
  console.log('audio engine')

  const state = {
    synth: 'sine',
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
      const osc = new Sine(audioContext, state.synth)
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
      const osc = new Sine(audioContext, state.synth)
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
    playLilyMultiple: function (synth, notesList) {
      const osc = new Sine(audioContext, synth || state.synth)
      const freqList = []
      const durationList = []
      let octaveNum = 0
      let currentDuration = 1
      for (let index = 0; index < notesList.length; index++) {
        const { note, octave, duration } = notesList[index]
        octaveNum += calculateOctave(octave)
        const freq = midiToFrequency(12 * (octaveNum + 5) + letterToNote(note))
        freqList.push(freq)
        currentDuration = duration || currentDuration
        durationList.push(durationToTime(currentDuration))
      }
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
    },
    smplsq: function (seq) {
      const audioFile1 = document.getElementById('audio_file1')
      const smpl = new Player(audioContext, audioFile1)
      smpl.sequence(seq)
      addElementToEngine(smpl)
      printState()
    },
    synthChange: function (type) {
      state.synth = type
      console.log(state)
    },
      grain: function (params ){

	  const audioFile1 = document.getElementById('audio_file1')
	  let buffer = 0; 
	  let reader = new FileReader();    
	  let grain; 
	  reader.onload = function (ev) {
	      audioContext.decodeAudioData(ev.target.result).then(function (buffer2) {
		  buffer = buffer2; 
		  console.log("loaded");
		  grain = new Grain(audioContext);
		  grain.set(buffer, parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3]), parseFloat(params[4]));
		  grain.start(); 
		  
	      })
	  }
	  reader.readAsArrayBuffer(audioFile1.files[0]);
	  addElementToEngine(grain);
	  printState(); 
      }
  }
}

module.exports = AudioEngine
