// En este documento podríamos agregar entradas y salidas si quisieramos usar el mic de alguna manera

const { Sine } = require('./Sine')

function SoundEnvironment() {
  this.soundElements = {}
  this.audioCtx

  this.initAudio = function () {
    var AudioContext = window.AudioContext || window.webkitAudioContext // esto será importante ?
    this.audioCtx = new AudioContext()
  }

  this.suspend = function () {
    this.audioCtx.suspend()
  }

  this.addSine = function () {
    const id = new Date.now().getMilliseconds
    let sine = new Sine(this.audioCtx)
    this.soundElements[id] = sine
    return this.soundElements[id]
  }
}

module.exports = { SoundEnvironment }
