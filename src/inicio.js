import { SptmAudio } from './controlador'
import { EditorParser } from './editorCodeMirror/editorParser'
import { AudioSetup, Sine, Noise, Sample } from './audioSetup'
import { SPTMController } from './traducciones/sptm-live/SPTMController'


let { parser } = SPTMController()
const { encenderCamaraFunc, detenerCamaraFunc } = SptmAudio()

let a = new AudioSetup() // checar si esto no se contradice con algunas as que aparecen en Hydra

let sine, noise
let parent = document.querySelector('#editor')
let editor = new EditorParser({ noise, sine, parent, parser })
let aF1

const activar = document.getElementById('activar')
activar.addEventListener('click', a.initAudio) // init audio también inicializa el mic, ver si esto se puede quitar

const desactivar = document.getElementById('desactivar')
desactivar.addEventListener('click', a.suspend)

const variableRuido = document.getElementById('variableRuido')
variableRuido.addEventListener('click', function () {
  console.log('Setup noise')
  editor.setNoise(new Noise(a.audioCtx))
})

const reproducirRuido = document.getElementById('reproducirRuido')
reproducirRuido.addEventListener('click', function () {
  editor.getNoise().start()
})

const detenerRuido = document.getElementById('detenerRuido')
detenerRuido.addEventListener('click', function () {
  editor.getNoise().stop()
})

const variableSine = document.getElementById('variableSine')
variableSine.addEventListener('click', function () {
  console.log('Setup sinej')
  editor.setSine(new Sine(a.audioCtx))
})

const reproducirSine = document.getElementById('reproducirSine')
reproducirSine.addEventListener('click', function () {
  editor.getSine().start()
})

const detenerSine = document.getElementById('detenerSine')
detenerSine.addEventListener('click', function () {
  sine.setSine().stop()
})

const sliderRuidoBlanco = document.getElementById('sliderRuidoBlanco')
const sliderSine = document.getElementById('sliderSine')
const sliderFreq = document.getElementById('sliderFreq')

sliderRuidoBlanco.onchange = function () {
  editor.getNoise().gain(sliderRuidoBlanco.value) // aquí se va el problema del audio ctx en estas funciones
}

sliderSine.onchange = function () {
  editor.getSine().gain(sliderSine.value) // lo mismo
}

sliderFreq.onchange = function () {
  editor.getSine().freq(sliderFreq.value) // lo mismo
}

const reproducirMic = document.getElementById('reproducirMic')
reproducirMic.addEventListener('click', function () {
  a.startMic()
})

const detenerMic = document.getElementById('detenerMic')
detenerMic.addEventListener('click', function () {
  a.stopMic()
})

const encenderCamara = document.getElementById('encenderCamara')
encenderCamara.addEventListener('click', encenderCamaraFunc)

const detenerCamara = document.getElementById('detenerCamara')
detenerCamara.addEventListener('click', detenerCamaraFunc)

const audioFile1 = document.getElementById('audio_file1')
const audioFile2 = document.getElementById('audio_file2')

audioFile1.onchange = function () {
  aF1 = new Sample(a.audioCtx, audioFile1)
  aF1.load(a.audioCtx, audioFile1)
  let seq = [1, 0, 1, 0, 1, 0, 1, 0]
  aF1.sequence(seq)
}

audioFile2.onchange = function () {
  let aF2 = new Sample(a.audioCtx, audioFile2)
}
