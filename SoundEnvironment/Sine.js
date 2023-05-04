function Sine(aCtx) {
  this.audioCtx = aCtx
  this.oscillator = this.audioCtx.createOscillator()
  this.gainNode = this.audioCtx.createGain()
  this.oscillator.type = 'sine'
  this.oscillator.connect(this.gainNode)

  this.gainNode.connect(this.audioCtx.destination)
  this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)

  this.gainNode.connect(this.audioCtx.destination)

  this.gain = function (gain) {
    this.gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime)
  }

  this.start = function () {
    console.log('START')
    // this.oscillator.start(0)
    this.oscillator.start(this.audioCtx.currentTime)
    this.oscillator.stop(this.audioCtx.currentTime + 1)
  }

  this.freq = function (freq) {
    this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime) // value in hertz
  }

  this.stop = function () {
    this.oscillator.stop()
  }

  this.playDuration = function () {

  }
}

module.exports = { Sine }
