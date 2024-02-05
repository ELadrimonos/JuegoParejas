const guardado = () => {
    let datosPartidaActual = tablero.join('-').replace(/,/g, '_');
    localStorage.setItem("tableroActual", encodeURIComponent(datosPartidaActual));
    let datosDescubiertosActual = tableroJugador.join('-').replace(/,/g, '_');
    localStorage.setItem("tableroJugadorActual", encodeURIComponent(datosDescubiertosActual));
    localStorage.setItem("victorias", victorias.toString());
    localStorage.setItem("numErrores", numErrores.toString());
    localStorage.setItem("maxErrores", maxErrores.toString());
    localStorage.setItem("jugando", jugando.toString());
    localStorage.setItem("minutos", minutos.toString());
    localStorage.setItem("segundos", segundos.toString());
    localStorage.setItem("dificultadActual", nivelDificultad.toString());
}
const desconcatenar = (cadena) => {
    let arraysFilas = cadena.split('-');
    return arraysFilas.map(fila => fila.split('_').map(elemento => {
        if (elemento === 'true') {
            return true;
        } else if (elemento === 'false') {
            return false;
        } else {
            return elemento;
        }
    }));
}
const cargado = () => {


    let datosGuardadosJugador = localStorage.getItem("tableroJugadorActual");
    let datosGuardadosTablero = localStorage.getItem("tableroActual");

    console.log('CARGANDO LOS SIGUIENTES DATOS: ', [
        "tablero: ", desconcatenar(datosGuardadosTablero),
        "tablero Jugador: ", desconcatenar(datosGuardadosJugador),
        "max Errores: " + localStorage.getItem("maxErrores"),
        "num Errores: " + localStorage.getItem("numErrores"),
        "max victorias: " + localStorage.getItem("victorias"),
        "está jugando: " + localStorage.getItem("jugando"),
        "minutos: " + localStorage.getItem("minutos"),
        "segundos: " + localStorage.getItem("segundos"),
        "nivel dificultad: " + localStorage.getItem("dificultadActual")
        ]);

    tablero = desconcatenar(datosGuardadosTablero);
    tableroJugador = desconcatenar(datosGuardadosJugador);
    maxErrores = parseInt(localStorage.getItem("maxErrores"));
    numErrores = parseInt(localStorage.getItem("numErrores"));
    victorias = parseInt(localStorage.getItem("victorias"));
    jugando = localStorage.getItem("jugando") === 'true';
    minutos = parseInt(localStorage.getItem("minutos"));
    segundos = parseInt(localStorage.getItem("segundos"));
    nivelDificultad = localStorage.getItem("dificultadActual");
}

const comprobarDatosGuardados = () => {
    if (localStorage.getItem('jugando') === 'true'){
        let datosGuardadosJugador = desconcatenar(localStorage.getItem("tableroJugadorActual"));
        const filasIguales = document.getElementById('filas').value == datosGuardadosJugador.length;
        const columnasIguales = document.getElementById('columnas').value == datosGuardadosJugador[0].length;
        const dificultadIgual = document.getElementById('dificultad').value === localStorage.getItem("dificultadActual");
        console.log(dificultadIgual && columnasIguales && filasIguales)
        return dificultadIgual && columnasIguales && filasIguales;
    } else{
        return false;
    }

}