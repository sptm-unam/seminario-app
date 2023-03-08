var AudioContext = window.AudioContext || window.webkitAudioContext; // esto será importante ? 
audioCtx = new AudioContext()

let randomNoiseNode;
let sineNode; 

const activar = document.getElementById( 'activar' );
activar.addEventListener( 'click', init );

const desactivar = document.getElementById( 'desactivar' );
desactivar.addEventListener( 'click', suspend );

const reproducirRuido = document.getElementById( 'reproducirRuido' );
reproducirRuido.addEventListener( 'click', reproducirRuidoFunc );

const detenerRuido = document.getElementById( 'detenerRuido' );
detenerRuido.addEventListener( 'click', detenerRuidoFunc );

const reproducirSine = document.getElementById( 'reproducirSine' );
reproducirSine.addEventListener( 'click', reproducirSineFunc );

const detenerSine = document.getElementById( 'detenerSine' );
detenerSine.addEventListener( 'click', detenerSineFunc );


function init(){
    // audioCtx = new AudioContext();

    if(audioCtx.state === "suspended"){
	audioCtx.resume();
	console.log("iniciar"); 
    }
   
    start();
    startSine(); 
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
