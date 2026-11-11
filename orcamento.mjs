import {defaults,validateConfig,calculate,DESC_MAX} from './pricing.mjs';
import {INCL,PRIMEIRO_MES,RESUMO} from './inclui.mjs';

/* Configuração: código do modo comercial (definido pela equipa comercial, 11/11/2026).
   Não é segurança: esta página corre no browser. O controlo real é a proposta final, revista por quem assina. */
const CODIGO_COMERCIAL='digitalab';

const $=s=>document.querySelector(s), form=$('#selection'), key='formalab-prices-v4';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(c/100);
let config=structuredClone(defaults), last, summaryText='', commercial=false;
try{const saved=localStorage.getItem(key);if(saved)config=validateConfig(JSON.parse(saved));}catch{$('#priceStatus').textContent='Não foi possível recuperar a grelha guardada. Estão ativos os valores de referência.';}

const value=id=>{const p=config.items.find(x=>x.id===id)?.price;return p==null?'Por definir':money(p*100)};
const li=y=>'<li>'+escape(y)+'</li>';
const ul=a=>a&&a.length?'<ul>'+a.map(x=>typeof x==='string'?li(x):'<li class="grp"><strong>'+escape(x.g)+'</strong><ul>'+x.i.map(li).join('')+'</ul></li>').join('')+'</ul>':'';
function num(name){const e=form.elements[name],min=Number(e.min)||0,max=Number(e.max)||10000;return Math.min(max,Math.max(min,Math.floor(Number(e.value)||0)));}

function state(){
  const s={};
  for(const k of ['site','connection','google','domain','email','project','notes'])s[k]=form.elements[k]?.value||'none';
  for(const k of ['images','extraPages','users','locations','photos','texts','boxes'])s[k]=num(k);
  for(const k of ['agenda','obra','aulas','logo','migration','custom'])s[k]=form.elements[k].checked;
  /* O desconto só existe no modo comercial e só há duas escolhas: sem desconto ou o máximo da tabela. */
  s.discount=commercial&&form.querySelector('[name=discSel]:checked')?.value==='1';
  return s;
}

function drawChoices(){
  const site=form.elements.site?.value||'none', apps={};
  for(const k of ['agenda','obra','aulas'])apps[k]=form.elements[k]?.checked||false;
  $('#siteOptions').innerHTML='<label class="choice"><input type="radio" name="site" value="none"><strong>Sem site novo</strong><small>Aplicações ou serviços isolados</small><span class="price">Sem criação de site</span></label>'+
    ['simples','mediano','profissional'].map(k=>`<label class="choice"><input type="radio" name="site" value="${k}"><strong>Site ${k[0].toUpperCase()+k.slice(1)}</strong><small>${config.rules.pages[k]} página(s) · ${config.rules.photos[k]} fotos incluídas (produção + inserção)</small><ul class="mini">${(RESUMO[k]||[]).slice(1).map(li).join('')}</ul><span class="price">${value(k)}</span><small>+ ${value('siteMonth')}/mês de gestão técnica</small></label>`).join('');
  form.elements.site.value=site;
  $('#appOptions').innerHTML=[['agenda','Agendar Fácil','Marcações e acesso do cliente'],['obra','Obraemdia','Gestão da operação e acesso do cliente'],['aulas','Gestão de aulas em grupo','Aulas e sessões em grupo, com horários e lotação']].map(([k,n,d])=>`<label class="choice app"><input type="checkbox" name="${k}" ${apps[k]?'checked':''}><div><strong>${n}</strong><small>${d} · âmbito a confirmar</small><span class="price">${value(k)}/mês</span><small>Implementação: ${value(k+'Setup')}</small></div></label>`).join('');
}

