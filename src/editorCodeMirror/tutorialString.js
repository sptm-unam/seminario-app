const tutorialString = `// Presiona ctrl+enter para correr la linea del cursor o la seleccion
// Ritmos euclidianos
c4(3,8)
g8(5,12)
// Presiona ctrl+. para detener la última secuencia
// Notacion live lily
g2 b2
c3 a3 e3
a2 b2 e2 g2
a4 b4 c4 d4 e4

// Cambiar el oscilador de la siguiente secuencia
// sine, triangle, sawtooth, square
square
a3 b3 c3
sawtooth
g4 d4 a4

// Tocar secuencia con elegir sintethizador
sawtooth c3 a3 e3
triangle a3 g3 b3  
sine a3 g3 b3  
square f3 b3 a3  

// Implementado nota simple midi
60
// Implementado frequencia simple
440
// El punto detiene la ultima secuencia reproducida
.`

module.exports = {
  tutorialString
}
