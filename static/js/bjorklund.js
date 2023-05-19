// Generador de ritmos euclidianos

//FUNCIONES AUXILIARES

// Calcula la duración de cada pulso, en microsegundos, en un ritmo euclidiano.
function eventDurationMs(cps, pulses) {
  let milliSecondsPerCycle = (1 / cps) * 10 ** 6;
  let cyclePartition = pulses;
  return Math.round(milliSecondsPerCycle / cyclePartition);
}

// Produce una lista con los elementos que sobran al empatar dos Arrays
function diffList(xs, ys) {
  const lx = xs.length;
  const ly = ys.length;
  if (lx > ly) {
    return xs.slice(ly);
  } else {
    return ys.slice(lx);
  }
}

// Funciones de orden superior para combinar dos Arrays
// Simulan el funcionamento de las correspondientes funciones en Haskell.

function zip(xs, ys) {
  let lx = xs.length;
  let ly = ys.length;
  if(lx <= ly) {
    return xs.map((x,i) => [x,ys[i]]);
  }
  else {
    return ys.map((y,i) => [xs[i],y]);
  }
}


const append = (xs, ys) => xs.concat(ys);

// Con `append` como primer argumento, esta función nos permite juntar las listas
// en un sólo nivel de arrays anidados
function zipWith (f, xs, ys) {
  return zip(xs, ys).map(([x,y]) => f(x,y)); // pegado con la función
}

// Ejemplo: Arrays correspondientes al ritmo (3,8)
let front = Array(3).fill([1]);
let back = Array(5).fill([0]);
console.log(front); // [ [1], [1], [1] ]
console.log(back); // [ [0], [0], [0], [0], [0] ]
console.log(zip(front, back)); // [ [[1], [0]], [[1], [0]], [[1], [0]] ]
console.log(zipWith(append, front, back)); // [ [1,0], [1,0], [1,0] ]

// Algoritmo de Bjorklund
function bjorklund(front, back) {
  if (back.length > 1) {
    const newFront = zipWith(append, front, back)
    const newBack = diffList(front, back);
    return bjorklund(newFront, newBack);
  } else {
    return front.concat(back);
  }
}

// Continua ejemplo:
console.log(bjorklund(front,back)); // [ [1,0,0], [1,0,0], [1,0] ]

// Genera el patrón euclidiano
function euclideanPattern(onsets, pulses) {
  const front = Array(onsets).fill([1]);
  const back = Array(pulses - onsets).fill([0]);
  const bjorklundResult = bjorklund(front, back);
  return bjorklundResult.flat();
}

// Resultado:
console.log(euclideanPattern(3,8)); // [ 1,0,0,1,0,0,1,0 ]

module.exports = { euclideanPattern }