/* "O que inclui / não inclui / precisamos de si" */
function infoBlock(id,title,open=false){
  const x=INCL[id];if(!x)return '';
  return `<details class="incl"${open?' open':''}><summary>${escape(title)}: o que inclui</summary><div class="incl-body"><h4>O que inclui</h4>${ul(x.inc)}<h4>O que não inclui</h4>${ul(x.nao)}<h4>O que precisamos de si</h4>${ul(x.prec)}</div></details>`;
}
function drawInfo(s){
  const label=id=>config.items.find(i=>i.id===id)?.label||id;
  $('#siteInfo').innerHTML=s.site==='none'?'':infoBlock(s.site,label(s.site),true)+infoBlock('siteMonth',label('siteMonth'));
  $('#appInfo').innerHTML=['agenda','obra','aulas'].filter(k=>s[k]).map(k=>infoBlock(k,label(k))).join('')+(['agenda','obra','aulas'].some(k=>s[k])&&s.connection!=='standalone'?infoBlock('integration',label('integration')):'');
  const svc=[];
  if(s.google==='new')svc.push(['googleNew']);if(s.google==='improve')svc.push(['googleImprove']);
  if(s.domain!=='none')svc.push(['domainSetup']);if(s.email!=='none')svc.push(['emailSetup']);
  if(s.photos)svc.push(['photo']);if(s.texts)svc.push(['text']);if(s.logo)svc.push(['logo']);
  $('#serviceInfo').innerHTML=svc.map(([id])=>infoBlock(id,label(id))).join('');
}

function drawDiscount(s,r){
  const box=$('#discountBox');box.hidden=!commercial;if(!commercial)return;
  const cap=DESC_MAX[s.site]||0, none=s.site==='none';
  const one=form.querySelector('[name=discSel][value="1"]');
  $('#discountMax').textContent=none?'Disponível apenas com um site novo.':cap?`Desconto máximo (${cap}% no preço base do site, ${money(Math.round((r.siteBase||0)*cap/100))})`:'Este nível de site não tem desconto';
  one.disabled=none||!cap;
  if(one.disabled&&one.checked)form.querySelector('[name=discSel][value="0"]').checked=true;
  $('#discountNote').textContent=r.refused?'Este nível de site não permite desconto.':'O desconto aplica-se só ao preço base do site. Aplicações, mensalidades, serviços e extras mantêm o seu preço.';
}

