import { EditorParser } from './editorCodeMirror/editorParser'
import { SPTMController } from './sptm-live/SPTMController'

var AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = new AudioContext()

let { parser } = SPTMController(audioCtx)

let parent = document.querySelector('#editor')
let editor = new EditorParser({ parent, parser })
