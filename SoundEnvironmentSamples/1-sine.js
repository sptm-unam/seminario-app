import { Sine } from '../SoundEnvironment/Sine'

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
