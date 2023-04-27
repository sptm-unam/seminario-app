import {defaultKeymap} from '@codemirror/commands';
import {EditorState, Prec, Compartment} from '@codemirror/state'; 
import {EditorView, basicSetup} from "codemirror"
import {defaultHighlightStyle, HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight"
import {javascript} from "@codemirror/lang-javascript"
import {keymap, KeyBinding} from "@codemirror/view"
import { SptmAudio } from "./controlador"
import { AudioSetup, Sine, Noise } from "./audioSetup"

const { 
    encenderCamaraFunc,
    detenerCamaraFunc,
    iniciarAF1,
    iniciarAF2,
} = SptmAudio()

let a = new AudioSetup;
let sine, noise; 

const activar = document.getElementById( 'activar');
activar.addEventListener('click', a.initAudio ); // init audio también inicializa el mic, ver si esto se puede quitar 

const desactivar = document.getElementById( 'desactivar');
desactivar.addEventListener('click',  a.suspend );

const variableRuido = document.getElementById( 'variableRuido');
variableRuido.addEventListener('click', function(){noise = new Noise(a.audioCtx)});

const reproducirRuido = document.getElementById( 'reproducirRuido');
reproducirRuido.addEventListener('click', function(){noise.start()});

const detenerRuido = document.getElementById( 'detenerRuido');
detenerRuido.addEventListener('click', function(){noise.stop()} );

const variableSine = document.getElementById( 'variableSine');
variableSine.addEventListener('click', function(){sine = new Sine(a.audioCtx)});

const reproducirSine = document.getElementById( 'reproducirSine' );
reproducirSine.addEventListener( 'click', function(){sine.start()} );

const detenerSine = document.getElementById( 'detenerSine' );
detenerSine.addEventListener( 'click', function(){sine.stop()} );

const sliderRuidoBlanco = document.getElementById('sliderRuidoBlanco');
const sliderSine = document.getElementById('sliderSine');
const sliderFreq = document.getElementById('sliderFreq');

sliderRuidoBlanco.onchange = function () {
    noise.gain(sliderRuidoBlanco.value); // aquí se va el problema del audio ctx en estas funciones 
}

sliderSine.onchange = function () {
    sine.gain(sliderSine.value); // lo mismo 
}

sliderFreq.onchange = function () {
    sine.freq(sliderFreq.value); // lo mismo 
}
  
const reproducirMic = document.getElementById( 'reproducirMic' );
reproducirMic.addEventListener( 'click', function(){a.startMic()} );

const detenerMic = document.getElementById( 'detenerMic' );
detenerMic.addEventListener( 'click', function(){a.stopMic()} );

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

// TODO: Mover esto a un modulo nuevo
const keymaps = []
keymaps.push(keymap.of({key: 'Ctrl-Enter', run: () => evaluar(), preventDefault: true}))
keymaps.push(keymap.of(defaultKeymap))

let language = new Compartment;

let startState = EditorState.create({
    doc: "// ¡Hola mundo!\n\n//Ya no hay eval, ahora es posible cambiar las ganancias con la siguiente sintaxis:\n\n//noise gain 0\n//noise gain 0.2\n\n//sine gain 0\n//sine gain 0.2\n\n//Por alguna extraña razón hay que escribir y declarar manualmente\n//Ahora es necesario seleccionar la línea a declarar y ctrl + enter",
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
    
    //const code = view.state.doc.toString()
    //console.log(code)
    // eval(code);

    let firstRange = view.state.selection.ranges.at(0);
    let selectedText = view.state.doc.toString().substring(firstRange.from,firstRange.to);
    console.log(selectedText); 
    const str = selectedText.split(' ');

    
    if(str[0] == "noise" && str[1] == "gain"){
	noise.gain(str[2]); 
	console.log("noise");
    }

    if(str[0] == "sine" && str[1] == "gain"){
	sine.gain(str[2]);
	console.log("sine");
    }
    
    return true

}

