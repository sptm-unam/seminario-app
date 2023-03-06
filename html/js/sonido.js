var AudioContext = window.AudioContext || window.webkitAudioContext; // esto será importante ? 
audioCtx = new AudioContext()

let randomNoiseNode;

const activar = document.getElementById( 'activar' );
activar.addEventListener( 'click', init );

const desactivar = document.getElementById( 'desactivar' );
desactivar.addEventListener( 'click', suspend );

const reproducirRuido = document.getElementById( 'reproducirRuido' );
reproducirRuido.addEventListener( 'click', reproducirRuidoFunc );

const detenerRuido = document.getElementById( 'detenerRuido' );
detenerRuido.addEventListener( 'click', detenerRuidoFunc );

function init(){
    // audioCtx = new AudioContext();

    if(audioCtx.state === "suspended"){
	audioCtx.resume();
	console.log("iniciar"); 
    }
   
    start();     
}

async function start(){
    await audioCtx.audioWorklet.addModule('js/random-noise-processor.js');
    randomNoiseNode = new AudioWorkletNode(audioCtx, 'random-noise-processor');
    // randomNoiseNode.connect(audioCtx.destination);
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
