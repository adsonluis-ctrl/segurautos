/* Segurautos — script comum a todas as páginas (menu, WhatsApp, animações). */
var SEGURAUTOS = {
  /* WhatsApp: DDI + DDD + número, só dígitos. */
  WHATSAPP: "5598982563084",
  /* Número da filial de Brasília (vazio = usa o da matriz). */
  WHATSAPP_BSB: "",
  /* URL que recebe os leads em JSON (opcional, ex.: CRM). */
  CRM_WEBHOOK: ""
};
SEGURAUTOS.wa = function (msg, num) {
  return "https://wa.me/" + (num || SEGURAUTOS.WHATSAPP) + "?text=" + encodeURIComponent(msg);
};

(function () {
  "use strict";
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* links de WhatsApp */
  $$("[data-wa]").forEach(function (a) {
    var bsb = /Brasília/.test(a.getAttribute("data-wa")) && SEGURAUTOS.WHATSAPP_BSB;
    a.href = SEGURAUTOS.wa(a.getAttribute("data-wa"), bsb || SEGURAUTOS.WHATSAPP);
    a.target = "_blank"; a.rel = "noopener";
  });

  /* menu do celular */
  var nav = document.getElementById("nav"), burger = document.getElementById("burger");
  function menu(o) { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); document.body.classList.toggle("lock", o); }
  burger.addEventListener("click", function () { menu(!nav.classList.contains("open")); });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });

  /* revelar ao rolar */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".rv").forEach(function (el) { io.observe(el); });
  } else { $$(".rv").forEach(function (el) { el.classList.add("in"); }); }

  var ano = document.getElementById("ano"); if (ano) ano.textContent = new Date().getFullYear();
})();
