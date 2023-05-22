import { EditorParser } from './editorCodeMirror/editorParser'
import { SPTMController } from './sptm-live/SPTMController'

let parent = document.querySelector('#editor')
let stopSoundObj = document.querySelector('#detenerSeq')
let playLineObj = document.querySelector('#playLine')

var AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = new AudioContext()

let { parser } = SPTMController(audioCtx)
let { playCurrentLine, stopLine } = new EditorParser({ parent, parser })

stopSoundObj.addEventListener('click', () => stopLine())
playLineObj.addEventListener('click', () => playCurrentLine())
