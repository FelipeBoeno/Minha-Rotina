# Minha Rotina — painel pessoal (PWA gratuito)

Arquivos: `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, `icons/`. Sem conta, sem servidor, sem custo. Os dados ficam no seu iPhone (localStorage).

## Publicar de graça (GitHub Pages)
1. Crie uma conta gratuita em github.com e um repositório **público** (ex.: `minha-rotina`).
2. Em "Add file › Upload files", envie **todo o conteúdo desta pasta** (mantenha a pasta `icons`).
3. Vá em Settings › Pages › "Deploy from a branch" › branch `main`, pasta `/ (root)` › Save.
4. Em ~1 minuto o site fica em `https://SEU-USUARIO.github.io/minha-rotina/`.
Alternativas gratuitas: Cloudflare Pages ou Netlify (plano gratuito, sem cartão).

## Instalar no iPhone
1. Abra o endereço **no Safari** (não em outro navegador).
2. Toque em Compartilhar › **Adicionar à Tela de Início** › Adicionar.
3. Abra sempre pelo ícone "Minha Rotina". Depois do primeiro carregamento ele funciona offline.
Observações: o app instalado e o Safari têm armazenamento separado; use só o ícone. Os dados não sincronizam entre aparelhos. Ao atualizar os arquivos no GitHub, abra o app com internet uma vez para atualizar.

## Notificações — o que funciona de verdade
- Dentro do app (Ajustes): ative/desative por atividade, mude horários e antecedência (na hora, 5, 10, 15, 30 min).
- Permissão: no iPhone só existe com o app instalado na Tela de Início (iOS 16.4+). Toque em "Permitir notificações".
- Limitação: o lembrete só dispara com o app aberto ou ainda ativo na memória. O iOS suspende apps web em segundo plano. Push real com app fechado precisa de um servidor (Web Push/VAPID), que não está incluído para manter tudo gratuito e simples. Por isso use o **Atalhos** abaixo para os lembretes garantidos.

## Lembretes garantidos com o app Atalhos (grátis)
1. Abra Atalhos › aba **Automação** › **+** › **Hora do dia**.
2. Escolha o horário (ex.: 05:45), repetir **Diariamente** › Avançar.
3. Ação: **Mostrar notificação** (texto "Acordar: beber água") ou **Adicionar novo lembrete**. Opcional: ação **Abrir URL** com o endereço do app.
4. Desative "Perguntar antes de executar" e conclua. Repita para 05:55, 06:40, 07:00, 07:40, 19:30, 21:00 e 22:00.
Alternativa ainda mais simples: crie lembretes recorrentes no app Lembretes.

## Widgets
Um site HTML **não cria** widgets nativos nem de tela bloqueada. Alternativas gratuitas: no Atalhos, crie um atalho "Abrir URL" com o endereço do app e adicione o widget do Atalhos à Tela de Início (e, conforme sua versão do iOS, à tela de bloqueio); ou use o widget do app Lembretes. Um widget realmente nativo exigiria app nativo (Xcode/conta de desenvolvedor), fora do escopo gratuito.
