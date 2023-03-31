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

// Con `append` como primer argumento juntamos mantenemos las listas
// en un sólo nivel de arrays anidados
function zipWith (f, xs, ys) {
  return zip(xs, ys).map(([x,y]) => f(x,y)); // pegado con la función
}

// Función auxiliar para complementar a zipWith
const append = (xs, ys) => xs.concat(ys);

// Prueba. Arrays correspondientes al ritmo (3,8)
let front = Array(3).fill([1]);
let back = Array(5).fill([0]);
console.log('front', front);
console.log('back', back);

// Prueba
console.log('zip(front, back)', zip(front, back));
console.log('zipWith(append, front, back)', zipWith(append, front, back));

// Algoritmo de Bjorklund
function bjorklund(front, back) {
  if (back.length > 1) {
    const newFront = zipWith(append, front, back) // front.map((f, i) => f.concat(back[i]));
    const newBack = diffList(front, back);
    console.log('newFront', newFront); // debug
    console.log('newBack', newBack); // debug
    return bjorklund(newFront, newBack);
  } else {
    console.log('---exit Bjorklund---'); // debug
    return front.concat(back);
  }
}

// Prueba
console.log('bjorklund(front, back)', bjorklund(front,back));
console.log('bjorklund(back, front)', bjorklund(front,back));



// Genera el patrón euclidiano
function euclideanPattern(onsets, pulses) {
  const front = Array(onsets).fill([1]);
  const back = Array(pulses - onsets).fill([0]);
  const bjorklundResult = bjorklund(front, back);
  return bjorklundResult.flat();
}

console.log('euclideanPattern(3,8)', euclideanPattern(3,8));

// TODO: Comparar con la versión mkontogiannis/euclidean-rhythms
// Para comparar estilos (mi investigación) y detectar posibles mejoras del código.

/**
 *  Returns the calculated pattern of equally distributed pulses in total steps
 *  based on the euclidean rhythms algorithm described by Godfried Toussaint
 *
 *  @method  getPattern
 *  @param {Number} pulses Number of pulses in the pattern
 *  @param {Number} steps  Number of steps in the pattern (pattern length)
 */

/* EMPIEZA EL CÓDIGO
export function getPattern(pulses: number, steps: number) {
  if (pulses < 0 || steps < 0 || steps < pulses) {
    return [];
  }

  // Create the two arrays
  let first = new Array(pulses).fill([1]);
  let second = new Array(steps - pulses).fill([0]);

  let firstLength = first.length;
  let minLength = Math.min(firstLength, second.length);

  let loopThreshold = 0;
  // Loop until at least one array has length gt 2 (1 for first loop)
  while (minLength > loopThreshold) {
    // Allow only loopThreshold to be zero on the first loop
    if (loopThreshold === 0) {
      loopThreshold = 1;
    }

    // For the minimum array loop and concat
    for (let x = 0; x < minLength; x++) {
      first[x] = [...first[x], ...second[x]];
    }

    // if the second was the bigger array, slice the remaining elements/arrays and update
    if (minLength === firstLength) {
      second = second.slice(minLength);
    }
    // Otherwise update the second (smallest array) with the remainders of the first
    // and update the first array to include only the extended sub-arrays
    else {
      second = first.slice(minLength);
      first = first.slice(0, minLength);
    }
    firstLength = first.length;
    minLength = Math.min(firstLength, second.length);
  }

  // Build the final array
  const pattern: number[] = [...first.flat(), ...second.flat()];

  return pattern;
}
*/