function recalc(){
  const s=state();last=calculate(s,config);const r=last;
  drawInfo(s);drawDiscount(s,r);
  $('#siteDetails').hidden=s.site==='none';
  form.elements.boxes.disabled=s.email==='none';
  const hasApps=['agenda','obra','aulas'].some(k=>s[k]);
  for(const k of ['connection','users','locations'])form.elements[k].disabled=!hasApps;
  const partial=r.pending.length>0,has=r.lines.length>0;
  const primeiroMes=has&&r.lines.some(l=>!['googleNew','googleImprove'].includes(l.id));
  const lineHTML=r.lines.map(l=>`<div class="line"><span>${escape(l.label)}${l.qty>1?' × '+l.qty:''}<br><small>${l.period}</small></span><strong>${l.total===null?'Por definir':money(l.total)}</strong></div>`).join('');
  const title=s.project&&s.project!=='none'?s.project:'A sua solução';
  $('#summary').innerHTML=`<div class="step" style="color:#dfcfe6">RESUMO DA SELEÇÃO</div><h2>${escape(title)}</h2><p class="muted">${has?(partial?'Subtotal conhecido · há validações pendentes':'Estimativa'):'Selecione serviços para começar'}</p><small>Investimento inicial ${r.discount?'após desconto':''}</small><div class="total">${money(r.net)}</div>${r.discount?`<small>Preço de tabela: ${money(r.initial)} · desconto no site: ${money(r.discount)}</small>`:''}<div class="metrics"><div><small>Mensalidade</small><strong>${money(r.monthly)}</strong></div><div><small>Renovações anuais</small><strong>${money(r.annual)}</strong></div></div><p><small>Projeção de 12 meses${partial?' · parcial':''}</small><br><strong>${money(r.year)}</strong></p><p class="muted">Inicial + 12 mensalidades + uma anuidade. Não estabelece fidelização. Valores sem IVA; regime a confirmar.</p>${primeiroMes?`<div class="mes">${escape(PRIMEIRO_MES.linha)}</div>`:''}<details open><summary>Serviços selecionados (${r.lines.length})</summary><div>${lineHTML||'<p class="muted">Ainda não há serviços selecionados.</p>'}</div></details>${partial?`<div class="pending"><strong>A validar antes de emitir proposta</strong><ul>${r.pending.map(p=>'<li>'+escape(p)+'</li>').join('')}</ul></div>`:''}${s.notes&&s.notes!=='none'?'<div class="pending"><strong>Notas do pedido</strong><p>'+escape(s.notes)+'</p></div>':''}<p class="muted">Valores de referência sujeitos a confirmação. Não é uma proposta contratual. Prazo, revisões, suporte, pagamento e âmbito sujeitos a acordo.</p><div class="actions"><button id="makeProposal" ${has?'':'disabled'}>Gerar proposta</button><button id="exportSummary" ${has?'':'disabled'}>Descarregar resumo</button></div><p class="muted">Não envia pedidos nem guarda dados do cliente num servidor.</p>`;
  summaryText=`DIGITAL LAB × FORMALAB\nESTIMATIVA — NÃO É PROPOSTA CONTRATUAL\n${title}\n${new Date().toLocaleDateString('pt-PT')}\n\n`+r.lines.map(l=>`${l.label} × ${l.qty}: ${l.total===null?'POR DEFINIR':money(l.total)} (${l.period})\n  Âmbito: ${l.note}`).join('\n')+`\n\nInicial antes de desconto: ${money(r.initial)}\n`+(r.discount?`Desconto sobre o preço base do site: ${money(r.discount)}\n`:'')+`Investimento inicial: ${money(r.net)}\nMensalidade: ${money(r.monthly)}\nRenovações anuais: ${money(r.annual)}\nProjeção de 12 meses${partial?' — PARCIAL':''}: ${money(r.year)}\nSem IVA. Regime a confirmar. Não estabelece fidelização.\n`+(primeiroMes?`${PRIMEIRO_MES.linha}\n`:'')+`\nSite: ${s.site}; fotos a inserir: ${s.site==='none'?'não aplicável':s.images}; páginas adicionais: ${s.site==='none'?0:s.extraPages}.\nAplicações: ${hasApps?s.connection:'não contratadas'}; utilizadores internos: ${hasApps?s.users:'—'}; estabelecimentos: ${hasApps?s.locations:'—'}.\n\n`+(partial?'PENDÊNCIAS\n'+r.pending.map(p=>'• '+p).join('\n')+'\n\n':'')+`Notas: ${s.notes==='none'?'':s.notes}\n\nValores de referência sujeitos a confirmação na proposta. Confirmar âmbito, revisões, prazo, suporte, condições de pagamento e IVA antes de contratar.`;
  $('#exportSummary').onclick=()=>download('formalab-resumo.txt',summaryText,'text/plain');
  $('#makeProposal').onclick=()=>showProposal(s,r);
}

