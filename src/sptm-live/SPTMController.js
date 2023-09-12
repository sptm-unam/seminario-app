const Parser = require('./parser')
const AudioEngine = require('./AudioEngine')

const SPTMController = function (audioContext) {
  const engine = AudioEngine(audioContext)
  const handlers = {
    handlerMidi: engine.playMidi,
    handlerFreq: engine.playFreq,
    handlerLilyMultiple: engine.playLilyMultiple,
    handlerStop: engine.stopAll,
    handlerBpm: engine.changeBPM,
    handlerSamplePlay: engine.samplePlay,
    handlerSmplsq: engine.smplsq,
    handlerSynthChange: engine.synthChange,
    handlerGrain: engine.grain
  }
  const parser = new Parser(handlers)
  return {
    parser
  }
}

module.exports = {
  SPTMController
}
