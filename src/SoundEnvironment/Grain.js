import { map_range } from './maprange.js';

function Grain(aCtx){ // audiocontext y el archivo a cargar

    self = this;
    // se pueden pasar sin ser objetos independientes? Recuerdo que para algo se necesitaban 
    self.audioCtx = aCtx;
    self.buffer = 0;
    self.rev = 0; 
    
    self.futureTickTime = self.audioCtx.currentTime,
    // self.counter = 1,
    self.tempo = 120,
    self.secondsPerBeat = 60 / self.tempo,
    self.counterTimeValue = (self.secondsPerBeat / 4),
    self.timerID = undefined,
    self.isPlaying = false;

    self.overlap = 1; 
    // para reproducir la muestra provisionalmente 

    /*
      
      Parámetros de Warp1 en SuperCollider: numChannels, bufnum, pointer, freqScale, windowSize, envbufnum, overlaps, windowRandRadio
      la definición del tamaño se determina con windowSize y el inicio con pointer.
      Hace falta determinar una especie de envolvente
      
      Parámetros tentativos: pointer, freqScale, windowSize, overlaps, windowRandRatio

      Buffer: El proceso de carga se puee juntar, para asociar la carga del archivo y la codificación en el mismo lugar. Encontrar la forma de pasar la versión normal y la versión en reversa del buffer.  
      Pointer: Tiene que ser un número entre 0 y 1 y se tiene que mapear a la duración de la muestra
      freqScale: 1 es el archivo tal cual, 2 el doble, encontrar soluciones para reversa
      detune : desafinación, pensar que podría quedarse en otro lado para mantener los parámetros originales 
      windowSize: un numero que tiene que ser menor a 1
      overlaps: No me queda claro cómo es la distribución de las ventanas cuanddo se enciman
      windowRandRatio: La distribución anterior podría ser continua o randomizada, este parámetro lo puede lograr. 

      Valores posibles adicionales: paneo, y detune 
      
    */
   
    // self.set = function(buffer, pointer, freqScale, windowSize, overlaps, windowRandRatio){

    self.set = function(buffer, pointer, freqScale, windowSize, overlaps, windowRandRatio){

	// Evaluar si es problemático pasar el buffer si estos parámetros se cambian dinámicamente.
	// Lo que estoy haciendo es determinar estáticamente con set y dinámicamente con parámetros individuales 
	// ¿Será prudente poner el buffer en reversa aquí? 

	//______________________________________________
	//Parece que es el mismo
	//______________________________________________
	// Estos valores tienen que estar al inicio 
	
	self.buffer = buffer; // Primero definir el buffer
	self.pointer = map_range(pointer, 0, 1, 0, self.buffer.duration); // punto de inicio
	// console.log(self.pointer); 
	self.freqScale = freqScale; // Problema con valores negativos
	// self.detune = detune; // se realiza en relación a los valores de freqScale y está dado en cents, donde 0 es el valor original
	self.windowSize = windowSize; // punto final en el codigo tendria que ser pointer punto de inicio y pointer + wS como final
	self.overlaps = overlaps; // cantidad de ventanas. Seguramente esto funciona en una tasa de ventanas/s, en SC es posible usar numeros de punto flotante. Esto necesariamente implicaría que tenemos conocimiento del tiempo. 
	self.windowRandRatio = windowRandRatio; // 
Grain.js	
	// console.log(self.pointer); 	
	
    }
   
    // Iniciar y detener 
    // No se va a poder con  audioWorklets

    // Esta función generaría los granos 
    
    self.startGrain = function(time){ // no me queda claro como funciona time

	let algo = (Math.random() * self.windowRandRatio); // este algo podría ser algo más intersante
	self.gainNode = self.audioCtx.createGain();
	// En el futuro esto podría conectarse a una cadena de efectos para darle un poco de profundidad y brillo.
	// Es posible usar este nodo de ganancia para darle una envolvente a cada grano, 
	self.gainNode.connect(self.audioCtx.destination);
	// Pensando que el sonido puede estar muy alto
	// La ganancia podría ser una ponderación de la cantidad de overlaps que se suman
	// calcular un tiempo de ataque que corresponda con la duración de la ventana
	self.gainNode.gain.linearRampToValueAtTime(0.5, time + ((self.windowSize+algo)/8)); // Parece que la envolvente funciona 
	self.gainNode.gain.linearRampToValueAtTime(0, time+self.windowSize+algo); 
	self.gainNode.gain.setValueAtTime(0.5, self.audioCtx.currentTime);
	// Mientras tanto la reproducción podría ser en loop.
	self.source = self.audioCtx.createBufferSource();
	self.source.connect(self.gainNode);

	if(self.freqScale < 0){
	    self.source.buffer = self.rev;
	    // console.log("negativo"); 
	} else{
	    self.source.buffer = self.buffer;
	    // console.log("positivo"); 
	}

	// Esto realmente tendría que estar como en espejo
	
	self.source.playbackRate.value = Math.abs(self.freqScale);
	self.source.detune.value = (algo*1000);

	// decidir si puede mantenerse como un factor aparte o si podría depender de windowRandRatio
	// console.log(self.detune + (algo*100));

	//----------------------------------------------
	// importante: si la duración es muy baja, la multiplicación puede alcanzar valores negativos y el programa se traba
	// agregar una envolvente para que el sonido no se escuche tan crudo 
	//----------------------------------------------
	
	self.source.start(self.audioCtx.currentTime+time, self.pointer+algo, Math.abs(self.windowSize)+algo);
	// de inmediato, los otros dos parámetros indican inicio y final de la reproducción de la muestra. Hay que ver qué sucede si el inicio y el final no dan un resultado deseado.
	// source.start también podría tener algún tipo de compensación de windowRandRatio
	// solo se reproduce una vez, como no está en loop desaparece cada verz que termina. Entonces tenemos que implementar algo parecido al reloj de player
    }

    // Para cambiar el volumen 
    self.gain = function(gain){
	self.gainNode.gain.setValueAtTime(gain, self.audioCtx.currentTime); 
    }

    // Mientras van a dentro, en el futuro determinar cómo pueden ir afuera

    self.scheduler = function() {
	if (self.futureTickTime < self.audioCtx.currentTime + 0.1) {
            self.schedule(self.futureTickTime - self.audioCtx.currentTime);
            self.playTick();
	}
	
	self.timerID = setTimeout(self.scheduler, 0);
    }

    self.playTick = function() {
	// console.log(self.counter);
	let random = Math.random(); 
	self.secondsPerBeat = (60 / self.tempo)*(random*self.windowRandRatio); // se pone locuaz cuando son valores muy altos pero funciona
	// self.secondsPerBeat = self.overlap; // a ver si funciona pasando oberlap 
	self.counterTimeValue = (self.secondsPerBeat / 1);
	// self.counter += 1; // Creo que ya no es necesario tener un contador 
	self.futureTickTime += self.counterTimeValue;

	// Esto ya no aplica porque no hay secuencia 

	/*
	if(self.counter == self.seq.length){
	    self.counter = 0; 
	    }
	*/

    }    

    self.schedule = function(time){

	// if ya no aplica no hay secuencia
	
	//if(self.seq[self.counter] == 1){ 
	self.startGrain(time);
	// console.log("otro algo"); 
	//}
    }

    self.start = function(){
	// self.sheduler();
	self.counter = 0;
	self.futureTickTime = self.audioCtx.currentTime;
	self.scheduler(); 
    }
    
    self.stop = function(){
	clearTimeout(self.timerID);
    }


    
}


module.exports = { Grain } 
