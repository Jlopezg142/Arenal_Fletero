"use strict";

window.Arenal = window.Arenal || {};

window.Arenal.config = {
    API_URL: "",
    ROL_ADMIN: "ADMIN",
    ROL_FLETERO: "FLETERO",
};

window.Arenal.estado = {
    ubicacionActual: null,
    usuarioActual: null,
    consultaAdministradorEnProceso: false,
    modoFormularioAgencia: "crear",
    agenciaEditandoId: null,
    modoFormularioUsuario: "crear",
    usuarioEditandoId: null,
    usuarioPasswordId: null,
};