/* Proposta imprimível (guardar em PDF pelo browser) */
function showProposal(s,r){
  const title=s.project&&s.project!=='none'?s.project:'';
  const seen=new Set(),blocks=[];
  for(const l of r.lines){if(seen.has(l.id)||!INCL[l.id])continue;seen.add(l.id);blocks.push(`<section class="pb"><h3>${escape(l.label)}</h3><h4>O que inclui</h4>${ul(INCL[l.id].inc)}<h4>O que não inclui</h4>${ul(INCL[l.id].nao)}<h4>O que precisamos de si</h4>${ul(INCL[l.id].prec)}</section>`);}
  const has1=r.lines.some(l=>!['googleNew','googleImprove'].includes(l.id));
  const rows=r.lines.map(l=>`<tr><td>${escape(l.label)}${l.qty>1?' × '+l.qty:''}<small>${l.period}</small></td><td>${l.total===null?'Por definir':money(l.total)}</td></tr>`).join('');
  $('#proposal').innerHTML=`<div class="pr-marcas"><img src="img/digital-lab.png" alt="Digital Lab" width="84" height="76"><img src="img/formalab.png" alt="FormaLab" width="148" height="31"></div><h1>Proposta${title?' · '+escape(title):''}</h1><p class="pr-meta">${new Date().toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'})} · valores sem IVA</p>
  <table class="pr-t">${rows}</table>
  <table class="pr-t pr-tot"><tr><td>Preço de tabela (investimento inicial)</td><td>${money(r.initial)}</td></tr>${r.discount?`<tr><td>Desconto no site</td><td>−${money(r.discount)}</td></tr>`:''}<tr class="fin"><td>Investimento inicial (preço final)</td><td>${money(r.net)}</td></tr><tr><td>Mensalidade</td><td>${money(r.monthly)}</td></tr><tr><td>Renovações anuais</td><td>${money(r.annual)}</td></tr></table>
  ${has1?`<div class="pr-mes"><strong>${escape(PRIMEIRO_MES.linha)}</strong><h4>No 1.º mês inclui</h4>${ul(PRIMEIRO_MES.inc)}<h4>No 1.º mês não inclui</h4>${ul(PRIMEIRO_MES.nao)}</div>`:''}
  ${blocks.join('')}
  ${r.pending.length?`<section class="pb"><h3>A confirmar antes da proposta final</h3>${ul(r.pending)}</section>`:''}
  ${s.notes&&s.notes!=='none'?`<section class="pb"><h3>Notas</h3><p>${escape(s.notes)}</p></section>`:''}
  <p class="pr-rod">Estimativa sujeita a confirmação na proposta final. Subscrições, domínio, licenças e taxas de terceiros são custos externos, identificados à parte. Prazo, revisões, suporte e pagamento sujeitos a acordo.</p>`;
  document.body.classList.add('ver-proposta');window.scrollTo(0,0);
}
$('#proposalBack').onclick=()=>document.body.classList.remove('ver-proposta');
$('#proposalPrint').onclick=()=>window.print();

function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type:type+';charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

/* Grelha de preços: só no modo comercial */
function renderPrices(){
  $('#priceRows').innerHTML=config.items.map(x=>`<tr><td><strong>${escape(x.label)}</strong><small>${escape(x.owner)}${['agenda','obra','aulas'].includes(x.id)?' · mensalidade indicada pela equipa':' · valor de referência'}</small></td><td><input type="number" min="0" max="1000000" step="0.01" data-price="${x.id}" aria-label="Preço: ${escape(x.label)}" value="${x.price??''}" placeholder="Por definir"></td><td>${x.period}</td><td><input data-note="${x.id}" aria-label="Âmbito: ${escape(x.label)}" value="${escape(x.note)}" maxlength="500"></td></tr>`).join('');
  $('#ruleFields').innerHTML=['photos','pages'].flatMap(g=>['simples','mediano','profissional'].map(k=>`<label>${g==='photos'?'Fotos incluídas':'Páginas incluídas'} · ${k}<input type="number" min="0" max="10000" step="1" data-rule="${g}.${k}" value="${config.rules[g][k]}"></label>`)).join('')+`<label>Utilizadores internos de referência por aplicação<input type="number" min="1" max="10000" step="1" data-rule="appUsers" value="${config.rules.appUsers}"></label>`;
}
$('#pricesPane').addEventListener('input',e=>{const el=e.target;if(el.dataset.price){const item=config.items.find(x=>x.id===el.dataset.price);item.price=el.value===''?null:el.validity.valid?Number(el.value):null;}else if(el.dataset.note){config.items.find(x=>x.id===el.dataset.note).note=el.value;}else if(el.dataset.rule){if(!el.validity.valid||el.value==='')return;const [g,k]=el.dataset.rule.split('.');if(k)config.rules[g][k]=Number(el.value);else config.rules[g]=Number(el.value);}else return;drawChoices();recalc();$('#priceStatus').textContent='Alterações aplicadas. Guarde ou exporte a grelha para as conservar.';});
function changeTab(prices){$('#pricesPane').hidden=!prices;$('#configPane').hidden=prices;for(const [id,on]of [['pricesTab',prices],['configureTab',!prices]]){$('#'+id).classList.toggle('active',on);$('#'+id).setAttribute('aria-pressed',String(on));}}
$('#pricesTab').onclick=()=>changeTab(true);$('#configureTab').onclick=()=>changeTab(false);
$('#savePrices').onclick=()=>{try{validateConfig(config);localStorage.setItem(key,JSON.stringify(config));$('#priceStatus').textContent='Grelha guardada neste navegador. Exporte o ficheiro para a usar noutro aparelho.';}catch(e){$('#priceStatus').textContent='Não foi possível guardar: '+e.message;}};
$('#exportPrices').onclick=()=>{try{validateConfig(config);download('formalab-precos-regras.json',JSON.stringify(config,null,2),'application/json');$('#priceStatus').textContent='Ficheiro exportado. Pode ser importado noutro aparelho.';}catch(e){$('#priceStatus').textContent=e.message;}};
$('#importPrices').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>200000)throw Error('Ficheiro demasiado grande.');const incoming=validateConfig(JSON.parse(await f.text()));config=structuredClone(incoming);renderPrices();drawChoices();recalc();$('#priceStatus').textContent='Grelha importada. Guarde neste navegador para a conservar.';}catch(err){$('#priceStatus').textContent='Importação recusada: '+err.message;}e.target.value='';};
$('#resetPrices').onclick=()=>{if(!confirm('Repor os preços de referência e remover a grelha guardada neste navegador?'))return;config=structuredClone(defaults);try{localStorage.removeItem(key);}catch{}renderPrices();drawChoices();recalc();$('#priceStatus').textContent='Preços e regras de referência repostos.';};

