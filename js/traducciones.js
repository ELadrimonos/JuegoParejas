let currentLanguage = 'en';

const translations = {
    'es': {
        'labelControlarAudio': 'Volumen maestro: ',
        'titulo': 'Encuentra las parejas',
        'textoTiempo': "Tiempo: ",
        'botonSalir': 'Salir',
        'errores': 'Errores: ',
        "botonEmpezar": "Empezar",
        'dificultad': "Nivel de dificultad",
        'numColumnas': "Número de columnas",
        'numFilas': 'Número de filas',
        'idioma': 'Cambiar idioma',
        'victorias': 'Victorias: ',
        'mensajeVictoria': 'Has Ganado!!!',
        'mensajeDerrota': 'Has perdido...',
        'tituloTeclado' : 'Controles por teclado',
        'textoTeclado' : 'Navegar cartas -> WASD\nSeleccionar carta -> E/Enter\nSalir de la partida -> TAB',
        'regresar' : 'Regresar',
        'modalVictorias' : 'Número de victorias: ',
        'casual' : 'Casual (errores infinitos)',
        'intermedio': 'Intermedio (10 errores)',
        'avanzado': 'Avanzado (4 errores)',
        'extremo': 'Extremo (1 error)',
        'imposible': 'Quiero sufrir (sin errores)'
    },
    'en': {
        'labelControlarAudio': 'Master volume: ',
        'titulo': 'Find the pairs',
        'textoTiempo': "Time: ",
        'botonSalir': 'Exit',
        'errores': 'Errors: ', // 0/0
        "botonEmpezar": "Start",
        'dificultad': "Difficulty level",
        'numColumnas': "Number of columns",
        'numFilas': 'Number of rows',
        'idioma': 'Change language',
        'victorias': 'Victories: ',
        'mensajeVictoria': 'You Win!!!',
        'mensajeDerrota': 'You lost...',
        'tituloTeclado' : 'Keyboard controls',
        'textoTeclado' : 'Navigate cards -> WASD\nSelect card -> E/Enter\nExit game -> TAB',
        'regresar' : 'Go back to the menu',
        'modalVictorias' : 'Number of victories: ',
        'casual' : 'Can I play, Daddy? (infinite errors)',
        'intermedio': 'Intermediate (10 errors)',
        'avanzado': 'Advanced gamer (4 errors)',
        'extremo': 'Extreme (1 error)',
        'imposible': 'I wanna suffer! (no errors)'

    },
};


function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerText = translations[currentLanguage][key] || key;
        if (element.id === 'victorias' && victorias !== 0) element.innerText += ' ' + victorias.toString();

    });
}

function changeLanguage() {
    currentLanguage = document.getElementById('idioma').value
    applyTranslations();
}

// Inicializar las traducciones cuando la página se carga
document.addEventListener('DOMContentLoaded', applyTranslations);