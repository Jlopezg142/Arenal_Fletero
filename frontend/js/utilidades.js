"use strict";

window.Arenal = window.Arenal || {};

window.Arenal.utilidades = (() => {

    function mostrarMensaje(
        elemento,
        mensaje,
        tipo
    ) {
        elemento.textContent = mensaje;

        elemento.classList.remove(
            "oculto",
            "mensaje-exito",
            "mensaje-error"
        );

        elemento.classList.add(
            tipo === "exito"
                ? "mensaje-exito"
                : "mensaje-error"
        );
    }


    function ocultarMensaje(elemento) {
        elemento.textContent = "";

        elemento.classList.add(
            "oculto"
        );

        elemento.classList.remove(
            "mensaje-exito",
            "mensaje-error"
        );
    }


    return {
        mostrarMensaje,
        ocultarMensaje,
    };

})();