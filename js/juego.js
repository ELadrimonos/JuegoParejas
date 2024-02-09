let tablero = [];
let tableroJugador = [];

const elementoTablero = document.getElementById("tablero");
const elementoTiempo = document.getElementById("textoTiempo");
const elementoErrores = document.getElementById("textoErrores");
const elementoUI = document.getElementById("ui");
const inputDificultad = document.getElementById("dificultad");
const sfx = new Audio();


let clics = 0;
let elementosClicados = [];
let puedeClickear = true;

let consecutivas;

let jugando = false;
let nivelDificultad;

let numErrores = 0;
let maxErrores;
let victorias = 0;

let intervaloTiempo;
let segundos;
let minutos;

let handlerConsecutivas;

const reproducirSonido = (id) => {
  const carpeta = './sfx/';
  switch (id){
    case 1:
          sfx.src = carpeta + 'RespuestaCorrecta.mp3';
          break;
    case 2:
          sfx.src = carpeta + 'Guitar.mp3';
          break;
    case 3:
          sfx.src = carpeta + 'MuacMuac.mp3';
          break;

  }
  sfx.play().then(r => sfx.currentTime = 0);

}


const dibujarTiempo = () => {
  segundos++;
  if (segundos % 60 === 0){
    segundos = 0;
    minutos++;
  }
  elementoTiempo.innerText = 'Tiempo: ' + (minutos < 10 ? '0' : '') + minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
}

const dibujarErrores = () => {
  elementoErrores.innerHTML = 'Errores: ' + numErrores + '/' + (maxErrores === -1 ? '&#8734;' : maxErrores)
}

function empezarNuevaPartida(f, c) {
  nivelDificultad = inputDificultad.value;
  switch (nivelDificultad) {
    case '0':
      maxErrores = -1;
      break;
    case '1':
      maxErrores = 6;
      break;
    case '2':
      maxErrores = 3;
      break;
    case '3':
      maxErrores = 1;
      break;
    case '4':
      maxErrores = 0;
      break;
  }

  segundos = 0;
  minutos = 0;
  numErrores = 0;

  tablero = new Array(f);
  tableroJugador = new Array(f);
  for (let i = 0; i < f; i++) {
    tablero[i] = new Array(c).fill(null);
    tableroJugador[i] = new Array(c).fill(false);
  }
  console.log("TABLERO JUGADOR CREADO: " , tableroJugador)

  const arrayValores = new Set;

  do{
    arrayValores.add((Math.floor(Math.random() * Math.floor((f * c)/2))));
  } while (arrayValores.size !== Math.floor(f * c / 2))


  const arrayParejas = [...arrayValores, ...arrayValores]
  arrayParejas.sort(() => Math.random() - 0.5);

  let indiceFila = 0;
  let indiceCol = 0;


  for (let i = 0; i < (c * f); i++) {
    if (i % c === 0 && i !== 0) {
      indiceFila += 1
      indiceCol = 0;
    }

    // No hago un bucle anidado ya que necesito i para recorrer entero el array de parejas
    tablero[indiceFila][indiceCol] = arrayParejas[i]
    tableroJugador[indiceFila][indiceCol] = false

    indiceCol++;

  }
  dibujarTablero(f,c)

}

function dibujarTablero(f, c) {
  document.body.classList.add("partida");
  jugando = true;
  elementoUI.style.visibility = 'visible';
  dibujarTiempo();
  dibujarErrores();
  intervaloTiempo = setInterval(dibujarTiempo, 1000);
  consecutivas = 0;
  elementoTablero.style.gridTemplateColumns = 'repeat(' + c + ', auto)';
  elementoTablero.style.gridTemplateRows = 'repeat(' + f + ', auto)';

  let indiceFila = 0;
  let indiceCol = 0;
  for (let i = 0; i < (c * f); i++) {

    if (i % c === 0 && i !== 0) {
      indiceFila += 1
      indiceCol = 0;
    }

    const carta = document.createElement('div');
    carta.className = 'carta';
    if (!tableroJugador[indiceFila][indiceCol]){
      carta.style.backgroundImage = 'url(./img/carta_' + (i % 2 === 0 ? 'azul' : 'roja') + '.jpg)';
      carta.addEventListener('click', () => abrirCarta(carta));
      carta.classList.add( (i % 2 === 0 ? 'azul' : 'roja') )
    } else{
      carta.classList.add("abierta");
      carta.style.backgroundImage = "url(./img/cartas/" + tablero[indiceFila][indiceCol] + ".png)";
    }
    carta.id = indiceFila + "," + indiceCol;


    elementoTablero.appendChild(carta);
    indiceCol++;

  }
  elementoTablero.style.visibility = 'visible';
  document.getElementById('menu').style.visibility = 'collapse';
  guardado()

}


