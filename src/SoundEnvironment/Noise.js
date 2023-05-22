function Noise(aCtx) {
  self = this
  self.audioCtx = aCtx

  self.noise = async function () {
    await self.audioCtx.audioWorklet.addModule('js/random-noise-processor.js')
    self.randomNoiseNode = new AudioWorkletNode(
      self.audioCtx,
      'random-noise-processor'
    )
    // self.gainNode = self.audioCtx.createGain();

    // falta el noise por aqui
    self.gainNoise = self.randomNoiseNode.parameters.get('customGain')
    //self.gainNode.setValueAtTime(0, self.audioCtx.currentTime)
    // self.randomNoiseNode.connect(self.gai);
    console.log('holillas')
  }

  self.gain = function (gain) {
    self.gainNoise.setValueAtTime(gain, self.audioCtx.currentTime)
  }

  self.start = function () {
    console.log('reproducirRuido')
    //self.randomNoiseNode.connect(self.audioCtx.destination);
    self.randomNoiseNode.connect(self.audioCtx.destination)
  }

  self.stop = function () {
    self.randomNoiseNode.disconnect(self.audioCtx.destination)
  }

  self.noise()
}


module.exports = { Noise }
