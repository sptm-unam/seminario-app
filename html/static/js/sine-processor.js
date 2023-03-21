
class SineProcessor extends AudioWorkletProcessor {
  process (inputs, outputs, parameters) {
    const output = outputs[0]
    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
          channel[i] = Math.sin(2*Math.PI * 440 * (currentTime + i / sampleRate))
; 
      }
    })
    return true
  }
}

registerProcessor('sine-processor', SineProcessor)
