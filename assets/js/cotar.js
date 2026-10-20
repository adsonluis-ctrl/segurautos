/* Segurautos — motor das páginas de cotação em etapas (auto, empresarial, frotas e cargas).
   Cada página tem <form id="sim" data-sim="auto|empresarial|frotas|cargas">.
   Tipos de campo: text, select, opts (botões), range. A etapa de contato entra no final. */
(function () {
  "use strict";
  var ANOS = ["2027","2026","2025","2024","2023","2022","2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2005 a 2009","Anterior a 2005"];
  var SIMS = {
    auto: {
      nome: "Seguro auto",
      ok: "Um especialista da Segurautos compara as seguradoras e envia as melhores opções para você.",
      steps: [
        { tab: "Veículo", t: "Conte sobre o seu veículo", s: "Com esses dados as seguradoras calculam o valor do seguro.", f: [
          { id: "modelo", l: "Marca e modelo", type: "text", ph: "Ex.: Toyota Corolla XEi", req: 1, full: 1 },
          { id: "ano", l: "Ano do modelo", type: "select", o: ANOS, req: 1 },
          { id: "placa", l: "Placa", type: "text", ph: "ABC1D23", up: 1 },
          { id: "uso", l: "Uso do veículo", type: "opts", o: ["Particular","Trabalho","Aplicativo","Misto"], c: 4, req: 1, full: 1 } ] },
        { tab: "Condutor", t: "Sobre o condutor principal", s: "Quem mais dirige o veículo influencia o preço do seguro.", f: [
          { id: "idade", l: "Idade do condutor", type: "select", o: ["18 a 25 anos","26 a 35 anos","36 a 50 anos","51 a 65 anos","Acima de 65 anos"], req: 1 },
          { id: "cep", l: "CEP de pernoite", type: "text", ph: "00000-000", mask: "cep", req: 1 },
          { id: "garagem", l: "O carro dorme em garagem?", type: "opts", o: ["Sim, fechada","Estacionamento","Na rua"], c: 3, req: 1, full: 1 } ] },
        { tab: "Seguro atual", t: "Você já tem seguro?", s: "Se já tiver, a sua classe de bônus pode baratear a renovação.", f: [
          { id: "seguro_atual", l: "Situação atual", type: "opts", o: ["Primeiro seguro","Tenho seguro","Seguro venceu"], c: 3, req: 1, full: 1 },
          { id: "sinistro", l: "Teve sinistro nos últimos 12 meses?", type: "opts", o: ["Não","Sim"], c: 2, req: 1, full: 1 } ] }
      ]
    },
    empresarial: {
      nome: "Seguro empresarial",
      ok: "Um especialista analisa o perfil da empresa e envia as propostas das seguradoras.",
      steps: [
        { tab: "Empresa", t: "Conte sobre a sua empresa", s: "O perfil da empresa define as coberturas e os valores disponíveis.", f: [
          { id: "razao_social", l: "Razão social", type: "text", ph: "Nome da empresa", req: 1, full: 1 },
          { id: "cnpj", l: "CNPJ", type: "text", ph: "00.000.000/0000-00", mask: "cnpj", req: 1 },
          { id: "ramo", l: "Ramo de atividade", type: "select", o: ["Comércio","Indústria","Serviços","Logística e transporte","Tecnologia","Saúde","Outro"], req: 1 } ] },
        { tab: "Cobertura", t: "Qual proteção você precisa?", s: "Defina o patrimônio a proteger e a cobertura mais importante.", f: [
          { id: "patrimonio", l: "Patrimônio a proteger", type: "range", req: 1, min: 100000, max: 5000000, step: 100000, v: 500000, lim: ["R$ 100 mil","R$ 2,5 milhões","R$ 5 milhões"], full: 1 },
          { id: "cobertura", l: "Tipo de cobertura", type: "opts", o: ["Patrimonial","Responsabilidade civil","Vida em grupo","Todas"], c: 4, req: 1, full: 1 } ] },
        { tab: "Detalhes", t: "Alguns detalhes do negócio", s: "As seguradoras usam essas informações para calcular o risco.", f: [
          { id: "funcionarios", l: "Número de funcionários", type: "select", o: ["Até 10","11 a 50","51 a 200","Mais de 200"], req: 1, full: 1 },
          { id: "filiais", l: "Possui filiais?", type: "opts", o: ["Sim","Não"], c: 2, req: 1 },
          { id: "sinistro_3anos", l: "Sinistro nos últimos 3 anos?", type: "opts", o: ["Sim","Não"], c: 2, req: 1 } ] }
      ]
    },
    frotas: {
      nome: "Seguro de frota",
      ok: "Um especialista em frotas monta a proposta com as melhores condições para a sua operação.",
      steps: [
        { tab: "Frota", t: "Conte sobre a sua frota", s: "Essas informações definem o perfil de risco e o valor do seguro.", f: [
          { id: "quantidade", l: "Quantidade de veículos", type: "select", o: ["2 a 5 veículos","6 a 10 veículos","11 a 20 veículos","21 a 50 veículos","Mais de 50 veículos"], req: 1 },
          { id: "cnpj", l: "CNPJ da empresa", type: "text", ph: "00.000.000/0000-00", mask: "cnpj", req: 1 },
          { id: "tipo_veiculo", l: "Tipo de veículo predominante", type: "opts", o: ["Passeio","Utilitários","Caminhões","Motos"], c: 4, req: 1, full: 1 } ] },
        { tab: "Uso", t: "Como a frota é usada?", s: "O uso dos veículos é o principal fator no cálculo do seguro.", f: [
          { id: "uso", l: "Finalidade principal", type: "opts", o: ["Uso interno","Entregas","Transporte de carga","Uso misto"], c: 4, req: 1, full: 1 },
          { id: "pernoite", l: "Onde os veículos pernoitam", type: "opts", o: ["Garagem própria","Pátio locado","Na rua","Varia"], c: 4, req: 1, full: 1 },
          { id: "cep", l: "CEP onde a frota fica", type: "text", ph: "00000-000", mask: "cep", req: 1 } ] },
        { tab: "Responsável", t: "Quem cuida da frota?", s: "Falamos com o responsável para alinhar apólices, renovações e sinistros.", f: [
          { id: "responsavel", l: "Nome do responsável", type: "text", ph: "Nome completo", req: 1 },
          { id: "cargo", l: "Cargo", type: "select", o: ["Proprietário(a) / Sócio(a)","Gestor(a) de frota","Financeiro","Outro"], req: 1 },
          { id: "seguro_atual", l: "A frota já tem seguro?", type: "opts", o: ["Não","Sim, quero comparar","Vence em breve"], c: 3, req: 1, full: 1 } ] }
      ]
    },
    cargas: {
      nome: "Seguro de cargas",
      ok: "Um especialista em transportes indica as coberturas certas e envia as propostas.",
      steps: [
        { tab: "Operação", t: "Conte sobre a sua operação", s: "Isso define as coberturas de transporte certas para você.", f: [
          { id: "tipo_operacao", l: "Tipo de operação", type: "opts", o: ["Carga própria","Transportadora","Refrigerada","Perigosa"], c: 4, req: 1, full: 1 },
          { id: "quantidade", l: "Veículos e carretas", type: "select", o: ["1 a 3","4 a 10","11 a 30","Mais de 30"], req: 1 },
          { id: "cnpj", l: "CNPJ da empresa", type: "text", ph: "00.000.000/0000-00", mask: "cnpj", req: 1 } ] },
        { tab: "Carga", t: "Sobre a carga transportada", s: "O tipo e o valor da carga definem as coberturas RCTR-C, RC-DC e RC-V.", f: [
          { id: "carga", l: "Tipo de carga", type: "text", ph: "Ex.: eletrônicos, grãos, bebidas", req: 1, full: 1 },
          { id: "valor_viagem", l: "Valor médio por viagem", type: "select", o: ["Até R$ 50 mil","R$ 50 mil a R$ 150 mil","R$ 150 mil a R$ 500 mil","Acima de R$ 500 mil"], req: 1 },
          { id: "rotas", l: "Principais rotas", type: "text", ph: "Ex.: São Luís–Teresina" } ] },
        { tab: "Responsável", t: "Quem responde pela operação?", s: "Falamos com o responsável para alinhar apólices, sinistros e renovações.", f: [
          { id: "responsavel", l: "Nome do responsável", type: "text", ph: "Nome completo", req: 1 },
          { id: "cargo", l: "Cargo", type: "select", o: ["Proprietário(a) / Sócio(a)","Gestor(a) de logística","Financeiro","Outro"], req: 1 },
          { id: "tempo", l: "Tempo de mercado da empresa", type: "opts", o: ["Menos de 1 ano","1 a 5 anos","Mais de 5 anos"], c: 3, req: 1, full: 1 } ] }
      ]
    }
  };
  var CONTATO = { tab: "Contato", t: "Para onde enviamos sua cotação?", s: "Você recebe as propostas pelo WhatsApp, sem compromisso.", contato: 1, f: [
    { id: "nome", l: "Nome completo", type: "text", ph: "Seu nome", req: 1, full: 1, ac: "name" },
    { id: "whatsapp", l: "WhatsApp", type: "text", ph: "(98) 90000-0000", mask: "tel", req: 1, ac: "tel" },
    { id: "email", l: "E-mail", type: "text", ph: "seu@email.com", email: 1, ac: "email" },
    { id: "unidade", l: "Unidade de atendimento", type: "opts", o: ["São Luís","Brasília","Outra cidade"], c: 3, req: 1, full: 1 } ] };

  var form = document.getElementById("sim");
  if (!form) return;
  var sim = SIMS[form.getAttribute("data-sim")];
  if (!sim) return;
  var steps = sim.steps.concat([CONTATO]), cur = 0, data = {};
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var masks = {
    tel: function (v) { var d = v.replace(/\D/g, "").slice(0, 11);
      if (d.length <= 2) return d ? "(" + d : "";
      if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
      return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7); },
    cep: function (v) { var d = v.replace(/\D/g, "").slice(0, 8); return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d; },
    cnpj: function (v) { var d = v.replace(/\D/g, "").slice(0, 14);
      return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2"); }
  };
  var brl = function (n) { return "R$ " + Number(n).toLocaleString("pt-BR"); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  form.innerHTML = '<ol class="prog" id="prog" style="grid-template-columns:repeat(' + steps.length + ',1fr)">' +
    steps.map(function (s) { return "<li>" + esc(s.tab) + "</li>"; }).join("") + "</ol>" +
    '<div class="c-body" id="c-body" aria-live="polite"></div>' +
    '<div class="c-foot" id="c-foot"><button type="button" class="back-b" id="b-back">Voltar</button><span class="count" id="count"></span><button type="button" class="btn btn-ink" id="b-next">Continuar</button></div>';
  var body = $("#c-body"), foot = $("#c-foot"), bBack = $("#b-back"), bNext = $("#b-next");

  /* WhatsApp vindo de outra página (?tel=) */
  var telQ = new URLSearchParams(location.search).get("tel");
  if (telQ) data.whatsapp = masks.tel(telQ);

  function field(f) {
    var v = data[f.id] != null ? data[f.id] : "";
    var lab = esc(f.l) + (f.req ? "" : ' <span class="op">(opcional)</span>');
    var h = '<div class="f' + (f.full ? " full" : "") + (f.type === "range" ? " rng" : "") + '" data-f="' + f.id + '">';
    if (f.type === "opts") {
      h += '<span class="lbl" id="l-' + f.id + '">' + lab + '</span><div class="ops c' + (f.c || 2) + '" role="radiogroup" aria-labelledby="l-' + f.id + '">';
      f.o.forEach(function (o) { var on = v === o; h += '<button type="button" class="o' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-v="' + esc(o) + '">' + esc(o) + "</button>"; });
      h += "</div>";
    } else if (f.type === "select") {
      h += '<label for="i-' + f.id + '">' + lab + '</label><select id="i-' + f.id + '"><option value="">Selecione</option>';
      f.o.forEach(function (o) { h += "<option" + (v === o ? " selected" : "") + ">" + esc(o) + "</option>"; });
      h += "</select>";
    } else if (f.type === "range") {
      var val = v || f.v;
      h += '<label for="i-' + f.id + '">' + lab + '</label><output id="o-' + f.id + '">' + brl(val) + '</output><input type="range" id="i-' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="' + f.step + '" value="' + val + '"><div class="lim"><span>' + f.lim.join("</span><span>") + "</span></div>";
    } else {
      var t = f.email ? "email" : f.mask === "tel" ? "tel" : "text";
      var im = f.mask === "tel" ? "tel" : (f.mask ? "numeric" : "");
      h += '<label for="i-' + f.id + '">' + lab + '</label><input id="i-' + f.id + '" type="' + t + '" placeholder="' + esc(f.ph || "") + '" value="' + esc(v) + '"' + (im ? ' inputmode="' + im + '"' : "") + (f.ac ? ' autocomplete="' + f.ac + '"' : "") + (f.up ? ' style="text-transform:uppercase"' : "") + ">";
    }
    return h + "</div>";
  }

  function scrollToCard() {
    var top = form.getBoundingClientRect().top + scrollY - 80;
    if (Math.abs(scrollY - top) > 40) scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
  }

  function render(dir, focus) {
    var st = steps[cur], last = cur === steps.length - 1;
    var h = '<div class="p-anim' + (dir < 0 ? " back" : "") + '"><h2>' + esc(st.t) + '</h2><p class="sub">' + esc(st.s) + '</p><div class="fs">';
    st.f.forEach(function (f) { h += field(f); });
    if (st.contato) h += '<label class="chk" data-f="lgpd"><input type="checkbox" id="i-lgpd"' + (data.lgpd ? " checked" : "") + '><span>Autorizo a Segurautos a usar estes dados para elaborar minha cotação e entrar em contato, conforme a <a href="politica-de-privacidade.html" target="_blank">política de privacidade</a>.</span></label>';
    h += '</div><p class="err" id="err" role="alert" hidden>Preencha os campos destacados para continuar.</p></div>';
    body.innerHTML = h;
    $$("#prog li").forEach(function (li, i) { li.className = i === cur ? "at" : i < cur ? "done" : ""; });
    bBack.hidden = cur === 0;
    $("#count").textContent = (cur + 1) + " de " + steps.length;
    bNext.textContent = last ? "Enviar cotação" : "Continuar";
    bNext.className = "btn " + (last ? "btn-yel" : "btn-ink");
    st.f.forEach(function (f) {
      var el = $("#i-" + f.id);
      if (el && f.mask) el.addEventListener("input", function () { el.value = masks[f.mask](el.value); });
      if (f.type === "range") {
        var paint = function () { el.style.setProperty("--p", ((el.value - f.min) / (f.max - f.min) * 100) + "%"); $("#o-" + f.id).textContent = brl(el.value); };
        el.addEventListener("input", paint); paint();
      }
    });
    if (focus) { scrollToCard(); var first = body.querySelector("input,select,textarea,.o"); if (first && !matchMedia("(max-width:760px)").matches) first.focus({ preventScroll: true }); }
  }

  function collect() {
    steps[cur].f.forEach(function (f) {
      if (f.type === "opts") { var on = body.querySelector('[data-f="' + f.id + '"] .o.on'); data[f.id] = on ? on.getAttribute("data-v") : ""; }
      else { var el = $("#i-" + f.id); data[f.id] = el ? el.value.trim() : ""; }
    });
    if (steps[cur].contato) data.lgpd = $("#i-lgpd").checked;
  }
  function ok(f, v) {
    if (!v) return !f.req;
    if (f.email) return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (f.mask === "tel") return v.replace(/\D/g, "").length >= 10;
    if (f.mask === "cnpj") return v.replace(/\D/g, "").length === 14;
    if (f.mask === "cep") return v.replace(/\D/g, "").length === 8;
    return true;
  }
  function validate() {
    var good = true, first = null;
    steps[cur].f.forEach(function (f) {
      var box = body.querySelector('[data-f="' + f.id + '"]'), g = ok(f, data[f.id]);
      box.classList.toggle("bad", !g);
      if (!g) { good = false; if (!first) first = box.querySelector("input,select,textarea,.o"); }
    });
    if (steps[cur].contato) { var c = body.querySelector('[data-f="lgpd"]'); c.classList.toggle("bad", !data.lgpd); if (!data.lgpd) { good = false; first = first || c.querySelector("input"); } }
    $("#err").hidden = good;
    if (first) first.focus();
    return good;
  }

  body.addEventListener("click", function (e) {
    var o = e.target.closest(".o"); if (!o) return;
    var grp = o.parentNode;
    $$(".o", grp).forEach(function (b) { b.classList.remove("on"); b.setAttribute("aria-checked", "false"); });
    o.classList.add("on"); o.setAttribute("aria-checked", "true");
    grp.parentNode.classList.remove("bad");
  });
  ["input", "change"].forEach(function (ev) { body.addEventListener(ev, function (e) { var b = e.target.closest(".f.bad,.chk.bad"); if (b) b.classList.remove("bad"); }); });
  bNext.addEventListener("click", function () { collect(); if (!validate()) return; if (cur < steps.length - 1) { cur++; render(1, true); } else send(); });
  bBack.addEventListener("click", function () { collect(); if (cur > 0) { cur--; render(-1, true); } });
  form.addEventListener("submit", function (e) { e.preventDefault(); bNext.click(); });
  form.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); bNext.click(); } });

  function resumo() {
    var l = ["Olá! Fiz a simulação de " + sim.nome.toLowerCase() + " no site da Segurautos.", ""];
    steps.forEach(function (st) { st.f.forEach(function (f) { var v = data[f.id]; if (!v) return; if (f.type === "range") v = brl(v); l.push("• " + f.l + ": " + v); }); });
    return l.join("\n");
  }
  function send() {
    var lead = { produto: sim.nome, data: new Date().toISOString(), origem: location.href };
    steps.forEach(function (st) { st.f.forEach(function (f) { lead[f.id] = data[f.id] || ""; }); });
    var p = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { if (p.get(k)) lead[k] = p.get(k); });
    if (SEGURAUTOS.CRM_WEBHOOK) { try { fetch(SEGURAUTOS.CRM_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead), keepalive: true }).catch(function () {}); } catch (err) {} }
    var num = data.unidade === "Brasília" && SEGURAUTOS.WHATSAPP_BSB ? SEGURAUTOS.WHATSAPP_BSB : SEGURAUTOS.WHATSAPP;
    $$("#prog li").forEach(function (li) { li.className = "done"; });
    foot.hidden = true;
    body.innerHTML = '<div class="done p-anim"><div class="ok"><svg viewBox="0 0 32 32"><path d="M8 16.5l5.5 5.5L24 11"/></svg></div>' +
      '<h2>Pronto, ' + esc((data.nome || "").split(" ")[0]) + '.</h2><p class="sub">' + esc(sim.ok) + '</p>' +
      '<div class="btns"><a class="btn btn-yel" target="_blank" rel="noopener" href="' + SEGURAUTOS.wa(resumo(), num) + '">Enviar no WhatsApp</a><a class="btn btn-ghost" href="index.html">Voltar ao início</a></div>' +
      '<ol><li><b>1</b><div><strong>Análise do seu perfil</strong>Levamos suas respostas às seguradoras parceiras.</div></li>' +
      '<li><b>2</b><div><strong>Comparação</strong>Separamos as melhores propostas em custo e cobertura.</div></li>' +
      '<li><b>3</b><div><strong>Contato</strong>Você recebe tudo explicado pelo WhatsApp.</div></li></ol></div>';
    scrollToCard();
  }
  render(1, false);
})();
