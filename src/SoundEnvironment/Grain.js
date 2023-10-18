const { map_range } = require('./maprange.js');

class Grain {

    constructor(aCtx, type = 'grain'){
	// Player2(aCtx){ // audiocontext y el archivo a cargar
	
	self = this;
	// se pueden pasar sin ser objetos independientes? Recuerdo que para algo se necesitaban 
	this.audioCtx = aCtx;
	// self.buffer = 0;
	this.futureTickTime = this.audioCtx.currentTime;
	// self.counter = 1,
	this.tempo = 120;
	this.secondsPerBeat = 60 / this.tempo;
	this.counterTimeValue = (this.secondsPerBeat / 4);
	this.isPlaying = false;
	this.timerID = undefined;
	this.gainNode = this.audioCtx.createGain();
	// En el futuro esto podría conectarse a una cadena de efectos para darle un poco de profundidad y brillo.
	// Es posible usar este nodo de ganancia para darle una envolvente a cada grano, 
	this.gainNode.connect(this.audioCtx.destination);
	this.overlap = 1;
	this.counter = 0; 
    }
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

    set = function(buffer, pointer, freqScale, windowSize, overlaps, windowRandRatio){

	// Evaluar si es problemático pasar el buffer si estos parámetros se cambian dinámicamente.
	// Lo que estoy haciendo es determinar estáticamente con set y dinámicamente con parámetros individuales 
	// ¿Será prudente poner el buffer en reversa aquí? 

	//______________________________________________
	//Parece que es el mismo
	//______________________________________________
	
	//self.rev = buffer; // no estoy seguro si se sobreescribe buffer 

	// Si está aquí como que se traba, revisar si puede estar en otro lao
	
	//Array.prototype.reverse.call( self.rev.getChannelData(0) );
        //Array.prototype.reverse.call( self.rev.getChannelData(1) );

	// Estos valores tienen que estar al inicio 
	self = this; 
	this.buffer = buffer; // Primero definir el buffer
	this.pointer = map_range(pointer, 0, 1, 0, this.buffer.duration); // punto de inicio
	// console.log(self.pointer); 
	this.freqScale = freqScale; // Problema con valores negativos
	// self.detune = detune; // se realiza en relación a los valores de freqScale y está dado en cents, donde 0 es el valor original
	this.windowSize = windowSize; // punto final en el codigo tendria que ser pointer punto de inicio y pointer + wS como final
	this.overlaps = overlaps; // cantidad de ventanas. Seguramente esto funciona en una tasa de ventanas/s, en SC es posible usar numeros de punto flotante. Esto necesariamente implicaría que tenemos conocimiento del tiempo. 
	this.windowRandRatio = windowRandRatio; // 
	
	// console.log(self.pointer); 	
	
    }
   
    // Iniciar y detener 
    // No se va a poder con  audioWorklets

    // Esta función generaría los granos 
    
    startGrain = function(time){ // no me queda claro como funciona time

	let algo = (Math.random() * this.windowRandRatio); // este algo podría ser algo más intersante
	// Pensando que el sonido puede estar muy alto
	// La ganancia podría ser una ponderación de la cantidad de overlaps que se suman
	// calcular un tiempo de ataque que corresponda con la duración de la ventana
	this.gainNode.gain.linearRampToValueAtTime(0.75, time + ((this.windowSize+algo)/8)); // Parece que la envolvente funciona 
	// self.gainNode.gain.linearRampToValueAtTime(0, time+self.windowSize+algo); 
	//self.gainNode.gain.setValueAtTime(0.75, self.audioCtx.currentTime);
	// Mientras tanto la reproducción podría ser en loop.
	
	this.source = self.audioCtx.createBufferSource();
	this.source.connect(this.gainNode);

	this.source.buffer = this.buffer;

	// Esto realmente tendría que estar como en espejo
	
	this.source.playbackRate.value = this.freqScale;
	this.source.detune.value = (algo*1000);

	// decidir si puede mantenerse como un factor aparte o si podría depender de windowRandRatio
	// console.log(self.detune + (algo*100));

	//----------------------------------------------
	// importante: si la duración es muy baja, la multiplicación puede alcanzar valores negativos y el programa se traba
	// agregar una envolvente para que el sonido no se escuche tan crudo 
	//----------------------------------------------
	
	this.source.start(self.audioCtx.currentTime+time, this.pointer+algo,this.windowSize+algo);
	// de inmediato, los otros dos parámetros indican inicio y final de la reproducción de la muestra. Hay que ver qué sucede si el inicio y el final no dan un resultado deseado.
	// source.start también podría tener algún tipo de compensación de windowRandRatio
	// solo se reproduce una vez, como no está en loop desaparece cada verz que termina. Entonces tenemos que implementar algo parecido al reloj de player
    }


    // Mientras van a dentro, en el futuro determinar cómo pueden ir afuera

    scheduler = function() {
	if (this.futureTickTime < self.audioCtx.currentTime + 0.1) {
            this.schedule(this.futureTickTime - self.audioCtx.currentTime);
            this.playTick();
	}
	
	//self.timerID = setTimeout(function(){self.scheduler()}, 0);
	this.timerID = setTimeout(self.scheduler.bind(this), 0); 
	//requestAnimationFrame(this.scheduler());
	
    }

    playTick = function() {
	// console.log(self.counter);
	this.secondsPerBeat = (60 / this.tempo) * this.overlaps; // se pone locuaz cuando son valores muy altos pero funciona
	// self.secondsPerBeat = self.overlap; // a ver si funciona pasando oberlap 
	this.counterTimeValue = (this.secondsPerBeat / 1);
	// self.counter += 1; // Creo que ya no es necesario tener un contador
	this.futureTickTime += this.counterTimeValue;
	// Esto ya no aplica porque no hay secuencia 
	/*
	if(self.counter == self.seq.length){
	    self.counter = 0; 
	    }
	*/

    }    

    schedule = function(time){

	// if ya no aplica no hay secuencia
	
	//if(self.seq[self.counter] == 1){ 
	this.startGrain(time);
	// console.log("otro algo"); 
	//}
    }

    start = function(){
	// self.sheduler();
	this.counter = 0;
	this.futureTickTime = this.audioCtx.currentTime;
	this.scheduler(); 
    }
    
    stop = function(){
	clearTimeout(this.timerID);
    }
    
}



module.exports = { Grain } 
