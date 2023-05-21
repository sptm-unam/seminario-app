function Player(aCtx, audioFile) {
  // aquí hace falta poner la secuencia, audiofile está en html

  self = this
  self.audioFile = audioFile

  self.audioCtx = aCtx

  // self.startTime = self.audioCtx.currentTime; // para medir

  // si no hay argumentos, entonces reproduce el audio una sola vez

  // separar load al menos para conceptualmente tener claro que primero se tiene que cargar el archivo. Esto sucede en cada evento
  // self.source;

  self.buffer = 0

  self.futureTickTime = self.audioCtx.currentTime
  self.counter = 1
  self.tempo = 120
  self.secondsPerBeat = 60 / self.tempo
  self.counterTimeValue = self.secondsPerBeat / 4
  self.timerID = undefined
  self.isPlaying = false
  self.seq = [0, 0, 0, 0, 0, 0, 0, 0]

  self.load = function () {
    self.reader = new FileReader()
    self.reader.onload = function (ev) {
      // self.audioCtx = aCtx;
      // console.log(self.audioCtx);
      self.audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
        //self.source = self.audioCtx.createBufferSource()
        //self.source.buffer = buffer; // este estaba antes, ahora solamente queremos que se guarde
        self.buffer = buffer
        //self.source.connect(self.audioCtx.destination) // Pregunta: una vez que termina, también se desconecta?
        //self.source.start() // no es necesario reproducirlo aqui
        console.log('sample')
        // console.log(self.buffer);
        self.counter = 0
        self.futureTickTime = self.audioCtx.currentTime
        self.scheduler()
      })
    }

    self.reader.readAsArrayBuffer(self.audioFile.files[0])
    // aquí se reproduce la secuencia
  }

  self.load()

  self.startSeq = function () {
    self.counter = 0
    self.futureTickTime = self.audioCtx.currentTime
    self.scheduler()
  }

  self.playSource = function (time) {
    console.log('algo')
    self.source = self.audioCtx.createBufferSource()
    self.source.connect(self.audioCtx.destination)
    self.source.buffer = self.buffer
    self.source.start(self.audioCtx.currentTime + time)
  }

  self.schedule = function (time) {
    if (self.seq[self.counter] == 1) {
      self.playSource(time)
      console.log('otro algo')
    }
  }

  self.playTick = function () {
    console.log(self.counter)
    self.secondsPerBeat = 60 / self.tempo
    self.counterTimeValue = self.secondsPerBeat / 1
    self.counter += 1
    self.futureTickTime += self.counterTimeValue
    if (self.counter == self.seq.length) {
      self.counter = 0
    }
  }

  self.scheduler = function () {
    if (self.futureTickTime < self.audioCtx.currentTime + 0.1) {
      self.schedule(self.futureTickTime - self.audioCtx.currentTime)
      self.playTick()
    }

    self.timerID = setTimeout(self.scheduler, 0)
  }

  self.sequence = function (seq) {
    self.seq = seq
  }

  self.stop = function () {
    clearTimeout(self.timerID)
  }

  // console.log(self.buffer);
  // self.load(); // esto es mandatory
}

export { Player }
