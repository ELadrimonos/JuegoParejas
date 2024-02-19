let tablero = [];
let tableroJugador = [];

const elementoTablero = document.getElementById("tablero");
const elementoTiempo = document.getElementById("textoTiempo");
const elementoErrores = document.getElementById("textoErrores");
const elementoUI = document.getElementById("ui");
const inputDificultad = document.getElementById("dificultad");
const botonSalir = document.getElementById('botonSalir');
const footer = document.getElementById('footer');
const sfx = new Audio();
const MAXSONIDO = 0.5;


sfx.volume = MAXSONIDO;

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


// Variables de controles por teclado
let cartaActual = [0,0];
let moverPorTeclado = false;
let timerDesactivarTeclado;

document.addEventListener('keypress', (e) => {
  if (jugando){
    moverPorTeclado = true;
    if (!document.getElementById('controles')) dibujarControlesTeclado();
    let movimiento = false;
    const cartaAnterior = document.getElementById(cartaActual[0] + "," + cartaActual[1])
    clearTimeout(timerDesactivarTeclado);
    switch (e.key) {
      case 'd':
        movimiento = true;
        if (cartaActual[1] < tablero[0].length - 1)
          cartaActual[1]++;
        else if (cartaActual[0] < tablero.length - 1){
          cartaActual[0]++;
          cartaActual[1] = 0;
        }
        break;
      case 'a':
        movimiento = true;

        if (cartaActual[1] - 1 >= 0)
          cartaActual[1]--;
        else if (cartaActual[0] > 0){
          cartaActual[0]--;
          cartaActual[1] = 0;
        }
        break;
      case 's':
        movimiento = true;

        if (cartaActual[0] < tablero.length - 1){
          cartaActual[0]++;
        }
        break;
      case 'w':
        movimiento = true;

        if (cartaActual[0] > 0){
          cartaActual[0]--;
        }
        break;
      case 'e':
      case 'Enter':
        abrirCarta(cartaAnterior);
        break;

    }
    const carta = document.getElementById(cartaActual[0] + "," + cartaActual[1]);
    if (movimiento){
      cartaAnterior.classList.remove('focused');
      carta.classList.add('focused');
    }
    timerDesactivarTeclado = setTimeout(() => {
      moverPorTeclado = false;
      carta.classList.remove('focused');
      document.getElementById('controles').remove();
    }, 5000);
  }

})


botonSalir.addEventListener('focus', function() {
  footer.classList.add('focused');
});

botonSalir.addEventListener('blur', function() {
  footer.classList.remove('focused');
});




document.getElementById('controlSonido').addEventListener('change', () => {
  sfx.volume = document.getElementById('controlSonido').value;
  console.log('VOLUMEN CAMBIADO: ' + sfx.volume)
});

const reproducirSonido = (id) => {
  const carpeta = './sfx/';
  switch (id){
    case 1:
          sfx.src = carpeta + 'RespuestaCorrecta.mp3';
          break;
    case 0:
          sfx.src = carpeta + 'match_start.mp3';
          break;
    case 2:
          sfx.src = carpeta + 'Guitar.mp3';
          break;
    case 3:
          sfx.src = carpeta + 'MuacMuac.mp3';
          break;
    case 4:
          sfx.src = carpeta + 'click.mp3';
          break;
    case 5:
          sfx.src = carpeta + 'fail.mp3';
          break;
    case 6:
          const victoria = 'victory/';
          const extension = '.mp3';
          sfx.src = carpeta + victoria + Math.floor(Math.random() * 7) + extension;
          break;
  }

  sfx.play().then(() => {
    sfx.currentTime = 0;
  });


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
      maxErrores = 10;
      break;
    case '2':
      maxErrores = 4;
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
  reproducirSonido(0)
  document.body.classList.add("partida");
  jugando = true;
  elementoUI.style.visibility = 'visible';
  dibujarTiempo();
  dibujarErrores();
  intervaloTiempo = setInterval(dibujarTiempo, 1000);
  consecutivas = 0;
  cartaActual = [0,0];
  elementoTablero.style.gridTemplateColumns = 'repeat(' + c + ', auto)';
  elementoTablero.style.gridTemplateRows = 'repeat(' + f + ', auto)';

  clics = 0;
  elementosClicados = [];
  puedeClickear = true;

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
  elementoTablero.style.display = 'grid';
  document.getElementById('menu').style.display = 'none';
  guardado()

}


function volverAlMenu() {
  guardado();
  jugando = false;
  puedeClickear = true;
  clearInterval(intervaloTiempo)
  elementoTablero.style.display = 'none';
  elementoUI.style.visibility = 'hidden';
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('modal')?.remove();
  elementoTablero.innerHTML = '';
  document.body.classList.remove("partida");
  document.getElementById('controles')?.remove();

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
  let indices = carta.id.split(',')
  let indiceFila = indices[0]
  let indiceCol = indices[1]

  let noAdivinada = !tableroJugador[indiceFila][indiceCol];


  if (puedeClickear && elementosClicados[0] !== carta && noAdivinada) {
    carta.classList.toggle("abierta");
    carta.classList.remove("focused");
    elementosClicados.push(carta);


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
          } else reproducirSonido(5)
          guardado()

        }, 1000);

      }
      clics = 0;

    }
    else{
      reproducirSonido(4)
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
  reproducirSonido(6)
  document.getElementById('victorias').innerText = 'VICTORIAS: ' + victorias.toString();
  dibujarModal('HAS GANADO!')
}

const dibujarModal = (mensaje) => {
  jugando = false;

  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.innerHTML = `
      <h1>${mensaje}</h1>
      <h2>Numero de victorias: ${victorias}</h2>
      <button onclick="volverAlMenu()">Regresar</button>
`;
  document.body.appendChild(modal);
}

const perderPartida = () => {
  dibujarModal('HAS PERDIDO!')

  reproducirSonido(3)
}

const dibujarControlesTeclado = () => {
  const contenedor = document.createElement('div');
  contenedor.id = 'controles';
  const titulo = document.createElement('h1');
  titulo.innerText = 'Controles por teclado'
  const texto = document.createElement('p');
  texto.innerText = 'Navegar cartas -> WASD\nSeleccionar carta -> E/Enter\nSalir de la partida -> TAB';

  contenedor.appendChild(titulo);
  contenedor.appendChild(texto);
  document.body.appendChild(contenedor);
}