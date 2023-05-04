import { Sine } from './Sine'

document.addEventListener('click', () => {
  console.log('index')
  const a = new AudioContext()
  let s = new Sine(a)

  s.gain(0.1)
  s.freq(Math.random(1)*440)
  s.start()

//   s.start(a.currentTime + 2)
//   s.stop(a.currentTime + 3)
  //   setTimeout(() => {
  //     s.stop()
  //   }, 1000)

  console.log(s)
})
