import {defaultKeymap} from '@codemirror/commands';
import {EditorState, Prec, Compartment} from '@codemirror/state'; 
import {EditorView, basicSetup} from "codemirror"
import {defaultHighlightStyle, HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight"
import {javascript} from "@codemirror/lang-javascript"
import {keymap, KeyBinding} from "@codemirror/view"

var AudioContext = window.AudioContext || window.webkitAudioContext; // esto será importante ? 
audioCtx = new AudioContext()

let randomNoiseNode;
let sineNode; 
let microphone; 
let video = document.getElementById('videoElement');
let sources = []; 

let gainNoise, gainSine; 

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

const sliderRuidoBlanco = document.getElementById('sliderRuidoBlanco');
const sliderSine = document.getElementById('sliderSine');


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


function init(){
    // audioCtx = new AudioContext();

    if(audioCtx.state === "suspended"){
	audioCtx.resume();
	console.log("iniciar"); 
    }
    
    if (navigator.mediaDevices) {
	navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {
	    
	    microphone = audioCtx.createMediaStreamSource(stream);
	    console.log("hay mic");
	    
	    samples();
	    // `microphone` can now act like any other AudioNode
	}).catch((err) => {
	    // browser unable to access microphone
	    // (check to see if microphone is attached)
	});
    } else {
	// browser unable to access media devices
	// (update your browser)
	}
    
    start();
    startSine();
    
    audioFile1.onchange = function(){
	iniciarAF1(); 
    };

    
    audioFile2.onchange = function(){
	iniciarAF2(); 
    };

    sliderRuidoBlanco.onchange = function(){
	gainNoise.setValueAtTime(sliderRuidoBlanco.value, audioCtx.currentTime);
	//console.log(sliderRuidoBlanco.value); 
    }
    
    sliderSine.onchange = function(){
	gainSine.setValueAtTime(sliderSine.value, audioCtx.currentTime);
	console.log(sliderSine.value); 
    }
    
}

async function start(){
    await audioCtx.audioWorklet.addModule('js/random-noise-processor.js');
    randomNoiseNode = new AudioWorkletNode(audioCtx, 'random-noise-processor')
    gainNoise = randomNoiseNode.parameters.get("customGain");
    gainNoise.setValueAtTime(0, audioCtx.currentTime);
}

async function startSine(){
    await audioCtx.audioWorklet.addModule('js/sine-processor.js');
    sineNode = new AudioWorkletNode(audioCtx, 'sine-processor');
    gainSine = sineNode.parameters.get("customGain");
    gainSine.setValueAtTime(0, audioCtx.currentTime);
}

function suspend(){
    audioCtx.suspend();
    console.log("suspender"); 
}

function reproducirRuidoFunc(){
    randomNoiseNode.connect(audioCtx.destination);
    console.log("reproducirRuido"); 
}

function detenerRuidoFunc(){
    randomNoiseNode.disconnect(audioCtx.destination);
    console.log("detener ruido"); 
}

function reproducirSineFunc(){
    sineNode.connect(audioCtx.destination);
    console.log("iniciar sinusoide"); 
}


function detenerSineFunc(){
    sineNode.disconnect(audioCtx.destination);
    console.log("detener sinusoide"); 
}

function reproducirMicFunc(){
    microphone.connect(audioCtx.destination);
    console.log("iniciar mic"); 
}


function detenerMicFunc(){
    microphone.disconnect(audioCtx.destination);
    console.log("detener mic"); 
}

function encenderCamaraFunc(){
    if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({ video: true })
	    .then(function (stream) {
		video.srcObject = stream;
	    })
	    .catch(function (err0r) {
		console.log("Something went wrong!");
	    });
    }
}

function detenerCamaraFunc(){
    video.srcObject = null; 
}

function iniciarAF1(){

    var reader = new FileReader();
    reader.onload = function(ev) {
	audioCtx.decodeAudioData(ev.target.result).then(function(buffer) {
	    sources[0] = audioCtx.createBufferSource();
	    sources[0].buffer = buffer;
	    console.log("audiofile1");
	    sources[0].connect(audioCtx.destination);
	    sources[0].start(0); 
	});
    };
    reader.readAsArrayBuffer(audioFile1.files[0]);
    
}

function iniciarAF2(){

    var reader = new FileReader();
    reader.onload = function(ev) {
	audioCtx.decodeAudioData(ev.target.result).then(function(buffer) {
	    sources[1] = audioCtx.createBufferSource();
	    sources[1].buffer = buffer;
	    console.log("audiofile2");
	    sources[1].connect(audioCtx.destination);
	    sources[1].start(0); 
	});
    };
    reader.readAsArrayBuffer(audioFile2.files[0]);
    
}

function evaluar(){
    const code = view.state.doc.toString()
    console.log(code)
    eval(code); 
    return true
}
