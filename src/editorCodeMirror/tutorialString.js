const tutorialString = `// Presiona ctrl+enter para correr la linea del cursor o la seleccion
// Ritmos euclidianos
c4(3,8)
g8(5,12)
// Presiona ctrl+. para detener la última secuencia
// Notacion live lily
g2 b
c3 a e
a4 b e g
a4 b c d e
a'' b,,, c'''
c d e f g' a b c'
c d8 e f g a3 b c'2 d e f8 g a b c'
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
. `

module.exports = {
  tutorialString
}
