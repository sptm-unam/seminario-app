import {EditorView, keymap} from '@codemirror/view';
import {defaultKeymap} from '@codemirror/commands';

let myView = new EditorView({
  doc: 'console.log("hello")\n\n\n',
  extensions: [keymap.of(defaultKeymap)],
    parent: document.querySelector('#editor'),
    darktheme: true
})

var AudioContext = window.AudioContext || window.webkitAudioContext; // esto será importante ? 
audioCtx = new AudioContext()

let randomNoiseNode;
let sineNode; 
let microphone; 
let video = document.getElementById('videoElement');
let sources = []; 

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
    
}

async function start(){
    await audioCtx.audioWorklet.addModule('js/random-noise-processor.js');
    randomNoiseNode = new AudioWorkletNode(audioCtx, 'random-noise-processor')
}

async function startSine(){
    await audioCtx.audioWorklet.addModule('js/sine-processor.js');
    sineNode = new AudioWorkletNode(audioCtx, 'sine-processor');
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
