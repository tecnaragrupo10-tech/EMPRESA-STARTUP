/* ==========================================================
   GolClip · animaciones de la página de inicio
   - Entrada del inicio (escena 3D, título con máscara, menú,
     palabra gigante, cifras 01–04).
   - Giro de cámara ligado al scroll.
   - Tarjetas que suben al entrar en pantalla.
   Con "reducir movimiento" activado no se anima nada.
   ========================================================== */

(function () {
  'use strict';

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raiz = document.documentElement;

  // Curvas
  var QOUT = 'cubic-bezier(.25,1,.5,1)';   // quart out
  var COUT = 'cubic-bezier(.33,1,.68,1)';  // cubic out

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function animar(el, frames, retraso, duracion, curva) {
    if (!el || !el.animate) return null;
    return el.animate(frames, {
      delay: retraso,
      duration: duracion,
      easing: curva || 'linear',
      fill: 'both'
    });
  }

  /* ---------- 0. Tarjetas del proceso que se dan la vuelta ----------
     Solo giran al pulsarlas (clic o toque) o con Intro/Espacio desde
     el teclado. Se activa también con "reducir movimiento": entonces
     cambian de cara sin giro. */

  $$('.paso').forEach(function (paso) {
    paso.addEventListener('click', function () {
      paso.classList.toggle('girada');
    });
    paso.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        paso.classList.toggle('girada');
      }
    });
  });

  if (reducido) {
    raiz.classList.remove('pre');
    return;
  }

  /* ---------- 1. Entrada del inicio ---------- */

  var CAMARA_FINAL = 'rotateX(56deg) rotateZ(-22deg)';

  function entrada() {
    raiz.classList.remove('pre');

    // Cámara: empieza en vista aérea, ampliada, y gira hasta la vista de grada
    animar($('.escena__camara'), [
      { transform: 'rotateX(0deg) rotateZ(0deg) scale(1.25)' },
      { transform: CAMARA_FINAL }
    ], 0, 1600, QOUT);

    // Menú: cada enlace cae desde detrás de su máscara
    $$('.menu a').forEach(function (a, i) {
      animar(a, [{ transform: 'translateY(-110%)' }, { transform: 'none' }], 100 + i * 100, 300, COUT);
    });

    // Título: baja desde su borde superior. Texto: sube desde el inferior
    var mascaras = $$('.hero .mascara__in');
    animar(mascaras[0], [{ transform: 'translateY(-100%)' }, { transform: 'none' }], 390, 950, COUT);
    animar(mascaras[1], [{ transform: 'translateY(100%)' }, { transform: 'none' }], 450, 900, COUT);

    animar($('.hero .botones'), [{ opacity: 0 }, { opacity: 1 }], 570, 300);

    // Fichas del equipo: nombre con máscara, dorsal, rol, LinkedIn y foto
    animar($('.ficha-hero .mascara__in'), [{ transform: 'translateY(100%)' }, { transform: 'none' }], 390, 950, COUT);
    animar($('.ficha-hero .dorsal'), [
      { opacity: 0, transform: 'translateX(-30px)' },
      { opacity: 1, transform: 'none' }
    ], 250, 800, COUT);
    animar($('.ficha-hero .rol'), [{ opacity: 0 }, { opacity: 1 }], 650, 400);
    animar($('.ficha-hero .linkedin'), [{ opacity: 0 }, { opacity: 1 }], 780, 400);
    animar($('.foto--ficha'), [
      { opacity: 0, transform: 'scale(.8)' },
      { opacity: 1, transform: 'none' }
    ], 150, 1100, QOUT);

    // Palabra gigante: letras en orden 1, 2, 5, 4, 3, 7, 6 (en las dos copias).
    // El desplazamiento continuo lo hace el CSS (.palabra__pista).
    var retrasos = [0, 100, 270, 240, 200, 370, 320];
    $$('.palabra__grupo').forEach(function (grupo) {
      Array.prototype.forEach.call(grupo.children, function (letra, i) {
        animar(letra, [
          { opacity: 0, transform: 'translateY(.06em)' },
          { opacity: 1, transform: 'none' }
        ], 630 + retrasos[i], 450, COUT);
      });
    });

    // Móvil con el resumen
    animar($('.escena__movil'), [
      { opacity: 0, transform: 'translateY(40px)' },
      { opacity: 1, transform: 'none' }
    ], 700, 900, COUT);

    animar($('.escena__rec'), [{ opacity: 0 }, { opacity: 1 }], 970, 230);

    // Cifras 01–04: suben desde su máscara, de izquierda a derecha
    var retrasosCifras = [730, 870, 970, 1000];
    $$('.cifra__in').forEach(function (fila, i) {
      animar(fila, [{ transform: 'translateY(100%)' }, { transform: 'none' }], retrasosCifras[i], 300, COUT);
    });
  }

  /* ---------- 2. Giro de cámara con el scroll ---------- */

  function giroConScroll() {
    var hero = $('.hero');
    var giro = $('.escena__giro');
    if (!hero || !giro) return;

    var pendiente = false;

    function pintar() {
      pendiente = false;
      var p = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
      // La cámara sigue girando y se inclina un poco más al bajar
      giro.style.transform =
        'rotateX(' + (p * 14) + 'deg) rotateZ(' + (-p * 18) + 'deg) translateY(' + (-p * 30) + 'px)';
    }

    window.addEventListener('scroll', function () {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(pintar);
      }
    }, { passive: true });

    pintar();
  }

  /* ---------- 3. Tarjetas que suben al entrar en pantalla ---------- */

  // Curva "deslizar y frenar": tramo recto y luego asentamiento exponencial.
  // f(t) es la fracción de distancia que falta por recorrer.
  function curvaDeslizar(distancia) {
    var frames = [];
    var N = 54;
    for (var k = 0; k <= N; k++) {
      var t = (k / N) * 1.8;
      var f = t < 0.47 ? 1 - 1.506 * t : 0.293 * Math.exp(-(t - 0.47) / 0.232);
      if (k === N) f = 0;
      frames.push({
        offset: k / N,
        opacity: Math.min(1, t / 0.4),
        transform: 'translateY(' + (f * distancia).toFixed(2) + 'px)'
      });
    }
    return frames;
  }

  function revelarAlEntrar() {
    if (!('IntersectionObserver' in window)) return;

    var frames = curvaDeslizar(80);
    var elementos = $$('main .tarjeta, main .precios, main .cita, main .paso, main .etiquetas li');

    elementos.forEach(function (el) { el.classList.add('revelar-pendiente'); });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        observador.unobserve(el);

        // Retraso según su posición dentro de la fila (0, 120, 240… ms, máx. 480)
        var hermanos = Array.prototype.slice.call(el.parentNode.children);
        var lag = Math.min(Math.max(hermanos.indexOf(el), 0), 4) * 120;

        el.classList.remove('revelar-pendiente');
        var anim = el.animate(frames, { delay: lag, duration: 1800, easing: 'linear', fill: 'backwards' });
        // Al terminar se libera el transform para que funcione el hover
        anim.onfinish = function () { anim.cancel(); };
      });
    }, { threshold: 0.15 });

    elementos.forEach(function (el) { observador.observe(el); });
  }

  /* ---------- Arranque ---------- */

  function cuandoFuentes() {
    // Espera a las fuentes (máx. 1,5 s) para que el título no salte al cargar
    var fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var limite = new Promise(function (res) { setTimeout(res, 1500); });
    return Promise.race([fuentes, limite]);
  }

  function iniciar() {
    revelarAlEntrar();
    giroConScroll();
    cuandoFuentes().then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(entrada); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