function volverAlMenu() {
  guardado();
  jugando = false;
  puedeClickear = true;
  clearInterval(intervaloTiempo)
  elementoTablero.style.visibility = 'hidden';
  elementoUI.style.visibility = 'hidden';
  document.getElementById('menu').style.visibility = 'visible';
  document.getElementById('modal')?.remove();
  elementoTablero.innerHTML = '';
  document.body.classList.remove("partida");

}

function todosAdivinados(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (!array[i][j]) {
        return false;
      }
    }
  }
  return true;
}


function generarModalConsecutivas() {
  let carta;
  if (document.getElementById("consecutivas")){
    carta = document.getElementById("consecutivas");
    carta.innerText = consecutivas + " CONSECUTIVAS!!!";
    clearTimeout(handlerConsecutivas)
  } else{
    carta = document.createElement('div');
    carta.id = "consecutivas";
    carta.innerText = consecutivas + " CONSECUTIVAS!!!";
    document.body.appendChild(carta)
  }
  reproducirSonido(2)
  handlerConsecutivas = setTimeout(() => {carta.remove()}, 3000)
}

function abrirCarta(carta) {
  if (puedeClickear && elementosClicados[0] !== carta) {
    carta.classList.toggle("abierta");
    elementosClicados.push(carta);

    let indices = carta.id.split(',')
    let indiceFila = indices[0]
    let indiceCol = indices[1]

    clics++;
    setTimeout(() => {
      carta.style.backgroundImage = "url(./img/cartas/" + tablero[indiceFila][indiceCol] + ".png)";
    }, 150);

    if (clics >= 2) {
      puedeClickear = false;

      let indices2 = elementosClicados[0].id.split(',')
      let indiceFila2 = indices2[0]
      let indiceCol2 = indices2[1]

      if (tablero[indiceFila][indiceCol] === tablero[indiceFila2][indiceCol2]) {
        consecutivas++;
        reproducirSonido(1);
        setTimeout(() => {
          cartaAdivinada(indiceFila, indiceCol);
          cartaAdivinada(indiceFila2, indiceCol2);
          puedeClickear = true;
          elementosClicados = [];
          let todoCorrecto = todosAdivinados(tableroJugador)
          console.log("Todo correcto?: " + todoCorrecto)
          console.log(tableroJugador)
          if (todoCorrecto) ganarPartida();
          else {
            guardado()
            if (consecutivas > 1) {
              generarModalConsecutivas();
            }
          }
        }, 160);

      } else {
        consecutivas = 0;
        setTimeout(() => {
          elementosClicados.forEach(e => {
            e.classList.remove('abierta');
            setTimeout(() => {
              e.style.backgroundImage = 'url(./img/carta_' + (e.classList.contains('azul') ? 'azul' : 'roja') + '.jpg)';
            }, 150);
          });
          puedeClickear = true;
          numErrores++;
          dibujarErrores();
          elementosClicados = [];

          if (numErrores > maxErrores && parseInt(maxErrores) !== -1) {
              perderPartida();
          }
          guardado()

        }, 1000);

      }
      clics = 0;

    }
  }
}

function cartaAdivinada(fila, columna) {
  tableroJugador[fila][columna] = true;

  let carta = document.getElementById(fila + ',' + columna);
  carta.replaceWith(carta.cloneNode(true));

  carta.style.backgroundImage = "url(./img/cartas/" + tablero[fila][columna] + ".png)";

}

const ganarPartida = () => {
  victorias++;
  alert("HAS GANADO!!! VICTORIAS: " + victorias)
  jugando = false;
  volverAlMenu();
}

const perderPartida = () => {
  jugando = false;

  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.innerHTML = `
      <h1>HAS PERDIDO</h1>
      <button onclick="volverAlMenu()">Regresar</button>
`;
  elementoTablero.appendChild(modal);
  reproducirSonido(3)
}