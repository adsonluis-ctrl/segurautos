/* Segurautos — simulador de consórcio (cotar-consorcio.html).
   ════════════════════════════════════════════════════════════════════
   CONFIGURAÇÃO DAS ADMINISTRADORAS
   Para adicionar uma administradora ou tabela nova, edite só este bloco.
   Cada tipo de bem tem: fundoReserva, seguro (% ao mês sobre o saldo, só PF),
   lanceEmbutido, lanceFixo, redutor (campanha de parcela reduzida; 0 = sem)
   e faixas [{min, max, taxa, prazo, redutor?}]. O redutor da faixa/grupo
   (ex.: 0.5 = parcela 50% menor até a contemplação) vale mais que o do tipo.
   Administradora sem tabela para um tipo (tipos[X] ausente) aparece como
   "sob consulta" e leva direto para o consultor.
   ════════════════════════════════════════════════════════════════════ */
var BENS = {
  IMV: { nome: "Imóvel", passo: 10000, foto: "assets/img/bem-imovel.webp",
    ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/></svg>' },
  AUT: { nome: "Automóvel", passo: 5000, foto: "assets/img/bem-automovel.webp",
    ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13" r=".8"/><circle cx="16.5" cy="13" r=".8"/></svg>' },
  PES: { nome: "Pesados", passo: 10000, foto: "assets/img/bem-pesados.webp",
    ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>' },
  SRV: { nome: "Serviços", passo: 1000, foto: "assets/img/bem-servicos.webp",
    ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg>' }
};

var ADMINS = [
  { id: "porto", nome: "Porto Bank", logo: "assets/img/adm-porto.webp",
    tipos: {
      IMV: { fundoReserva: 0.02, seguro: 0.00038, lanceEmbutido: 0.30, lanceFixo: 0.40, redutor: 0,
        faixas: [{ min: 70000, max: 140000, taxa: 0.2370, prazo: 200 }, { min: 140000, max: 280000, taxa: 0.2185, prazo: 200 },
                 { min: 280000, max: 600000, taxa: 0.1995, prazo: 200 }, { min: 600000, max: 1000000, taxa: 0.18525, prazo: 200 }] },
      AUT: { fundoReserva: 0.02, seguro: 0.00038, lanceEmbutido: 0.30, lanceFixo: 0, redutor: 0,
        faixas: [{ min: 30000, max: 70000, taxa: 0.171, prazo: 80 }, { min: 80000, max: 140000, taxa: 0.152, prazo: 90 },
                 { min: 150000, max: 250000, taxa: 0.1425, prazo: 100 }] },
      PES: { fundoReserva: 0.02, seguro: 0.00038, lanceEmbutido: 0.30, lanceFixo: 0.40, redutor: 0,
        faixas: [{ min: 180000, max: 360000, taxa: 0.133, prazo: 120 }] }
    } },
  { id: "mapfre", nome: "Mapfre (BR Consórcios)", logo: "assets/img/adm-mapfre.webp", tipos: {} },
  { id: "bradesco", nome: "Bradesco Consórcios", logo: "assets/img/adm-bradesco.webp", tipos: {} },
  { id: "canopus", nome: "Canopus", logo: "assets/img/adm-canopus.webp", tipos: {} }
];

(function () {
  "use strict";
  var tipo = "IMV", pessoa = "PF", credito = null, admSel = null;
  function g(id) { return document.getElementById(id); }
  if (!g("calc")) return;
  function brl(v) { return "R$ " + Math.round(v).toLocaleString("pt-BR"); }
  function brl2(v) { return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function pct(v) { return (v * 100).toLocaleString("pt-BR", { maximumFractionDigits: 3 }) + "%"; }
  var wa = SEGURAUTOS.wa;

  function faixaDe(t, c) { return t.faixas.find(function (f) { return c >= f.min && c <= f.max; }) || null; }
  function limites(tp) {
    var mn = Infinity, mx = 0;
    ADMINS.forEach(function (a) { var t = a.tipos[tp]; if (!t) return; t.faixas.forEach(function (f) { mn = Math.min(mn, f.min); mx = Math.max(mx, f.max); }); });
    return mn === Infinity ? null : { min: mn, max: mx };
  }
  function calc(a, tp, c, p) {
    var t = a.tipos[tp]; if (!t) return { status: "consulta" };
    var f = faixaDe(t, c); if (!f) return { status: "fora" };
    var saldo = c * (1 + f.taxa + t.fundoReserva), base = saldo / f.prazo, seg = p === "PF" ? saldo * t.seguro : 0;
    var rd = (f.redutor != null ? f.redutor : t.redutor) || 0;
    var cheia = base + seg, red = rd ? base * (1 - rd) + seg : null;
    return { status: "ok", parcela: red || cheia, cheia: cheia, reduzida: red, prazo: f.prazo, taxa: f.taxa, fr: t.fundoReserva,
      le: t.lanceEmbutido, lf: t.lanceFixo, seguro: seg, rd: rd };
  }

  function renderTabs() {
    g("tabs").innerHTML = Object.keys(BENS).map(function (k) {
      return '<button type="button" class="tab' + (k === tipo ? " at" : "") + '" data-t="' + k + '" aria-pressed="' + (k === tipo) + '">' + BENS[k].ico + "<span>" + BENS[k].nome + "</span></button>";
    }).join("");
    g("tabs").querySelectorAll(".tab").forEach(function (b) { b.onclick = function () { setTipo(b.dataset.t); }; });
  }
  function setTipo(t) {
    tipo = t; renderTabs();
    g("bemPh").style.backgroundImage = "url(" + BENS[t === "IMV" ? "AUT" : t].foto + ")";
    var lim = limites(t), sl = g("cred");
    if (lim) {
      sl.disabled = false; sl.min = lim.min; sl.max = lim.max; sl.step = BENS[t].passo;
      credito = Math.min(lim.max, Math.max(lim.min, Math.round((lim.min + (lim.max - lim.min) * 0.25) / BENS[t].passo) * BENS[t].passo));
      sl.value = credito; g("credMin").textContent = brl(lim.min); g("credMax").textContent = brl(lim.max);
    } else { sl.disabled = true; credito = null; g("credMin").textContent = ""; g("credMax").textContent = ""; }
    admSel = null; update();
  }
  function update() {
    var sl = g("cred");
    if (credito != null) { sl.style.setProperty("--p", ((credito - sl.min) / (sl.max - sl.min || 1) * 100) + "%"); g("credVal").textContent = brl(credito); }
    else { sl.style.setProperty("--p", "0%"); g("credVal").textContent = "Sob consulta"; }
    var rs = ADMINS.map(function (a) { return { a: a, r: credito != null ? calc(a, tipo, credito, pessoa) : { status: "consulta" } }; });
    var oks = rs.filter(function (x) { return x.r.status === "ok"; }).sort(function (x, y) { return x.r.parcela - y.r.parcela; });
    if (!admSel || !rs.some(function (x) { return x.a.id === admSel && x.r.status === "ok"; })) admSel = oks.length ? oks[0].a.id : null;
    var ordem = oks.concat(rs.filter(function (x) { return x.r.status !== "ok"; }));
    g("admPick").innerHTML = '<span class="k" style="margin-bottom:2px">Administradoras</span>' + ordem.map(function (x) {
      var ok = x.r.status === "ok";
      var pr = ok ? '<span class="pr">' + (x.r.rd ? '<em class="rdb">-' + Math.round(x.r.rd * 100) + "%</em>" : "") + brl2(x.r.parcela) + "</span>"
        : '<span class="pr sc">' + (x.r.status === "fora" ? "Fora da faixa" : "Sob consulta") + "</span>";
      return '<button type="button" class="ap' + (x.a.id === admSel ? " at" : "") + (ok ? "" : " off") + '" data-a="' + x.a.id + '"><span class="lg"><img src="' + x.a.logo + '" alt="' + x.a.nome + '"></span><span class="nm">' + x.a.nome + "</span>" + pr + "</button>";
    }).join("");
    g("admPick").querySelectorAll(".ap").forEach(function (b) {
      b.onclick = function () {
        var x = rs.find(function (x) { return x.a.id === b.dataset.a; });
        if (x.r.status === "ok") { admSel = x.a.id; update(); } else showConsulta(x.a);
      };
    });
    var sel = rs.find(function (x) { return x.a.id === admSel; });
    if (sel) showRes(sel.a, sel.r); else showConsulta(null);
    syncForm();
  }
  function showRes(a, r) {
    var nm = BENS[tipo].nome, txt = ["Olá! Simulei um consórcio no site da Segurautos.", "Administradora: " + a.nome, "Bem: " + nm,
      "Pessoa: " + (pessoa === "PF" ? "Física" : "Jurídica"), "Crédito: " + brl(credito), "Prazo: " + r.prazo + " meses",
      "Parcela estimada: " + brl2(r.parcela) + "/mês", "Quero confirmar os valores e receber a proposta oficial."].join("\n");
    var rows = [["Crédito", brl(credito)], ["Prazo", r.prazo + " meses"], ["Taxa de administração", brl(credito * r.taxa) + " (" + pct(r.taxa) + ")"], ["Fundo de reserva", pct(r.fr)]];
    if (r.reduzida) rows.push(["Parcela cheia (após contemplação)", brl2(r.cheia)]);
    g("res").innerHTML = '<div class="fade" style="display:flex;flex-direction:column;flex:1">' +
      '<div class="r-adm"><div class="chipw"><img src="' + a.logo + '" alt="' + a.nome + '"></div><small>' + nm + " · " + pessoa + "</small></div>" +
      '<div class="r-l">Parcela estimada' + (r.reduzida ? " com redutor de " + Math.round(r.rd * 100) + "% até a contemplação" : "") + "</div>" +
      '<div class="r-v">' + brl2(r.parcela) + "<span> /mês</span></div>" +
      '<div class="r-sub">' + r.prazo + " meses" + (pessoa === "PF" ? " · seguro prestamista incluso" : "") + "</div>" +
      '<div class="rows">' + rows.map(function (x) { return '<div class="row"><span>' + x[0] + "</span><span>" + x[1] + "</span></div>"; }).join("") + "</div>" +
      '<div class="r-ctas"><a class="btn btn-yel" target="_blank" rel="noopener" href="' + wa(txt) + '">Receber proposta no WhatsApp</a>' +
      '<a class="btn btn-line" href="#proposta">Preencher formulário</a></div></div>';
  }
  function showConsulta(a) {
    var nm = BENS[tipo].nome;
    var txt = "Olá! Quero uma simulação de consórcio de " + nm.toLowerCase() + (a ? " na " + a.nome : "") + (credito ? " com crédito de " + brl(credito) : "") + ".";
    g("res").innerHTML = '<div class="r-empty fade">' + (a ? '<div class="chipw"><img src="' + a.logo + '" alt="' + a.nome + '"></div>' : "") +
      "<h3>Simulação<br>sob consulta.</h3><p>" + (a ? "As condições da " + a.nome + " para " + nm.toLowerCase() + " são passadas pelo nosso consultor, com os grupos disponíveis hoje."
        : "Para " + nm.toLowerCase() + ", nosso consultor monta a simulação com as administradoras e os grupos disponíveis hoje.") + "</p>" +
      '<a class="btn btn-yel" target="_blank" rel="noopener" href="' + wa(txt) + '">Pedir simulação no WhatsApp</a></div>';
  }

  /* hero: menor parcela disponível */
  function heroMin() {
    var best = null;
    Object.keys(BENS).forEach(function (tp) {
      ADMINS.forEach(function (a) {
        var t = a.tipos[tp]; if (!t) return;
        var c = t.faixas[0].min, r = calc(a, tp, c, "PF");
        if (r.status === "ok" && (!best || r.parcela < best.p)) best = { p: r.parcela, tp: tp, c: c, pz: r.prazo };
      });
    });
    if (best) {
      g("heroMin").innerHTML = brl(best.p) + "<span> /mês</span>";
      g("heroMinSub").textContent = BENS[best.tp].nome + " · crédito de " + brl(best.c) + " · " + best.pz + " meses";
    } else g("heroGlass").hidden = true;
  }

  /* formulário de proposta */
  function syncForm() {
    g("qBem").value = tipo;
    if (admSel) g("qAdm").value = admSel;
    var qc = g("qCredito"); if (credito != null && !qc.dataset.ed) qc.value = brl(credito);
  }
  function escolha(n) { var c = document.querySelector('.chs[data-g="' + n + '"] .ch.at'); return c ? c.dataset.v : null; }
  function enviar() {
    var nome = g("qNome").value.trim(), wh = g("qWhats").value.trim();
    var bad = !nome || wh.replace(/\D/g, "").length < 10;
    g("fNome").classList.toggle("bad", !nome);
    g("fWhats").classList.toggle("bad", wh.replace(/\D/g, "").length < 10);
    g("qErr").hidden = !bad;
    if (bad) return;
    var lance = escolha("qLance"), adm = g("qAdm"), ni = "não informado";
    var l = ["Olá! Quero uma proposta de consórcio.", "", "Nome: " + nome, "WhatsApp: " + wh,
      "Bem: " + BENS[g("qBem").value].nome, "Administradora de preferência: " + adm.options[adm.selectedIndex].text,
      "Crédito desejado: " + (g("qCredito").value.trim() || ni), "Parcela confortável: " + (g("qParcela").value.trim() || ni),
      "Lance disponível: " + (lance === "sim" ? "Sim, " + (g("qLanceValor").value.trim() || "valor a combinar") : lance === "nao" ? "Não" : ni),
      "Prazo para comprar: " + (g("qPrazo").value || ni), "Mais alguém decide junto: " + (escolha("qDecisao") || ni),
      "Avança esta semana: " + (escolha("qPronto") || ni), "Unidade: " + (escolha("qUnidade") || ni)];
    var num = escolha("qUnidade") === "Brasília" && SEGURAUTOS.WHATSAPP_BSB ? SEGURAUTOS.WHATSAPP_BSB : SEGURAUTOS.WHATSAPP;
    if (SEGURAUTOS.CRM_WEBHOOK) { try { fetch(SEGURAUTOS.CRM_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ produto: "Consórcio", mensagem: l.join("\n"), data: new Date().toISOString() }), keepalive: true }).catch(function () {}); } catch (e) {} }
    window.open(wa(l.join("\n"), num), "_blank");
  }
  function telMask(v) { var d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d ? "(" + d : ""; if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7); }

  /* início */
  g("adms").innerHTML = ADMINS.map(function (a) { return '<div><img src="' + a.logo + '" alt="' + a.nome + '"></div>'; }).join("");
  g("qBem").innerHTML = Object.keys(BENS).map(function (k) { return '<option value="' + k + '">' + BENS[k].nome + "</option>"; }).join("");
  g("qAdm").innerHTML = '<option value="">Sem preferência</option>' + ADMINS.map(function (a) { return '<option value="' + a.id + '">' + a.nome + "</option>"; }).join("");
  g("qCredito").addEventListener("input", function () { this.dataset.ed = 1; });
  g("qWhats").addEventListener("input", function () { this.value = telMask(this.value); g("fWhats").classList.remove("bad"); });
  g("qNome").addEventListener("input", function () { g("fNome").classList.remove("bad"); });
  document.querySelectorAll(".chs").forEach(function (gr) {
    gr.querySelectorAll(".ch").forEach(function (c) {
      c.onclick = function () {
        gr.querySelectorAll(".ch").forEach(function (x) { x.classList.remove("at"); x.setAttribute("aria-pressed", "false"); });
        c.classList.add("at"); c.setAttribute("aria-pressed", "true");
        if (gr.dataset.g === "qLance") g("qLanceValorWrap").hidden = c.dataset.v !== "sim";
      };
    });
  });
  g("pessoa").querySelectorAll("button").forEach(function (b) {
    b.onclick = function () {
      g("pessoa").querySelectorAll("button").forEach(function (x) { x.classList.remove("at"); x.setAttribute("aria-pressed", "false"); });
      b.classList.add("at"); b.setAttribute("aria-pressed", "true"); pessoa = b.dataset.p; update();
    };
  });
  g("cred").oninput = function () { credito = parseInt(this.value, 10); update(); };
  g("qEnviar").onclick = enviar;
  heroMin(); setTipo("IMV");
})();
