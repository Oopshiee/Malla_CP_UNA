document.addEventListener("DOMContentLoaded", () => {  
  function obtenerBotones() {
    return document.querySelectorAll(".ramo");
  }
  
  const mensajesAleatorios = [
    "¡Un ramo menos amorcitoo!",
    "Pasar es pasar ea",
    "¡Ánimo ánimo bebé!",
    "Estoy súper orgullosa de ti mi amor",
    "Tú puedes con todo bebé",
    "Estás haciendo un trabajo increíble cariño",
    "Mira como avanzas cariñoo",
    "Un pasito más cerca de la metaa",
    "Se va notando todo el esfuerzo que le pones mi amorr",
    "Ya te mereces una besuqueada"
  ];

  const mensajesEspeciales = {
    "semestre9": "Felicitaciones amorcitooo, es momento de que empieces a practicar tu risa de millonario seriamente",
    "semestre10": "¡Lo lograste cariñoo!, estoy muy orgullosa de ti y tú también deberías de estarlo 💖"
  };

  const idsSemestre9 = ["EMP", "SIA1", "A2", "AG", "CG3"];
  const idsSemestre10 = ["CF6", "EP", "A3", "SIA2"];

  let timeoutMensaje; // para controlar la duración de los mensajes

  function mostrarMensajeAleatorio(){
    const mensaje = mensajesAleatorios[Math.floor(Math.random() * mensajesAleatorios.length)];
    const contenedorMensaje = document.getElementById("mensaje-aleatorio");

    // Cancelar timeout anterior si existe
    clearTimeout(timeoutMensaje);

    // Resetear visibilidad
    contenedorMensaje.style.opacity = 0;
    contenedorMensaje.textContent = mensaje;

    // Forzar reflow para reiniciar transición
    void contenedorMensaje.offsetWidth;

    // Mostrar mensaje
    contenedorMensaje.style.opacity = 1;

    // Ocultar después de 5 segundos
    timeoutMensaje = setTimeout(() => {
      contenedorMensaje.style.opacity = 0;
    }, 5000);
  }

  function mostrarModalEspecial(mensaje) {
    document.getElementById("contenido-modal-especial").textContent = mensaje;
    document.getElementById("modal-especial").style.display = "flex";
  }
  
  function guardarEstado() {
    const estado = {};
    obtenerBotones().forEach(boton => {
      estado[boton.dataset.id] = boton.classList.contains("aprobado");
    });
    localStorage.setItem("estadoRamos", JSON.stringify(estado));
  }

  function cargarEstado() {
    const estadoGuardado = localStorage.getItem("estadoRamos");
    if (!estadoGuardado) return;
    const estado = JSON.parse(estadoGuardado);
    obtenerBotones().forEach(boton => {
      if (estado[boton.dataset.id]) {
        boton.classList.add("aprobado");
      }
    });
  }

  function actualizarEstadoRequisitos() {
    obtenerBotones().forEach(boton => {
      const requisitos = boton.dataset.requisitos;
      if (requisitos) {
        const cumplido = requisitos.split(",").every(id => {
          const req = document.querySelector(`[data-id="${id}"]`);
          return req && req.classList.contains("aprobado");
        });
        boton.disabled = !cumplido;
      }
    });
  }

  function actualizarBarraProgreso() {
    const total = obtenerBotones().length;
    const aprobados = document.querySelectorAll(".ramo.aprobado").length;
    const porcentaje = Math.round((aprobados / total) * 100);
    const barra = document.getElementById("barra-progreso");
    barra.style.width = `${porcentaje}%`;
    document.getElementById("porcentaje-progreso").textContent = `${porcentaje}%`;
  }

  function desmarcarDependientes(ramoId) {
    obtenerBotones().forEach(boton => {
      const requisitos = boton.dataset.requisitos?.split(",") || [];
      if (requisitos.includes(ramoId) && boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
        desmarcarDependientes(boton.dataset.id);
      }
    });
  }

  function perteneceASemestre(id, lista) {
    return lista.includes(id);
  }

  function estanTodosAprobados(lista) {
    return lista.every(id => document.querySelector(`[data-id="${id}"]`)?.classList.contains("aprobado"));
  }

  // Eventos para los botones de ramos
  obtenerBotones().forEach(boton => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.id;

      if (boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
        desmarcarDependientes(id);
      } else {
        boton.classList.add("aprobado");
        mostrarMensajeAleatorio();

        // Mostrar modal solo si este ramo es del semestre y completa todos
        if (perteneceASemestre(id, idsSemestre9) && estanTodosAprobados(idsSemestre9)) {
          mostrarModalEspecial(mensajesEspeciales.semestre9);
        }
        if (perteneceASemestre(id, idsSemestre10) && estanTodosAprobados(idsSemestre10)) {
          mostrarModalEspecial(mensajesEspeciales.semestre10);
        }
      }

      guardarEstado();
      actualizarEstadoRequisitos();
      actualizarBarraProgreso();
    });
  });

  // Evento para cerrar modal
  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-especial").style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target.id === "modal-especial") {
      document.getElementById("modal-especial").style.display = "none";
    }
  });
  
  // Inicializar
  cargarEstado();
  actualizarEstadoRequisitos();
  actualizarBarraProgreso();
});

