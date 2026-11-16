// Portefólio: entrada com os dois logótipos e o botão Orçamento; menu lateral com os sites e as aplicações.
// Cada item mostra o que o cliente tem, uma demonstração interativa (quando existe) e um botão para orçamentar.
const ITENS=[
 {g:'Sites',id:'site',nome:'Site',sub:'Apresenta o seu negócio',tag:'Dê a conhecer o seu negócio.',feat:['Serviços e preços bem apresentados','Fotografias, vídeos e identidade própria','Contactos, direções e redes sociais','Conteúdos organizados para pesquisa'],exemplo:['Ver um site real','https://www.metaatelier.com/']},
 {g:'Sites',id:'site-agenda',nome:'Site com Agenda',sub:'Marcações online',tag:'Do primeiro contacto à próxima marcação.',feat:['Todas as áreas do site','Área de cliente e pedido de marcação','Agenda e gestão do profissional','Mensagens e campanhas conforme proposta'],exemplo:['Ver um site real com agenda','https://danielabarbosaterapeuta.pt/']},
 {g:'Sites',id:'site-agendas',nome:'Site com Agendas',sub:'Vários profissionais',tag:'Uma empresa. Vários profissionais. Tudo organizado.',feat:['Serviço e profissional escolhidos pelo cliente','Cada profissional vê apenas a sua agenda e clientes','O administrador acompanha todo o negócio','Horários e indisponibilidades por profissional']},
 {g:'Aplicações',id:'agenda',nome:'Agendar Fácil',sub:'Agenda autónoma',tag:'As suas marcações, num só lugar.',feat:['Agenda autónoma com a sua marca','Serviços, duração e horários','Uma ou várias agendas','Acesso do cliente e comunicações conforme proposta'],exemplo:['Conhecer a aplicação','https://agendarfacil.net/']},
 {g:'Aplicações',id:'aulas',nome:'Aulas em grupo',sub:'Ginásio, pilates e outras atividades',tag:'Sessões em grupo, com o horário à vista e a lotação controlada.',feat:['Marcação de aulas e sessões em grupo','O cliente vê o horário da sessão','Aviso quando a turma está cheia','Gestão das aulas e acesso do cliente'],prep:true},
 {g:'Aplicações',id:'equipas',nome:'Obraemdia',sub:'Equipas e recursos',tag:'Saiba o que acontece no terreno.',feat:['Entradas, pausas e saídas','Trabalhos, equipas e materiais','Stock, viaturas e despesas','Custos previstos e realizados']},
 {g:'Outros serviços',id:'google',nome:'O seu negócio no Google',sub:'Ser encontrado',tag:'Mais fácil de encontrar. Mais simples de contactar.',feat:['Perfil de Empresa e localização','Horários, contactos e imagens reais','Pesquisa do site e medição de visitas','Relatórios para decidir os próximos passos']},
 {g:'Outros serviços',id:'crm',nome:'Software à medida / CRM',sub:'O seu programa',tag:'A sua forma de trabalhar, num programa seu.',feat:['Rendas, contactos, leads ou loja','Fichas e etapas adaptadas ao negócio','Um ou vários utilizadores com acessos próprios','Tarefas, alertas e relatórios definidos consigo']}
];
const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav=$('#nav'), view=$('#view');

let h='',g='';
for(const i of ITENS){
  if(i.g!==g){g=i.g;h+=`<div class="nav-g">${esc(g)}</div>`;}
  h+=`<a class="nav-i" href="#/${i.id}" data-id="${i.id}"><span><strong>${esc(i.nome)}</strong><small>${esc(i.sub)}${i.prep?' · em preparação':''}</small></span></a>`;
}
nav.innerHTML=h;

function inicio(){
  document.title='Digital Lab + FormaLab';
  view.innerHTML=`<section class="home"><div class="logos"><img src="img/digital-lab.png" alt="Digital Lab" width="230" height="208"><img src="img/formalab.png" alt="FormaLab" width="400" height="84"></div><a class="big-btn" href="orcamento.html">Orçamento</a><p class="home-hint">Para mostrar um site ou uma aplicação, escolha no menu à esquerda.</p></section>`;
}
function item(i){
  document.title=i.nome+' · Digital Lab + FormaLab';
  const demo=i.prep
    ?`<div class="demo"><div class="demo-top">Exemplo interativo</div><div class="prep"><strong>Em preparação</strong>A demonstração desta aplicação ainda não está disponível. Fale connosco para ver como funciona.</div></div>`
    :`<div class="demo"><div class="demo-top">Experimente: escolha os separadores dentro do exemplo</div><iframe title="Exemplo interativo: ${esc(i.nome)}" src="demo.html?tipo=${i.id}&embed=1" loading="lazy"></iframe></div>`;
  view.innerHTML=`<article class="item"><span class="eyebrow">${esc(i.g)}</span><h1>${esc(i.nome)}</h1><p class="tag">${esc(i.tag)}</p>
  <div class="cols"><div class="box"><h2>O que tem</h2><ul class="feat">${i.feat.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>
  <div class="acoes"><a class="btn primario" href="orcamento.html?produto=${i.id}">Orçamentar este</a>${i.exemplo?`<a class="btn" href="${i.exemplo[1]}" target="_blank" rel="noopener noreferrer">${esc(i.exemplo[0])} ↗</a>`:''}</div></div>${demo}</div></article>`;
}
function rota(){
  const id=(location.hash.match(/^#\/([a-z-]+)/)||[])[1];
  const i=ITENS.find(x=>x.id===id);
  if(i)item(i);else inicio();
  nav.querySelectorAll('.nav-i').forEach(a=>{if(i&&a.dataset.id===i.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.body.classList.remove('menu-aberto');$('#menuBtn').setAttribute('aria-expanded','false');$('#scrim').hidden=true;
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',rota);rota();

$('#menuBtn').onclick=()=>{const on=!document.body.classList.contains('menu-aberto');document.body.classList.toggle('menu-aberto',on);$('#menuBtn').setAttribute('aria-expanded',String(on));$('#scrim').hidden=!on;};
$('#scrim').onclick=()=>{document.body.classList.remove('menu-aberto');$('#menuBtn').setAttribute('aria-expanded','false');$('#scrim').hidden=true;};

if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
