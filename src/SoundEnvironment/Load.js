function Load(aCtx, audioFile){

    self = this; 
    self.buffer = 0;
    self.revBuffer = 0; 
    self.audioCtx = aCtx; 
    self.reader = new FileReader();    
    self.reader.onload = function (ev) {
	self.audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
	    //_________________________________
	    // Pregunta: Será redundante tener una versión invertida del buffer para usarlo en caso de decida poner en reversa la grabación?
	    //_________________________________
	    self.buffer = buffer; 
	    console.log("loaded");
	    // Por defecto podría tener una configuración inicial cuando termine de cargar.
	    
	})
    }	
    
    self.reader.readAsArrayBuffer(audioFile.files[0]);

}

module.exports = { Load }
