import { Sine } from '../SoundEnvironment/Sine'

console.log('index')
const a1 = new AudioContext()
let s1 = new Sine(a1, 'sine')

document.getElementById('sine-seq').addEventListener('click', () => {
  a1.resume()
  console.log('play seq')
  s1.playSeq(440, [1, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25], 1)
})

document.getElementById('sine-seq-stop').addEventListener('click', () => {
  // s1.gain(0)
   s1.stop()
})
