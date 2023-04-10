import {defaultKeymap} from '@codemirror/commands';
import {EditorState, Prec, Compartment} from '@codemirror/state'; 
import {EditorView, basicSetup} from "codemirror"
import {defaultHighlightStyle, HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight"
import {javascript} from "@codemirror/lang-javascript"
import {keymap, KeyBinding} from "@codemirror/view"
import { SptmAudio } from "./controlador"

const { 
    init,
    start,
    startSine,
    suspend,
    reproducirRuidoFunc,
    detenerRuidoFunc,
    reproducirSineFunc,
    detenerSineFunc,
    reproducirMicFunc,
    detenerMicFunc,
    encenderCamaraFunc,
    detenerCamaraFunc,
    iniciarAF1,
    iniciarAF2
 } = SptmAudio()

start()
startSine()

const activar = document.getElementById( 'activar');
activar.addEventListener('click', init);

const desactivar = document.getElementById( 'desactivar');
desactivar.addEventListener('click', suspend);

const reproducirRuido = document.getElementById( 'reproducirRuido');
reproducirRuido.addEventListener('click', reproducirRuidoFunc);

const detenerRuido = document.getElementById( 'detenerRuido');
detenerRuido.addEventListener('click', detenerRuidoFunc);

const reproducirSine = document.getElementById( 'reproducirSine' );
reproducirSine.addEventListener( 'click', reproducirSineFunc );

const detenerSine = document.getElementById( 'detenerSine' );
detenerSine.addEventListener( 'click', detenerSineFunc );

const reproducirMic = document.getElementById( 'reproducirMic' );
reproducirMic.addEventListener( 'click', reproducirMicFunc );

const detenerMic = document.getElementById( 'detenerMic' );
detenerMic.addEventListener( 'click', detenerMicFunc );

const encenderCamara = document.getElementById( 'encenderCamara' );
encenderCamara.addEventListener( 'click', encenderCamaraFunc );

const detenerCamara = document.getElementById('detenerCamara');
detenerCamara.addEventListener( 'click', detenerCamaraFunc);

const audioFile1 = document.getElementById('audio_file1');

const audioFile2 = document.getElementById( 'audio_file2');

audioFile1.onchange = function () {
  iniciarAF1(audioFile1)
}

audioFile2.onchange = function () {
  iniciarAF2(audioFile2)
}

const sliderRuidoBlanco = document.getElementById('sliderRuidoBlanco');
const sliderSine = document.getElementById('sliderSine');

sliderRuidoBlanco.onchange = function () {
  gainNoise.setValueAtTime(sliderRuidoBlanco.value, audioCtx.currentTime)
  //console.log(sliderRuidoBlanco.value);
}

sliderSine.onchange = function () {
  gainSine.setValueAtTime(sliderSine.value, audioCtx.currentTime)
  console.log(sliderSine.value)
}


// TODO: Mover esto a un modulo nuevo
const keymaps = []
keymaps.push(keymap.of({key: 'Ctrl-Enter', run: () => evaluar(), preventDefault: true}))
keymaps.push(keymap.of(defaultKeymap))

let language = new Compartment;

let startState = EditorState.create({
    doc: "// ¡Hola mundo!\n\n// El editor ya tiene highlighter y un estilo génerico (hereda características del estilo general de la página también) \n//También es posible evaluar líneas de código en JS con ctrl+enter\n\nconsole.log(\"control+e y ver en consola (f12)\");\n\n //Por último ya es posible controlar las variables globales de ganancia para la sinusoide y el noise. Primero hay que inicializar el audio (chrome) e iniciar la reproducción de noise o sine. Por el momento se evalúa todo el código (y no línea por línea) entonces las indicaciones se pueden contradecir \n\n//gainNoise.setValueAtTime(0, audioCtx.currentTime);// comentar o descomentar según sea el caso \ngainNoise.setValueAtTime(0.1, audioCtx.currentTime);\n//gainSine.setValueAtTime(0, audioCtx.currentTime);//comentar o descomentar según sea el caso\ngainSine.setValueAtTime(0.1, audioCtx.currentTime);",
    extensions: [
	keymaps,
	basicSetup,
	language.of(javascript()),
	EditorView.lineWrapping
    ]
})

let view = new EditorView({
    state: startState,
    parent: document.querySelector('#editor')
})


function evaluar(){
    const code = view.state.doc.toString()
    console.log(code)
    eval(code); 
    return true
}
