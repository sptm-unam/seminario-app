
// En este documento podríamos agregar entradas y salidas si quisieramos usar el mic de alguna manera 

function AudioSetup(){
    
    var self = this;

    self.randomNoiseNode = 0; 
    self.initAudio = 0;

    // aquí tendría que ir algo así como un control general de tiempo

    self.tempo = 60;

    // inicializar audio 

    self.initAudio = function (){
    var AudioContext = window.AudioContext || window.webkitAudioContext // esto será importante ?
    self.audioCtx = new AudioContext()
	 
	if (navigator.mediaDevices) {
	    navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
		    self.microphone = self.audioCtx.createMediaStreamSource(stream)
		    // samples()
		    // `microphone` can now act like any other AudioNode
		})
		.catch((err) => {
		    console.log(err)
		    // browser unable to access microphone
		})
	} else {
	    // browser unable to access media devices
	    // (update your browser)
	}

	// self.noise(); 

	console.log("iniciar audio");
    }

    self.suspend = function(){
	self.audioCtx.suspend();
	console.log(" detener audio"); 
    }

    // pienso que todo lo del mic puede ir en un módulo aparte
    
    self.startMic = function() {
	self.microphone.connect(self.audioCtx.destination); // conectarse al audioCtx o a otro lado 
    }

    self.stopMic = function() {
	self.microphone.disconnect(self.audioCtx.destination); 
    }

    self.newTempo = function(nT){
	self.tempo = nT; 
    }
    
    // self.initAudio(); // esto es de pruebas, puede ir afuera, el futuro quitar

    
}

function Noise(aCtx){

    self = this;
    self.audioCtx = aCtx;
    
    self.noise = async function(){

	await self.audioCtx.audioWorklet.addModule('js/random-noise-processor.js');
	self.randomNoiseNode = new AudioWorkletNode(self.audioCtx, 'random-noise-processor')
	// self.gainNode = self.audioCtx.createGain();

	// falta el noise por aqui 
	self.gainNoise = self.randomNoiseNode.parameters.get('customGain')
	//self.gainNode.setValueAtTime(0, self.audioCtx.currentTime)
	// self.randomNoiseNode.connect(self.gai); 
	console.log("holillas");
	
    }

    self.gain = function(gain){
	self.gainNoise.setValueAtTime(gain, self.audioCtx.currentTime)
    }
    
    self.start = function(){
	console.log("reproducirRuido");
	//self.randomNoiseNode.connect(self.audioCtx.destination);
	self.randomNoiseNode.connect(self.audioCtx.destination); 
    };
   
    self.stop = function(){
	self.randomNoiseNode.disconnect(self.audioCtx.destination); 
    }

    self.noise(); 

}

function Sine(aCtx){
  
    self = this;
    self.audioCtx =aCtx;
    
    self.sineInit = function(){
	
	// self.audioCtx = aCtx; 
	self.oscillator = self.audioCtx.createOscillator();
	self.gainNode = self.audioCtx.createGain();

	console.log("leeesto");
	self.oscillator.type = "sine";
	self.oscillator.connect(self.gainNode);
	
	self.gainNode.connect(self.audioCtx.destination);
	self.gainNode.gain.setValueAtTime(0, self.audioCtx.currentTime);

	self.gainNode.connect(self.audioCtx.destination); 
	console.log("variableSine"); 
    }

    self.gain = function(gain){
	self.gainNode.gain.setValueAtTime(gain, self.audioCtx.currentTime);
    }

    self.start = function(){
	self.oscillator.start(); 
    }
    
    self.freq = function(freq){
	self.oscillator.frequency.setValueAtTime(freq, self.audioCtx.currentTime); // value in hertz
    }

    self.stop = function(){
	self.oscillator.stop(); 
    }

    self.sineInit();
    
    // falta un método free o algo así 
    
}

// Mic que pueda conectarse a algún lado 

// Muestra y secuencia

function Sample (aCtx, audioFile, aT){ // aquí hace falta poner la secuencia, audiofile está en html 

    self = this; 
    self.audioFile = audioFile;

    self.audioCtx = aCtx;
    self.tempo = aT;
    
    // self.startTime = self.audioCtx.currentTime; // para medir

    // si no hay argumentos, entonces reproduce el audio una sola vez

    // separar load al menos para conceptualmente tener claro que primero se tiene que cargar el archivo. Esto sucede en cada evento
    // self.source;

    self.buffer = 0; 

    self.load = function(){

	self.reader = new FileReader();
        self.reader.onload = function (ev) {
	    // self.audioCtx = aCtx;
	    // console.log(self.audioCtx); 
	    self.audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
		self.source = self.audioCtx.createBufferSource()
		self.source.buffer = buffer;
		self.source.connect(self.audioCtx.destination) // Pregunta: una vez que termina, también se desconecta? 
		self.source.start(0) // no es necesario reproducirlo aqui
		console.log("sample"); 
	    })
	}

	self.reader.readAsArrayBuffer(self.audioFile.files[0]); 
	// aquí se reproduce la secuencia 
    }

   
    // self.load(); // esto es mandatory 
   
}

// Pensar que todo lo que suena podría ir a una mezcla general o a una especie de null ( pensando en términos de TD ) y luego esa salida se puede aprovechar para otro procesamiento o para enviar a analizador 

export { AudioSetup, Sine, Noise, Sample }
