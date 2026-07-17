"use strict";

window.Arenal = window.Arenal || {};

window.Arenal.crearModuloAdminUsuarios = (
    
    dependencias
) => {
    const {
        ROL_ADMIN,
        ROL_FLETERO,
        obtenerUsuarioActual,
        ocultarMensaje,
    } = dependencias;

    let modoFormularioUsuario = "crear";
    let usuarioEditandoId = null;
    let usuarioPasswordId = null;

    const botonNuevoUsuario =
        document.getElementById(
            "boton-nuevo-usuario"
        );

    const mensajeUsuariosAdmin =
        document.getElementById(
            "mensaje-usuarios-admin"
        );

    const cuerpoTablaUsuarios =
        document.getElementById(
            "cuerpo-tabla-usuarios"
        );

    const modalUsuario =
        document.getElementById(
            "modal-usuario"
        );

    const tituloModalUsuario =
        document.getElementById(
            "titulo-modal-usuario"
        );

    const botonCerrarModalUsuario =
        document.getElementById(
            "cerrar-modal-usuario"
        );

    const botonCancelarModalUsuario =
        document.getElementById(
            "cancelar-modal-usuario"
        );

    const botonGuardarUsuario =
        document.getElementById(
            "guardar-usuario"
        );

    const inputNombreUsuarioAdmin =
        document.getElementById(
            "nombre-usuario-admin"
        );

    const inputUsuarioAdmin =
        document.getElementById(
            "usuario-admin"
        );

    const inputPasswordUsuarioAdmin =
        document.getElementById(
            "password-usuario-admin"
        );

    const selectRolUsuarioAdmin =
        document.getElementById(
            "rol-usuario-admin"
        );

    const mensajeModalUsuario =
        document.getElementById(
            "mensaje-modal-usuario"
        );

    const grupoPasswordUsuario =
        document.getElementById(
            "grupo-password-usuario"
        );

    const modalPasswordUsuario =
        document.getElementById(
            "modal-password-usuario"
        );

    const tituloModalPasswordUsuario =
        document.getElementById(
            "titulo-modal-password-usuario"
        );

    const textoUsuarioPasswordSeleccionado =
        document.getElementById(
            "usuario-password-seleccionado"
        );

    const botonCerrarModalPasswordUsuario =
        document.getElementById(
            "cerrar-modal-password-usuario"
        );

    const botonCancelarModalPasswordUsuario =
        document.getElementById(
            "cancelar-modal-password-usuario"
        );

    const botonGuardarPasswordUsuario =
        document.getElementById(
            "guardar-password-usuario"
        );

    const inputNuevaPasswordUsuario =
        document.getElementById(
            "nueva-password-usuario"
        );

    const inputConfirmarPasswordUsuario =
        document.getElementById(
            "confirmar-password-usuario"
        );

    const mensajeModalPasswordUsuario =
        document.getElementById(
            "mensaje-modal-password-usuario"
        );


    function obtenerMensajeErrorUsuario(datos) {
        if (
            datos
            && typeof datos.detail === "string"
        ) {
            return datos.detail;
        }

        if (
            datos
            && Array.isArray(datos.detail)
            && datos.detail.length > 0
        ) {
            return (
                datos.detail[0].msg
                || "Los datos del usuario no son válidos."
            );
        }

        return (
            "No fue posible completar "
            + "la operación del usuario."
        );
    }

    function limpiarModalUsuario() {
        inputNombreUsuarioAdmin.value = "";
        inputUsuarioAdmin.value = "";
        inputPasswordUsuarioAdmin.value = "";

        selectRolUsuarioAdmin.value =
            ROL_FLETERO;

        ocultarMensaje(
            mensajeModalUsuario
        );
    }


    function abrirModalUsuario(
        modo = "crear",
        usuario = null
    ) {
        const usuarioActual =
            obtenerUsuarioActual();

        if (
            !usuarioActual
            || usuarioActual.rol !== ROL_ADMIN
        ) {
            return;
        }

        limpiarModalUsuario();

        modoFormularioUsuario = modo;

        if (
            modo === "editar"
            && usuario
        ) {
            usuarioEditandoId = usuario.id;

            tituloModalUsuario.textContent =
                "Editar usuario";

            inputNombreUsuarioAdmin.value =
                usuario.nombre;

            inputUsuarioAdmin.value =
                usuario.usuario;

            selectRolUsuarioAdmin.value =
                usuario.rol;

            grupoPasswordUsuario.classList.add(
                "oculto"
            );

            inputPasswordUsuarioAdmin.disabled =
                true;

        } else {
            usuarioEditandoId = null;

            tituloModalUsuario.textContent =
                "Nuevo usuario";

            grupoPasswordUsuario.classList.remove(
                "oculto"
            );

            inputPasswordUsuarioAdmin.disabled =
                false;

            selectRolUsuarioAdmin.value =
                ROL_FLETERO;
        }

        modalUsuario.classList.remove(
            "oculto"
        );

        setTimeout(
            () => {
                inputNombreUsuarioAdmin.focus();
                inputNombreUsuarioAdmin.select();
            },
            50
        );
    }


    function cerrarModalUsuario() {
        modalUsuario.classList.add(
            "oculto"
        );

        modoFormularioUsuario = "crear";
        usuarioEditandoId = null;

        limpiarModalUsuario();
    }


    function limpiarModalPasswordUsuario() {
        usuarioPasswordId = null;

        inputNuevaPasswordUsuario.value = "";
        inputConfirmarPasswordUsuario.value = "";

        textoUsuarioPasswordSeleccionado.textContent =
            "";

        ocultarMensaje(
            mensajeModalPasswordUsuario
        );
    }


    function abrirModalPasswordUsuario(usuario) {
        const usuarioActual =
            obtenerUsuarioActual();

        if (
            !usuarioActual
            || usuarioActual.rol !== ROL_ADMIN
        ) {
            return;
        }

        limpiarModalPasswordUsuario();

        usuarioPasswordId = usuario.id;

        tituloModalPasswordUsuario.textContent =
            "Restablecer contraseña";

        textoUsuarioPasswordSeleccionado.textContent =
            `Usuario: ${usuario.nombre} `
            + `(${usuario.usuario})`;

        modalPasswordUsuario.classList.remove(
            "oculto"
        );

        setTimeout(
            () => {
                inputNuevaPasswordUsuario.focus();
            },
            50
        );
    }


    function cerrarModalPasswordUsuario() {
        modalPasswordUsuario.classList.add(
            "oculto"
        );

        limpiarModalPasswordUsuario();
    }

    function inicializarEventos() {
    botonNuevoUsuario.addEventListener(
        "click",
        () => {
            abrirModalUsuario(
                "crear"
            );
        }
    );

    botonCerrarModalUsuario.addEventListener(
        "click",
        cerrarModalUsuario
    );

    botonCancelarModalUsuario.addEventListener(
        "click",
        cerrarModalUsuario
    );

    modalUsuario.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target === modalUsuario
            ) {
                cerrarModalUsuario();
            }
        }
    );

    botonCerrarModalPasswordUsuario.addEventListener(
        "click",
        cerrarModalPasswordUsuario
    );

    botonCancelarModalPasswordUsuario.addEventListener(
        "click",
        cerrarModalPasswordUsuario
    );

    modalPasswordUsuario.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target === modalPasswordUsuario
            ) {
                cerrarModalPasswordUsuario();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (evento) => {
            if (
                evento.key === "Escape"
                && !modalUsuario.classList.contains(
                    "oculto"
                )
            ) {
                cerrarModalUsuario();
            }

            if (
                evento.key === "Escape"
                && !modalPasswordUsuario.classList.contains(
                    "oculto"
                )
            ) {
                cerrarModalPasswordUsuario();
            }
        }
    );
    }

    return {
        elementos: {
            botonNuevoUsuario,
            mensajeUsuariosAdmin,
            cuerpoTablaUsuarios,
            modalUsuario,
            botonCerrarModalUsuario,
            botonCancelarModalUsuario,
            botonGuardarUsuario,
            inputPasswordUsuarioAdmin,
            modalPasswordUsuario,
            botonCerrarModalPasswordUsuario,
            botonCancelarModalPasswordUsuario,
            botonGuardarPasswordUsuario,
            inputConfirmarPasswordUsuario,
        },

        inicializarEventos,
        obtenerMensajeErrorUsuario,
        abrirModalUsuario,
        cerrarModalUsuario,
        abrirModalPasswordUsuario,
        cerrarModalPasswordUsuario,

        obtenerEstado() {
            return {
                modoFormularioUsuario,
                usuarioEditandoId,
                usuarioPasswordId,
            };
        },

        establecerModoFormulario(modo) {
            modoFormularioUsuario = modo;
        },

        establecerUsuarioEditandoId(id) {
            usuarioEditandoId = id;
        },

        establecerUsuarioPasswordId(id) {
            usuarioPasswordId = id;
        },
    };
};