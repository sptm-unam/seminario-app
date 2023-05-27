class Sine {
  constructor(aCtx, type = 'sine') {
    aCtx.resume()
    this.audioCtx = aCtx
    this.oscillator = this.audioCtx.createOscillator()
    this.gainNode = this.audioCtx.createGain()
    this.oscillator.type = type
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.audioCtx.destination)
    this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime)
    this.gainNode.connect(this.audioCtx.destination)
  }

  gain = function (gain) {
    this.gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime)
  }

  start = function () {
    console.log('START')
    // this.oscillator.start(0)
    this.oscillator.start(this.audioCtx.currentTime)
    this.oscillator.stop(this.audioCtx.currentTime + 1)
  }

  freq = function (freq) {
    this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime)
  }

  stop = function () {
    this.oscillator.stop()
  }
  gain = function (gain) {
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
  }

  playDuration = function (freq = 440, dur = 0.5, gain = 0.2) {
    console.log('Play duration')
    this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime)
    this.gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime)
    this.oscillator.start(this.audioCtx.currentTime)
    this.oscillator.stop(this.audioCtx.currentTime + dur)
  }

  playList = function (freqList = [440], durationList = [1], gain = 0.2) {
    let time = this.audioCtx.currentTime
    const elementsNum = freqList.length
    this.oscillator.frequency.setValueAtTime(freqList[0], time)
    this.gainNode.gain.setValueAtTime(gain, time)
    this.gainNode.gain.setValueAtTime(0, time + durationList[0])
    time = time + durationList[0]
    this.oscillator.start(time)
    console.log('start play list')
    for (let index = 1; index < 100 * elementsNum; index++) {
      let freq = freqList[index % elementsNum]
      let duration = durationList[index % elementsNum]
      this.oscillator.frequency.setValueAtTime(freq, time)
      this.gainNode.gain.setValueAtTime(gain, time)
      this.gainNode.gain.setValueAtTime(0, time + duration)
      time = time + duration
      // console.log({ index, time, freq, duration })
    }
    this.oscillator.stop(time)
  }
  playSeq = function (freq = 440, seq = [1], dur = 0.25, gain = 0.5) {
    console.log('start play seq')
    let time = this.audioCtx.currentTime
    for (let index = 0; index < 100 * seq.length; index++) {
      // console.log({ index, time })
      let e = seq[index % seq.length]
      this.oscillator.frequency.setValueAtTime(freq, time)
      this.gainNode.gain.setValueAtTime(gain, time)
      this.gainNode.gain.setValueAtTime(gain, time)
      this.gainNode.gain.setValueAtTime(0, time + e * dur * 0.5)
      time = time + e * dur
    }
    this.oscillator.stop(time)
  }
}

module.exports = { Sine }
