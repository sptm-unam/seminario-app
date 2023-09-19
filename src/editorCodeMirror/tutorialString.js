const tutorialString = `// Presiona ctrl+enter para correr la seleccion de texto
// Ritmos euclidianos, de momento solo "sine"
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
.

////////////////////////////////////////////////

// Una aproximación alternativa de esta librería es la granulación y la reproducción de muestras.
// Para ambos casos, es necesario cargar una muestra en la entrada "Seleccionar archivo"
// Los formatos aceptados son mp3, wav ( probar otros formatos ) 

// smplsq reproduce el archivo cargado en una secuencia. Es ideal para reproducir muestras cortas

smplsq 1 0 1 0

// donde los números funcionan como un secuenciador de pasos, 1 encendido 2 apagado

// grain es un granulador que tiene 5 parámetros

grain 0.5 0.4 0.3 0.2 0.1

// Los parámetros de grain son: 
// pointer - posición en el buffer. El parámetro va de 0 (inicio del buffer) a 1 (final del buffer)
// freqScale - cantidad de cambio en términos de frecuencia. 1.0 es normal, 2 el doble, 0.5 la mitad, etc.
// windowSize - tamaño de cada ventana del grano
// overlaps - superposición de los granos
// windowRandRatio - cantidad de aleatoriedad en términos de inicio de reproducción del grano y frecuencia.
`

module.exports = {
  tutorialString
}
