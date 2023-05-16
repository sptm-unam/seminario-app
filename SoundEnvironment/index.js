import { Sine } from './Sine'

document.getElementById('1-sine').addEventListener('click', () => {
  console.log('index')
  const a = new AudioContext()
  let s = new Sine(a, 'sine')
  s.playDuration(Math.random(1) * 440, 0.5, 0.2)

  let s2 = new Sine(a, 'sine')
  s2.playDuration(Math.random(1) * 440, 0.5, 0.2)

  let s3 = new Sine(a, 'sine')
  s3.playDuration(Math.random(1) * 440, 0.5, 0.2)
  console.log(s)
})

console.log('index')
const a1 = new AudioContext()
let s1 = new Sine(a1, 'sine')
document.getElementById('sine-seq').addEventListener('click', () => {
  s1.playSeq(440, [1, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25], 1)
})

document.getElementById('sine-seq-stop').addEventListener('click', () => {
  s1.stop()
})
