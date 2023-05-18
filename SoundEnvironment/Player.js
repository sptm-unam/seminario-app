class Player{
    constructor(aCtx, type= 'player'){
	aCtx.resume()
	this.audioCtx = aCtx
	this.source = this.audioCtx.createBufferSource() // si se elimina cada vez que termina de reproducirse entonces será relevante ponerlo aquí? 
	this.gainNode = this.audioCtx.createGain()
	this.source.type = type // repetir esto cada vez que se genera una nueva instancia? 
	this.source.connect(this.gainNode)

	this.gainNode.connect(this.audioCtx.destination)
	this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime)

	this.gainNode.connect(this.audioCtx.destination)

	
	this.buffer = 0
	this.futureTickTime = this.audioCtx.currentTime
	this.counter = 1
	this.tempo = 120
	this.secondsPerBeat = 60 / this.tempo
	this.counterTimeValue = (this.secondsPerBeat / 4)
	this.timerID = undefined
	this.isPlaying = false
	this.seq = [0, 0, 0, 0, 0, 0, 0, 0] 
	
	
    }

    load = function(sample) { // mientras podría ser un archivo
	this.reader = new FileReader();
        this.reader.onload = function (ev) {
	    this.audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
		this.buffer = buffer; 
		console.log("loaded");
		//this.counter = 0;
		//this.futureTickTime = this.audioCtx.currentTime;
		//this.scheduler(); 	
	    })
	}
	this.reader.readAsArrayBuffer(this.audioFile.files[0]); 
    }

    gain = function (gain) {
	this.gainNode.gain.setValueAtTime(gain, this.audioCtx.currentTime)
    }

    start = function(time) { // puede tener un parámetro
	console.log('START');
	this.source = this.audioCtx.createBufferSource();
	this.source.connect(this.audioCtx.destination);
	this.source.buffer = this.buffer;
	this.source.start(self.audioCtx.currentTime + time);
    }

    stop = function(){ // también puede llevar algo 
	this.source.stop(); 
    }

    // De aquí en adelante tiene que estar en otro lado 
    // Primero aquí y luego ver si se puede independizar 
    
    startSeq = function() {
	this.counter = 0;
	this.futureTickTime = this.audioCtx.currentTime;
	this.scheduler(); 	
    }

    schedule = function(time){
	if(this.seq[this.counter] != 0){
	    this.start(time); 
	}
    }

    playTick = function(){
	console.log(this.counter);
	this.secondsPerBeat = 60 / this.tempo;
	this.counterTimeValue = (this.secondsPerBeat / 1);
	this.counter += 1;
	this.futureTickTime += this.counterTimeValue;
	if(this.counter == this.seq.length){
	    this.counter = 0; 
	}
    }

    scheduler = function(){
	if (this.futureTickTime < this.audioCtx.currentTime + 0.1) {
            this.schedule(this.futureTickTime - this.audioCtx.currentTime);
            this.playTick();
	}
	this.timerID = setTimeout(this.scheduler, 0);
    }

    sequence = function(seq){
	self.seq = seq; 
    }

    stopSeq = function(){
	clearTimeout(this.timerID); 
    }
     
}

module.exports = { Player } 
