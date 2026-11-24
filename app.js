const $=s=>document.querySelector(s),K='minha-rotina-v1',pad=n=>String(n).padStart(2,'0');
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,today=()=>dkey(new Date());
const tmin=t=>{const[a,b]=t.split(':').map(Number);return a*60+b};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const EX=['Domingo: caminhada leve de 25 min ao ar livre','Segunda: treino em casa — agachamentos, flexões e prancha','Terça: corrida leve ou trote de 20 min','Quarta: alongamento e mobilidade (quadril, ombros, coluna)','Quinta: circuito em casa — polichinelos, afundos e abdominais','Sexta: caminhada rápida de 25 min','Sábado: mobilidade e core suave'];
const MORN=[
{id:'acordar',t:'05:45',n:'Acordar',i:'☀️',d:'Levantar da cama, beber água e fazer a higiene pessoal.'},
{id:'exercicio',t:'05:55',n:'Exercícios',i:'💪',d:()=>EX[new Date().getDay()]+'. Alterne entre casa, caminhada, corrida, alongamento e mobilidade.'},
{id:'banho',t:'06:20',n:'Banho e preparação',i:'🚿',d:'Banho e preparação para o dia.'},
{id:'cafe',t:'06:40',n:'Café da manhã',i:'☕',d:'Café da manhã com calma.'},
{id:'leitura',t:'07:00',n:'Leitura',i:'📖',d:'Cerca de 10 minutos. Registre livro e páginas na aba Hábitos.'},
{id:'final',t:'07:10',n:'Preparação final',i:'🎒',d:'Conferir mochila, chaves e documentos e sair sem pressa.'},
{id:'saida',t:'07:40',n:'Sair para o trabalho',i:'🚪',d:'Horário obrigatório de saída. Trabalho das 07:40 às 18:00.'},
{id:'fim',t:'18:00',n:'Fim do expediente',i:'🏁',d:'Encerramento do expediente e deslocamento para casa.'}];
const NIGHT={ferias:[
{id:'chegada',t:'18:30',n:'Chegada e descanso',i:'🏠',d:'Entre 18:30 e 19:00, conforme trânsito e horas extras.'},
{id:'jantar',t:'19:00',n:'Jantar',i:'🍽️',d:'Jantar tranquilo.'},
{id:'projeto',t:'19:30',n:'Projeto de renda extra',i:'🚀',d:'Das 19:30 às 21:00: desenvolver seus projetos pessoais (aba Projetos).'},
{id:'org',t:'21:00',n:'Organizar o dia seguinte',i:'🗓️',d:'Separar roupas, preparar mochila, conferir compromissos e definir prioridades.'},
{id:'descanso',t:'21:20',n:'Descanso e desaceleração',i:'🌙',d:'Das 21:20 às 22:00: sem telas pesadas, relaxar.'},
{id:'dormir',t:'22:00',n:'Dormir',i:'😴',d:'Hora de dormir.'}],
provas:[
{id:'chegada',t:'18:30',n:'Chegada e descanso',i:'🏠',d:'Chegada em casa e descanso, conforme trânsito.'},
{id:'jantar',t:'20:00',n:'Jantar',i:'🍽️',d:'Jantar das 20:00 às 20:30.'},
{id:'org',t:'20:30',n:'Organizar o dia seguinte',i:'🗓️',d:'Das 20:30 às 21:00: roupas, mochila, compromissos e prioridades.'},
{id:'descanso',t:'21:00',n:'Descanso',i:'🌙',d:'Das 21:00 às 21:30.'},
{id:'prepdormir',t:'21:30',n:'Preparação para dormir',i:'🛏️',d:'Das 21:30 às 22:00: desacelerar para dormir.'},
{id:'dormir',t:'22:00',n:'Dormir',i:'😴',d:'Hora de dormir.'}]};
const DEF=['acordar','exercicio','cafe','leitura','saida','projeto','org','dormir'];
const def=()=>({mode:'ferias',times:{},notif:{},custom:[],done:{},tot:{},cnt:{},goal:80,book:{title:'',pages:{}},projects:[],habits:[{id:'agua',n:'Beber 2 L de água'},{id:'tela',n:'Sem telas 30 min antes de dormir'}],hlog:{},fired:{}});
let st;try{st=Object.assign(def(),JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){st=def()}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}};
let ui={v:'hoje',open:null};
const tk=i=>i.c?'c'+i.id:st.mode+i.id;
function items(){const L=MORN.concat(NIGHT[st.mode]).map(x=>({...x,t:st.times[st.mode+x.id]||x.t,d:typeof x.d==='function'?x.d():x.d}));
st.custom.forEach(c=>L.push({id:c.id,c:1,t:st.times['c'+c.id]||c.t,n:c.n,i:'⭐',d:'Tarefa personalizada.'}));
return L.sort((a,b)=>tmin(a.t)-tmin(b.t))}
const isDone=id=>(st.done[today()]||[]).includes(id);
function toggle(id){const d=today(),l=st.done[d]||(st.done[d]=[]),k=l.indexOf(id);k<0?l.push(id):l.splice(k,1)}
function sync(){const L=items(),d=today();st.tot[d]=L.length;st.cnt[d]=(st.done[d]||[]).filter(id=>L.some(i=>i.id===id)).length}
const ncfg=id=>st.notif[id]||{on:DEF.includes(id),early:0};
function nextItem(L){const n=new Date(),m=n.getHours()*60+n.getMinutes();let x=L.find(i=>tmin(i.t)>=m&&!isDone(i.id));if(x)return{i:x,diff:tmin(x.t)-m};return{i:L[0],diff:tmin(L[0].t)+1440-m,tom:1}}
function fmt(d){if(d<=0)return'Começa agora';if(d<60)return`Faltam ${d} min`;const h=Math.floor(d/60),m=d%60;return`Faltam ${h}h${m?' '+m+'min':''}`}
const greet=()=>{const h=new Date().getHours();return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'};
const bar=(p,g)=>`<div class="bar"><i style="width:${p}%"></i>${g?`<b style="left:${g}%"></b>`:''}</div>`;
function row(i){const o=ui.open===i.id,dn=isDone(i.id);return `<div class="row"><button class="ck ${dn?'on':''}" data-a="toggle" data-id="${i.id}" aria-label="Concluir">${dn?'✓':''}</button><div class="rb" data-a="open" data-id="${i.id}"><span class="tt">${i.t}</span><span class="nm ${dn?'dn':''}">${i.i} ${esc(i.n)}</span>${o?`<div class="d">${esc(i.d)}</div>`:''}</div></div>`}
function vHoje(){const L=items(),d=today(),dn=(st.done[d]||[]).filter(id=>L.some(i=>i.id===id)).length,p=Math.round(dn/L.length*100),nx=nextItem(L),x=nx.i;
return `<div class="sub">${new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</div><h1>${greet()}</h1>
<div class="seg"><button data-a="mode" data-m="ferias" class="${st.mode=='ferias'?'on':''}">Período de férias</button><button data-a="mode" data-m="provas" class="${st.mode=='provas'?'on':''}">Semana de provas</button></div>
<div class="card hero"><div class="lbl">MINHA PRÓXIMA ATIVIDADE${nx.tom?' · AMANHÃ':''}</div><div class="big">${x.i} ${esc(x.n)}</div><div class="tm">${x.t} · ${fmt(nx.diff)}</div><p class="d">${esc(x.d)}</p>${nx.tom?'':`<button class="btn" data-a="toggle" data-id="${x.id}">Marcar como concluída</button>`}</div>
<div class="card"><div class="flex"><div><div class="lbl">PROGRESSO DE HOJE</div><div class="big">${p}%</div></div><div class="cnt">${dn}/${L.length}<small>concluídas</small></div></div>${bar(p,st.goal)}<div class="sub n">Meta diária: ${st.goal}% ${p>=st.goal?'· atingida ✓':''}</div></div>
<div class="card">${L.map(row).join('')}</div>`}
function logged(h,dt){return(st.hlog[dkey(dt)]||[]).includes(h.id)}
function streak(h){let n=0,dt=new Date();if(!logged(h,dt))dt.setDate(dt.getDate()-1);while(logged(h,dt)){n++;dt.setDate(dt.getDate()-1)}return n}
function vHab(){const d=today(),pg=st.book.pages,tot=Object.values(pg).reduce((a,b)=>a+b,0);
return `<h1>Hábitos</h1>
<div class="card"><div class="lbl">LEITURA</div><input class="in" placeholder="Livro atual" value="${esc(st.book.title)}" data-a="book"><div class="flex" style="margin-top:10px"><span class="sub n">Páginas lidas hoje</span><input class="in sm" type="number" min="0" inputmode="numeric" value="${pg[d]||0}" data-a="pages"></div><div class="sub n" style="margin-top:6px">Total registrado: ${tot} páginas</div></div>
<div class="card"><div class="lbl">REGISTRO DE HÁBITOS</div>${st.habits.map(h=>{const on=logged(h,new Date()),s=streak(h);return `<div class="row"><button class="ck ${on?'on':''}" data-a="hlog" data-id="${h.id}">${on?'✓':''}</button><div class="rb"><span class="nm">${esc(h.n)}</span> <span class="pill">${s?'🔥 '+s+' dia'+(s>1?'s':''):''}</span></div><button class="x" data-a="delh" data-id="${h.id}">✕</button></div>`}).join('')}<div class="add"><input class="in" id="hn" placeholder="Novo hábito"><button class="btn s" data-a="addh">+</button></div></div>
<div class="card"><div class="lbl">META DIÁRIA</div><div class="flex"><span class="sub n">Concluir pelo menos (%)</span><input class="in sm" type="number" min="1" max="100" inputmode="numeric" value="${st.goal}" data-a="goal"></div></div>
<div class="card"><div class="lbl">TAREFAS PERSONALIZADAS (DIÁRIAS)</div>${st.custom.map(c=>`<div class="row"><div class="rb"><span class="tt">${st.times['c'+c.id]||c.t}</span><span class="nm">⭐ ${esc(c.n)}</span></div><button class="x" data-a="delc" data-id="${c.id}">✕</button></div>`).join('')||'<div class="sub n">Nenhuma ainda.</div>'}<div class="add"><input class="in sm" type="time" id="ct" value="12:00"><input class="in" id="cn" placeholder="Nova tarefa"><button class="btn s" data-a="addc">+</button></div></div>`}
function vProj(){return `<h1>Projetos</h1><div class="sub n">Para o horário de renda extra. Toque na ★ para definir o projeto atual.</div>
${st.projects.map(p=>{const n=p.tasks.length,dn=p.tasks.filter(t=>t.d).length,pc=n?Math.round(dn/n*100):0;return `<div class="card"><div class="flex"><div class="big" style="font-size:19px">${esc(p.n)}</div><div><button class="x" data-a="starp" data-id="${p.id}" style="color:${p.star?'#ffd60a':'#666'}">★</button><button class="x" data-a="delp" data-id="${p.id}">✕</button></div></div>${bar(pc)}<div class="sub n">${pc}% · ${dn}/${n} tarefas${p.star?' · projeto atual':''}</div>
${p.tasks.map(t=>`<div class="row"><button class="ck ${t.d?'on':''}" data-a="togpt" data-id="${p.id}" data-t="${t.id}">${t.d?'✓':''}</button><div class="rb"><span class="nm ${t.d?'dn':''}">${esc(t.n)}</span></div><button class="x" data-a="delpt" data-id="${p.id}" data-t="${t.id}">✕</button></div>`).join('')}
<div class="add"><input class="in" id="pt-${p.id}" placeholder="Nova tarefa ou meta"><button class="btn s" data-a="addpt" data-id="${p.id}">+</button></div></div>`}).join('')}
<div class="card"><div class="add" style="margin:0"><input class="in" id="pn" placeholder="Novo projeto"><button class="btn s" data-a="addp">Criar</button></div></div>`}
function vHist(){let h='',ok=0;for(let k=0;k<14;k++){const dt=new Date();dt.setDate(dt.getDate()-k);const d=dkey(dt),t=st.tot[d],p=t?Math.round((st.cnt[d]||0)/t*100):null;if(p!==null&&p>=st.goal)ok++;
h+=`<div class="hd"><div style="width:84px" class="sub n">${k?dt.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}):'Hoje'}</div>${bar(p||0)}<div style="width:44px;text-align:right;font-weight:600">${p===null?'–':p+'%'}</div></div>`}
return `<h1>Histórico</h1><div class="card"><div class="lbl">ÚLTIMOS 14 DIAS</div><div class="sub n">${ok} dia${ok==1?'':'s'} na meta de ${st.goal}%. Dias sem uso do app aparecem como “–”.</div>${h}</div>`}
const perm=()=>'Notification'in window?Notification.permission:'unsupported';
function vAj(){const L=items(),p=perm(),msg={unsupported:'Este navegador não oferece notificações. No iPhone, elas só existem depois de adicionar o app à Tela de Início (iOS 16.4 ou mais novo).',default:'Permissão ainda não concedida.',granted:'Permissão concedida ✓',denied:'Permissão negada. Reative em Ajustes do iPhone › Notificações › Minha Rotina.'}[p];
return `<h1>Ajustes</h1><div class="card"><div class="lbl">NOTIFICAÇÕES</div><p class="note">${msg}</p>${p==='default'?'<button class="btn" data-a="perm">Permitir notificações</button>':''}
<p class="note"><b>Limitação importante:</b> estes lembretes só disparam enquanto o app está aberto ou ativo em memória. O iOS suspende apps web em segundo plano, e notificações com o app fechado exigem um servidor de Web Push, que não está incluído para manter tudo gratuito e sem conta. Para lembretes confiáveis com o app fechado, use o app Atalhos (veja o README).</p></div>
<div class="card"><div class="lbl">HORÁRIOS E LEMBRETES · ${st.mode==='ferias'?'FÉRIAS':'PROVAS'}</div>${L.map(i=>{const c=ncfg(i.id);return `<div class="nrow"><div class="nm">${i.i} ${esc(i.n)}</div><div class="ctl"><input type="time" class="in sm" value="${i.t}" data-a="ntime" data-k="${tk(i)}"><select class="in sm" data-a="nearly" data-id="${i.id}">${[0,5,10,15,30].map(m=>`<option value="${m}" ${c.early==m?'selected':''}>${m?m+' min antes':'na hora'}</option>`).join('')}</select><button class="bell ${c.on?'on':''}" data-a="nbell" data-id="${i.id}">${c.on?'🔔':'🔕'}</button></div></div>`}).join('')}<button class="btn g" data-a="resett">Restaurar horários padrão</button></div>`}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),6000)}
function ping(i,early){const b=early?`Começa em ${early} min`:'Está na hora!',ti=`${i.i} ${i.n}`;toast(`${ti} — ${b}`);
if(perm()==='granted'){const o={body:b,icon:'icons/icon-192.png',tag:'r-'+i.id};navigator.serviceWorker&&navigator.serviceWorker.ready?navigator.serviceWorker.ready.then(r=>r.showNotification(ti,o)).catch(()=>{}):new Notification(ti,o)}}
function tick(){const n=new Date(),m=n.getHours()*60+n.getMinutes(),d=today();st.fired[d]=st.fired[d]||[];Object.keys(st.fired).forEach(k=>{if(k!==d)delete st.fired[k]});
items().forEach(i=>{const c=ncfg(i.id);if(!c.on)return;const f=tmin(i.t)-c.early,key=i.id+'@'+f;if(m>=f&&m<=f+1&&!st.fired[d].includes(key)){st.fired[d].push(key);ping(i,c.early)}});
save();const a=document.activeElement;if(ui.v==='hoje'&&!(a&&/INPUT|SELECT/.test(a.tagName)))render()}
function act(el){const a=el.dataset.a,id=el.dataset.id,v=el.value,P=()=>st.projects.find(p=>p.id===id);
switch(a){
case'tab':ui.v=el.dataset.v;window.scrollTo(0,0);break;
case'mode':st.mode=el.dataset.m;break;
case'open':ui.open=ui.open===id?null:id;break;
case'toggle':toggle(id);break;
case'addc':{const n=$('#cn').value.trim();if(!n)return;st.custom.push({id:uid(),n,t:$('#ct').value||'12:00'});break}
case'delc':st.custom=st.custom.filter(c=>c.id!==id);break;
case'goal':st.goal=Math.min(100,Math.max(1,+v||80));break;
case'book':st.book.title=v;break;
case'pages':st.book.pages[today()]=Math.max(0,+v||0);break;
case'addh':{const n=$('#hn').value.trim();if(!n)return;st.habits.push({id:uid(),n});break}
case'delh':st.habits=st.habits.filter(h=>h.id!==id);break;
case'hlog':{const l=st.hlog[today()]||(st.hlog[today()]=[]),k=l.indexOf(id);k<0?l.push(id):l.splice(k,1);break}
case'addp':{const n=$('#pn').value.trim();if(!n)return;st.projects.push({id:uid(),n,star:!st.projects.length,tasks:[]});break}
case'delp':st.projects=st.projects.filter(p=>p.id!==id);break;
case'starp':st.projects.forEach(p=>p.star=p.id===id&&!p.star);break;
case'addpt':{const n=$('#pt-'+id).value.trim();if(!n)return;P().tasks.push({id:uid(),n,d:0});break}
case'togpt':{const t=P().tasks.find(t=>t.id===el.dataset.t);t.d=t.d?0:1;break}
case'delpt':P().tasks=P().tasks.filter(t=>t.id!==el.dataset.t);break;
case'perm':if('Notification'in window)Notification.requestPermission().then(render);return;
case'nbell':st.notif[id]={...ncfg(id),on:!ncfg(id).on};break;
case'nearly':st.notif[id]={...ncfg(id),early:+v};break;
case'ntime':v?st.times[el.dataset.k]=v:delete st.times[el.dataset.k];break;
case'resett':st.times={};break}
save();render()}
function render(){sync();$('#app').innerHTML=({hoje:vHoje,hab:vHab,proj:vProj,hist:vHist,aj:vAj})[ui.v]();document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===ui.v))}
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||/INPUT|SELECT/.test(el.tagName))return;act(el)});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.a&&/INPUT|SELECT/.test(el.tagName))act(el)});
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
render();setInterval(tick,20000);tick();