/* Modo comercial: código curto; sai-se com o mesmo botão e o desconto volta a zero */
function setCommercial(on){
  commercial=on;$('#pricesTab').hidden=!on;$('#comBtn').textContent=on?'Sair do modo comercial':'Modo comercial';
  if(!on){const z=form.querySelector('[name=discSel][value="0"]');if(z)z.checked=true;changeTab(false);}
  recalc();
}
$('#comBtn').onclick=()=>{
  if(commercial){setCommercial(false);return;}
  const c=window.prompt('Código do modo comercial');
  if(c!==null&&c.trim().toLowerCase()===CODIGO_COMERCIAL)setCommercial(true);
};

form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',e=>{if(e.target.name==='site'&&e.target.value!=='none')form.elements.images.value=config.rules.photos[e.target.value];recalc();});
form.addEventListener('change',recalc);
function preset(which){form.reset();form.elements.site.value='none';const set=(n,v)=>{const el=form.elements[n];if(el.type==='checkbox')el.checked=v;else el.value=v;};if(which==='site'){set('site','simples');set('images',config.rules.photos.simples);}if(which==='clinic'){set('site','mediano');set('images',config.rules.photos.mediano);set('agenda',true);set('connection','new');set('users',3);set('photos',5);set('texts',5);set('email','new');set('boxes',2);}if(which==='works'){set('obra',true);set('users',8);set('logo',true);}if(which==='classes'){set('aulas',true);set('users',2);set('google','new');}recalc();}
$('#clear').onclick=()=>preset('none');document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.preset));
drawChoices();renderPrices();
const product=new URLSearchParams(location.search).get('produto');
preset(product==='equipas'?'works':product==='aulas'?'classes':product==='site'?'site':'none');
if(['site-agenda','site-agendas'].includes(product)){preset('clinic');form.elements.photos.value=0;form.elements.texts.value=0;form.elements.email.value='none';form.elements.boxes.value=0;form.elements.users.value=product==='site-agenda'?1:3;}
if(product==='agenda')form.elements.agenda.checked=true;if(product==='google')form.elements.google.value='new';if(product==='crm')form.elements.custom.checked=true;
recalc();

/* Funciona sem internet depois da primeira visita (precisa de HTTPS) */
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
