// =======================
// SOCKET.IO — MODO ONLINE 🌐
// =======================
const socket = io();
let modoOnline = false;
let meuNumero = null;
let salaOnline = null;
 
function iniciarModoOnline(sala) {
    modoOnline = true;
    salaOnline = sala;
    modo2Players = true;
    mostrarTelaAguardando(sala);
    socket.emit('joinRoom', sala);
}
 
function mostrarTelaCriarSala() {
    telaMenu.style.display = "none";
    let telaSala = document.getElementById("tela-criar-sala");
    if (!telaSala) {
        telaSala = document.createElement("div");
        telaSala.id = "tela-criar-sala";
        document.body.appendChild(telaSala);
    }
 
    telaSala.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.93); display: flex; flex-direction: column;
        align-items: center; justify-content: center; z-index: 999; color: white;
        font-family: Arial, sans-serif; gap: 18px;
    `;
 
    telaSala.innerHTML = `
        <h2 style="font-size:2.2rem; color:#38bdf8; margin-bottom:4px;">🌐 MODO ONLINE</h2>
        <p style="color:#94a3b8; font-size:0.95rem; margin:0; text-align:center;">
            Digite o nome da sala que deseja criar ou entrar:
        </p>
 
        <div style="background:#1e293b; border:2px solid #38bdf8; border-radius:14px;
            padding:30px 36px; display:flex; flex-direction:column; align-items:center;
            gap:16px; min-width:340px;">
 
            <input id="input-sala" type="text" placeholder="Ex: MinhasBatalha, sala123..."
                maxlength="20"
                style="padding:14px 20px; border-radius:10px; border:2px solid #38bdf8;
                background:#0f172a; color:white; font-size:1.3rem; text-align:center;
                letter-spacing:2px; width:100%; box-sizing:border-box;
                text-transform:uppercase; outline:none;"
                oninput="this.value=this.value.toUpperCase()"
                onkeydown="if(event.key==='Enter') confirmarSala()" />
 
            <p style="margin:0; color:#64748b; font-size:0.82rem; text-align:center;">
                ✅ Se a sala não existir, ela será criada automaticamente.<br>
                🎮 Compartilhe o nome com seu amigo para jogar juntos!
            </p>
 
            <button onclick="confirmarSala()" style="
                padding:14px 0; background:#38bdf8; color:#0f172a;
                border:none; border-radius:10px; cursor:pointer;
                font-size:1.1rem; font-weight:bold; width:100%;">
                Entrar / Criar Sala ✈️
            </button>
        </div>
 
        <button onclick="fecharTelaCriarSala()" style="
            padding:8px 24px; background:transparent;
            border:2px solid #f87171; color:#f87171; border-radius:8px;
            cursor:pointer; font-size:0.95rem;">
            ← Voltar ao menu
        </button>
    `;
    telaSala.style.display = "flex";
 
    setTimeout(() => {
        const input = document.getElementById("input-sala");
        if (input) input.focus();
    }, 100);
}
 
function confirmarSala() {
    let input = document.getElementById("input-sala");
    if (!input) return;
    let sala = input.value.trim().toUpperCase();
    if (!sala) {
        input.style.borderColor = "#f87171";
        input.placeholder = "Digite um nome para a sala!";
        setTimeout(() => {
            input.style.borderColor = "#38bdf8";
            input.placeholder = "Ex: MinhasBatalha, sala123...";
        }, 800);
        return;
    }
    fecharTelaCriarSala();
    iniciarModoOnline(sala);
}
 
function fecharTelaCriarSala() {
    let telaSala = document.getElementById("tela-criar-sala");
    if (telaSala) telaSala.style.display = "none";
    telaMenu.style.display = "flex";
}
 
function mostrarTelaAguardando(sala) {
    telaMenu.style.display = "none";
    endScreen.classList.add("hidden");
    let telaSala = document.getElementById("tela-criar-sala");
    if (telaSala) telaSala.style.display = "none";
 
    let telaEspera = document.getElementById("tela-espera");
    if (!telaEspera) {
        telaEspera = document.createElement("div");
        telaEspera.id = "tela-espera";
        document.body.appendChild(telaEspera);
    }
    telaEspera.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: flex; flex-direction: column;
        align-items: center; justify-content: center; z-index: 999; color: white;
        font-family: Arial, sans-serif;
    `;
    telaEspera.innerHTML = `
        <h2 style="font-size:2.5rem; margin-bottom:10px; color:#38bdf8;">🌐 MODO ONLINE</h2>
        <p style="font-size:1.1rem; color:#94a3b8;">Você está na sala:</p>
        <div style="background:#1e293b; border:2px solid #38bdf8; border-radius:12px;
            padding:12px 40px; margin:15px 0; font-size:2rem; font-weight:bold;
            letter-spacing:4px; color:#38bdf8; cursor:pointer;"
            onclick="navigator.clipboard.writeText('${sala}')" title="Clique para copiar">
            ${sala}
        </div>
        <p style="font-size:0.85rem; color:#64748b;">Clique no código para copiar e enviar ao amigo 📋</p>
        <div style="margin:25px 0; font-size:1rem; color:#cbd5e1;">
            ✈️ Aguardando o segundo jogador... ✈️
        </div>
        <div style="width:200px; height:6px; background:#1e293b; border-radius:4px; overflow:hidden; margin-bottom:30px;">
            <div style="width:40%; height:100%; background:#38bdf8; border-radius:4px;
                animation:loading 1.2s ease-in-out infinite;"></div>
        </div>
        <button onclick="cancelarOnline()" style="padding:10px 30px; background:transparent;
            border:2px solid #f87171; color:#f87171; border-radius:8px; cursor:pointer; font-size:1rem;">
            Cancelar
        </button>
        <style>
            @keyframes loading { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        </style>
    `;
    telaEspera.style.display = "flex";
}
 
function esconderTelaAguardando() {
    let telaEspera = document.getElementById("tela-espera");
    if (telaEspera) telaEspera.style.display = "none";
}
 
function cancelarOnline() {
    modoOnline = false; salaOnline = null; meuNumero = null; modo2Players = false;
    esconderTelaAguardando();
    telaMenu.style.display = "flex";
}
 
// ─── EVENTOS DO SOCKET ────────────────────────────────────────
socket.on('playerAssigned', (numero) => {
    meuNumero = numero;
    console.log('Você é o Jogador', numero);
    if(jogar) {
        if(aviao)  aviao.playerColor  = 'red';
        if(aviao2) aviao2.playerColor = 'blue';
    }
});
 
socket.on('gameStart', () => {
    esconderTelaAguardando();
    iniciarJogo();
});
 
socket.on('roomFull', () => {
    esconderTelaAguardando();
    alert('Sala cheia! Tente outro nome de sala.');
    cancelarOnline();
});
 
socket.on('syncGameOver', ({ vitoria }) => {
    if (jogar) encerrarJogo(vitoria);
});
 
socket.on('opponentDisconnected', () => {
    jogar = false;
    cancelAnimationFrame(loopAnimacao);
    pararSons();
    cancelarOnline();
    alert('O oponente desconectou! Voltando ao menu...');
});
 
socket.on('opponentMove', ({ x, y, dir, pontos, vida }) => {
    if (!jogar) return;
    let oponente = meuNumero === 1 ? aviao2 : aviao;
    if (oponente) {
        oponente.x = x;
        oponente.y = y;
        oponente.dir = dir;
        if (pontos !== undefined) oponente.pontos = pontos;
        if (vida !== undefined) oponente.vida = vida;
        oponente.evoluir();
    }
});
 
socket.on('opponentShoot', () => {
    if (!jogar) return;
    let oponente = meuNumero === 1 ? aviao2 : aviao;
    if (oponente && oponente.vida > 0) {
        let agora = Date.now();
        if (agora - oponente.ultimoTiro > oponente.cooldown) {
            oponente.ultimoTiro = agora;
            if (oponente.tiroDuplo) {
                tiros.push(new Tiro(oponente.x + oponente.w, oponente.y + oponente.h/2 - 25, null));
                tiros.push(new Tiro(oponente.x + oponente.w, oponente.y + oponente.h/2 + 25, null));
            } else {
                tiros.push(new Tiro(oponente.x + oponente.w, oponente.y + oponente.h/2, null));
            }
        }
    }
});
 
socket.on('syncInimigo', ({ x, y, img, id }) => {
    if (!jogar) return;
    inimigos.push(new AviaoInimigo(x, y, 150, 150, img, id));
});
 
socket.on('syncRemoveInimigo', ({ id }) => {
    if (!jogar) return;
    inimigos = inimigos.filter(i => i.id !== id);
});
 
socket.on('syncItem', ({ x, y, tipo }) => {
    if (!jogar) return;
    let novoItem = new Item(x, y, 70, 70);
    novoItem.tipo = tipo;
    novoItem.atualizarVisual();
    itens.push(novoItem);
});
 
socket.on('syncBoss', ({ vidaMaxima }) => {
    fundoAvancado = true;
    const tentarCriarBoss = () => {
        if (!jogar) { setTimeout(tentarCriarBoss, 100); return; }
        if (boss) return;
        inimigos = []; itens = []; tirosBoss = [];
        boss = new Boss(1200, 325, 250, 250, "./img/nave_final.png", vidaMaxima);
        mostrarBossTexto = 150;
        audioFundo.pause();
        if (window.tocando) audioBossInicio.play();
        faseBossAtual = 1;
    };
    tentarCriarBoss();
});
 
socket.on('syncFundo', ({ ativo }) => {
    fundoAvancado = ativo;
});
 
socket.on('updateBossVida', ({ vida }) => {
    if (!jogar || !boss) return;
    boss.vida = vida;
    let limitFase2 = boss.vidaMaxima * 0.375;
    if (boss.vida <= limitFase2 && faseBossAtual === 1) {
        audioBossInicio.pause();
        if (window.tocando) audioBossFinal.play();
        faseBossAtual = 2;
    }
    if (boss.vida <= 0) { boss.vida = 0; encerrarJogo(true); }
});
 
// =======================
// VARIÁVEIS DE ÁUDIO & INTERFACE 🎵
// =======================
const telaEntrada = document.getElementById('tela-entrada');
const somInicio = new Audio('audio/som_inicio.mp3');
somInicio.loop = true;
 
const botaoSom = document.getElementById('botao-som');
window.tocando = true;
 
let audioFundo = new Audio("audio/som_fundo.mp3"); audioFundo.loop = true;
let audioBossInicio = new Audio("audio/som_inicio_boss.mp3"); audioBossInicio.loop = true;
let audioBossFinal = new Audio("audio/som_final.mp3"); audioBossFinal.loop = true;
let audioMayday = new Audio("audio/mayday.mp3"); let tocouMayday = false;
let audioVitoria = new Audio("audio/vitoria.mp3");
let audioDerrota = new Audio("audio/derrota.mp3");
let somTiro = new Audio("audio/som_tiro.mp3");
 
let faseBossAtual = 0;
const imgFundo2 = new Image(); imgFundo2.src = "./img/fundo_2.webp";
const imgFundo3 = new Image(); imgFundo3.src = "./img/fundo_3.avif";
 
function pararSons() {
    audioFundo.pause(); audioFundo.currentTime = 0;
    audioBossInicio.pause(); audioBossInicio.currentTime = 0;
    audioBossFinal.pause(); audioBossFinal.currentTime = 0;
    audioMayday.pause(); audioMayday.currentTime = 0;
    audioVitoria.pause(); audioVitoria.currentTime = 0;
    audioDerrota.pause(); audioDerrota.currentTime = 0;
}
 
telaEntrada.addEventListener('click', () => { somInicio.play(); telaEntrada.style.display = 'none'; });
 
botaoSom.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.tocando) {
        somInicio.pause(); audioFundo.muted = true; audioBossInicio.muted = true;
        audioBossFinal.muted = true; audioMayday.muted = true; audioVitoria.muted = true;
        audioDerrota.muted = true; somTiro.muted = true;
        botaoSom.innerText = "📁 Som: OFF"; window.tocando = false;
    } else {
        if (!jogar) somInicio.play();
        audioFundo.muted = false; audioBossInicio.muted = false; audioBossFinal.muted = false;
        audioMayday.muted = false; audioVitoria.muted = false; audioDerrota.muted = false;
        somTiro.muted = false;
        botaoSom.innerText = "🔊 Som: ON"; window.tocando = true;
    }
});
 
// =======================
// VARIÁVEIS DO JOGO
// =======================
let des, jogar = false, boss = null, tirosBoss = [], venceu = false;
let mostrarBossTexto = 0, loopAnimacao, aviao, aviao2, modo2Players = false;
let inimigos = [], tiros = [], itens = [], t1, t2;
let ultimaVez = 0;
let fundoAvancado = false;
window.fatorTempo = 1;
 
const telaMenu = document.getElementById("menu");
const endScreen = document.getElementById("end-screen");
const endTitle = document.getElementById("end-title");
const endScore = document.getElementById("end-score");
const canvas = document.getElementById("des");
const mainPanel = document.getElementById("main-panel");
const howToPanel = document.getElementById("how-to-play-panel");
const creditsPanel = document.getElementById("credits-panel");
 
window.onload = () => {
    des = canvas.getContext("2d");
 
    document.getElementById("btn-jogar-online").onclick = () => mostrarTelaCriarSala();
    document.getElementById("btn-jogar").onclick = () => iniciarModo(false);
    document.getElementById("btn-jogar-2p").onclick = () => iniciarModo(true);
    document.getElementById("btn-reiniciar").onclick = () => iniciarJogo();
    document.getElementById("btn-voltar-menu").onclick = voltarAoMenuPrincipal;
 
    document.getElementById("btn-como-jogar").onclick = () => { mainPanel.classList.add("hidden"); howToPanel.classList.remove("hidden"); };
    document.getElementById("btn-creditos").onclick = () => { mainPanel.classList.add("hidden"); creditsPanel.classList.remove("hidden"); };
    document.getElementById("btn-voltar-howto").onclick = () => { howToPanel.classList.add("hidden"); mainPanel.classList.remove("hidden"); };
    document.getElementById("btn-voltar-credits").onclick = () => { creditsPanel.classList.add("hidden"); mainPanel.classList.remove("hidden"); };
 
    const btnSubir = document.getElementById("btn-subir");
    const btnDescer = document.getElementById("btn-descer");
    btnSubir.addEventListener("touchstart", (e) => { e.preventDefault(); if(aviao) aviao.dir = -aviao.velAtual; });
    btnSubir.addEventListener("touchend", (e) => { e.preventDefault(); if(aviao) aviao.dir = 0; });
    btnDescer.addEventListener("touchstart", (e) => { e.preventDefault(); if(aviao) aviao.dir = aviao.velAtual; });
    btnDescer.addEventListener("touchend", (e) => { e.preventDefault(); if(aviao) aviao.dir = 0; });
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); if(jogar && aviao && aviao.vida > 0) atirar(aviao); });
};
 
function iniciarModo(is2P) {
    modo2Players = is2P;
    if(modo2Players) document.getElementById("controles-mobile").style.display = "none";
    iniciarJogo();
}
 
function iniciarJogo() {
    somInicio.pause(); somInicio.currentTime = 0;
    telaMenu.style.display = "none";
    endScreen.classList.add("hidden");
    inimigos = []; tiros = []; tirosBoss = []; itens = [];

    let usar2PCores = modo2Players || modoOnline;
    aviao = new Aviao(100, modo2Players ? 250 : 375, 150, 150, "./img/aviao_1.png", usar2PCores ? 'red' : null);
    if(modo2Players) { aviao2 = new Aviao(100, 500, 150, 150, "./img/aviao_1.png", 'blue'); }
    else { aviao2 = null; }
 
    t1 = new Text(); t2 = new Text();
    jogar = true; venceu = false; boss = null; mostrarBossTexto = 0; tocouMayday = false;
    ultimaVez = 0; fundoAvancado = false;
 
    pararSons();
    if(window.tocando) audioFundo.play();
    faseBossAtual = 0;
    cancelAnimationFrame(loopAnimacao);
    main(performance.now());
}
 
function encerrarJogo(isVitoria) {
    if (!jogar) return;
    jogar = false;
    pararSons();
    if (modoOnline && salaOnline) {
        socket.emit('gameOver', { roomId: salaOnline, vitoria: isVitoria });
    }
    if(modoOnline) { modoOnline = false; salaOnline = null; meuNumero = null; modo2Players = false; }
    endScreen.classList.remove("hidden");
    let pontosFinais = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
    endScore.innerText = "Pontuação Total: " + pontosFinais;
    if(isVitoria) { if(window.tocando) audioVitoria.play(); endTitle.innerText = "MISSÃO CUMPRIDA!"; endTitle.style.color = "#4ade80"; }
    else { if(window.tocando) audioDerrota.play(); endTitle.innerText = "GAME OVER"; endTitle.style.color = "#f87171"; }
}
 
function voltarAoMenuPrincipal() {
    pararSons();
    if(window.tocando) somInicio.play();
    endScreen.classList.add("hidden");
    telaMenu.style.display = "flex";
    des.clearRect(0, 0, 1600, 900);
}
 
function atirar(player) {
    let agora = Date.now();
    if(agora - player.ultimoTiro > player.cooldown) {
        player.ultimoTiro = agora;
        if(window.tocando) somTiro.cloneNode().play();
        if(player.tiroDuplo) {
            tiros.push(new Tiro(player.x + player.w, player.y + player.h/2 - 25, player));
            tiros.push(new Tiro(player.x + player.w, player.y + player.h/2 + 25, player));
        } else {
            tiros.push(new Tiro(player.x + player.w, player.y + player.h/2, player));
        }
        if(modoOnline && salaOnline) {
            let meu = meuNumero === 1 ? aviao : aviao2;
            if(player === meu) socket.emit('playerShoot', { roomId: salaOnline });
        }
    }
}
 
document.addEventListener("keydown", e => {
    if(!jogar) return;
    if(modoOnline) {
        let meu = meuNumero === 1 ? aviao : aviao2;
        if(meu && meu.vida > 0) {
            if(e.key === "w" || e.key === "W" || e.key === "ArrowUp") { meu.dir = -meu.velAtual; e.preventDefault(); }
            if(e.key === "s" || e.key === "S" || e.key === "ArrowDown") { meu.dir = meu.velAtual; e.preventDefault(); }
            if(e.key === " " || e.key === "Enter") atirar(meu);
        }
    } else {
        if(aviao && aviao.vida > 0) {
            if(e.key === "w" || e.key === "W") aviao.dir = -aviao.velAtual;
            if(e.key === "s" || e.key === "S") aviao.dir = aviao.velAtual;
            if(e.key === " ") atirar(aviao);
        }
        if(modo2Players && aviao2 && aviao2.vida > 0) {
            if(e.key === "ArrowUp") { aviao2.dir = -aviao2.velAtual; e.preventDefault(); }
            if(e.key === "ArrowDown") { aviao2.dir = aviao2.velAtual; e.preventDefault(); }
            if(e.key === "Enter") atirar(aviao2);
        }
    }
});
 
document.addEventListener("keyup", e => {
    if(!jogar) return;
    if(modoOnline) {
        let meu = meuNumero === 1 ? aviao : aviao2;
        if(meu && (e.key === "w" || e.key === "s" || e.key === "W" || e.key === "S" || e.key === "ArrowUp" || e.key === "ArrowDown")) meu.dir = 0;
    } else {
        if(aviao && (e.key === "w" || e.key === "s" || e.key === "W" || e.key === "S")) aviao.dir = 0;
        if(aviao2 && (e.key === "ArrowUp" || e.key === "ArrowDown")) aviao2.dir = 0;
    }
});
 
document.addEventListener("mousedown", (e) => {
    if(!jogar || e.target.id === "btn-subir" || e.target.id === "btn-descer") return;
    if(modoOnline) { let meu = meuNumero === 1 ? aviao : aviao2; if(meu && meu.vida > 0) atirar(meu); }
    else { if(aviao && aviao.vida > 0) atirar(aviao); }
});

// =======================
// SPAWN DE ENTIDADES
// BUG FIX: a verificação de sobreposição bloqueava o spawn quando
// muitos inimigos ocupavam as mesmas faixas. Agora o spawn tenta
// até 3 posições aleatórias diferentes antes de desistir, e a
// janela de sobreposição cobre apenas inimigos próximos da borda
// direita (x > 1350), não inimigos no meio da tela.
// =======================
function spawnEntidades() {
    if(boss) return;
    if(modoOnline && meuNumero !== 1) return;

    let limiteInimigos = modo2Players ? 11 : 8;
    let chanceInimigo  = modo2Players ? 0.045 : 0.03;

    // Remove inimigos que saíram da tela pela esquerda (limpeza extra de segurança)
    inimigos = inimigos.filter(i => i.x > -200);

    if(inimigos.length < limiteInimigos && Math.random() < chanceInimigo * window.fatorTempo) {
        let tamanhoFaixa = 750 / 5;
        let spawnado = false;

        // Tenta até 4 faixas aleatórias — evita travar quando algumas faixas estão cheias
        for(let tentativa = 0; tentativa < 4 && !spawnado; tentativa++) {
            let faixaAleatoria = Math.floor(Math.random() * 5);
            let novoY = (faixaAleatoria * tamanhoFaixa) + (tamanhoFaixa / 2) - 75;

            // Só bloqueia se houver inimigo nessa faixa MUITO perto da borda de entrada
            let sobreposto = inimigos.some(i => Math.abs(i.y - novoY) < 80 && i.x > 1350);

            if(!sobreposto) {
                let imgs = ["./img/aviao_1.png", "./img/aviao_2.png"];
                let imgSorteada = imgs[Math.floor(Math.random() * imgs.length)];
                let id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
                inimigos.push(new AviaoInimigo(1600, novoY, 150, 150, imgSorteada, id));
                if(modoOnline) socket.emit('spawnInimigo', { roomId: salaOnline, x: 1600, y: novoY, img: imgSorteada, id });
                spawnado = true;
            }
        }
    }

    let chanceItem = modo2Players ? 0.01 : 0.002;
    if((itens.length === 0 || itens[itens.length-1].x < 1000) && Math.random() < chanceItem * window.fatorTempo) {
        let novoX = 1600, novoY = Math.random() * 830;
        let novoItem = new Item(novoX, novoY, 70, 70);
        itens.push(novoItem);
        if(modoOnline && salaOnline) socket.emit('spawnItem', { roomId: salaOnline, x: novoX, y: novoY, tipo: novoItem.tipo });
    }
}
 
function aplicarPowerUp(player, tipo) {
    if(tipo === "velocidade") { player.velAtual = 14; setTimeout(() => { if(player) player.velAtual = 8; }, 5000); }
    else if(tipo === "escudo") { player.escudo = true; setTimeout(() => { if(player) player.escudo = false; }, 5000); }
    else if(tipo === "tiro") { player.tiroDuplo = true; setTimeout(() => { if(player) player.tiroDuplo = false; }, 5000); }
}
 
function colisao() {
    itens.forEach((it, i) => {
        if(aviao && aviao.vida > 0 && aviao.colid(it)) { aplicarPowerUp(aviao, it.tipo); itens.splice(i, 1); }
        else if(aviao2 && aviao2.vida > 0 && aviao2.colid(it)) { aplicarPowerUp(aviao2, it.tipo); itens.splice(i, 1); }
    });
 
    for(let i = inimigos.length - 1; i >= 0; i--) {
        let inimigo = inimigos[i];
        let eliminado = false;
 
        for(let t = tiros.length - 1; t >= 0; t--) {
            if(tiros[t].colid(inimigo)) {
                if(tiros[t].owner) {
                    tiros[t].owner.pontos += 10;
                    let id = inimigo.id;
                    inimigos.splice(i, 1);
                    tiros.splice(t, 1);
                    if(modoOnline) socket.emit('removeInimigo', { roomId: salaOnline, id });
                    eliminado = true;
                } else {
                    tiros.splice(t, 1);
                }
                break;
            }
        }
 
        if(!eliminado && inimigos[i]) {
            if(aviao && aviao.vida > 0 && aviao.colid(inimigos[i])) {
                if(!aviao.escudo) aviao.vida--;
                let id = inimigos[i].id;
                inimigos.splice(i, 1);
                if(modoOnline) socket.emit('removeInimigo', { roomId: salaOnline, id });
                continue;
            }
            if(aviao2 && aviao2.vida > 0 && aviao2.colid(inimigos[i])) {
                if(!aviao2.escudo) aviao2.vida--;
                let id = inimigos[i].id;
                inimigos.splice(i, 1);
                if(modoOnline) socket.emit('removeInimigo', { roomId: salaOnline, id });
            }
        }
    }
 
    if(boss) {
        for(let t = tiros.length - 1; t >= 0; t--) {
            if(tiros[t].colid(boss)) {
                boss.vida -= 10;
                if(tiros[t].owner) tiros[t].owner.pontos += 10;
                tiros.splice(t, 1);
                if(modoOnline) socket.emit('syncBossVida', { roomId: salaOnline, vida: boss.vida });
                let limitFase2 = boss.vidaMaxima * 0.375;
                if(boss.vida <= limitFase2 && faseBossAtual === 1) {
                    audioBossInicio.pause(); if(window.tocando) audioBossFinal.play(); faseBossAtual = 2;
                }
                if(boss.vida <= 0) { boss.vida = 0; encerrarJogo(true); break; }
            }
        }
    }
}
 
function atualiza() {
    if(!jogar) return;
 
    let p1Vivo = aviao && aviao.vida > 0;
    let p2Vivo = aviao2 && aviao2.vida > 0;
 
    if(!modo2Players && !p1Vivo) encerrarJogo(false);
    else if(modo2Players && !p1Vivo && !p2Vivo) encerrarJogo(false);
 
    if(((p1Vivo && aviao.vida === 1) || (p2Vivo && aviao2 && aviao2.vida === 1)) && !tocouMayday) {
        if(window.tocando) audioMayday.play(); tocouMayday = true;
    }
 
    if(modoOnline) {
        let meu = meuNumero === 1 ? aviao : aviao2;
        if(meu && meu.vida > 0) {
            meu.mov_aviao();
            meu.evoluir();
            socket.emit('playerMove', {
                roomId: salaOnline,
                x: meu.x, y: meu.y, dir: meu.dir,
                pontos: meu.pontos, vida: meu.vida
            });
        }
    } else {
        if(p1Vivo) { aviao.mov_aviao(); aviao.evoluir(); }
        if(p2Vivo) { aviao2.mov_aviao(); aviao2.evoluir(); }
    }
 
    spawnEntidades();
    if(boss) { boss.mov(); boss.atirar(); }
    inimigos.forEach(i => i.mov_aviao());
    tiros.forEach(t => t.mov());
    itens.forEach(item => item.mov());
 
    for(let i = tirosBoss.length - 1; i >= 0; i--) {
        let t = tirosBoss[i];
        t.x -= t.vel * window.fatorTempo;
        let acertou = false;
        if(p1Vivo && aviao.colid({x: t.x, y: t.y, w: t.w, h: t.h})) { if(!aviao.escudo) aviao.vida--; acertou = true; }
        else if(p2Vivo && aviao2.colid({x: t.x, y: t.y, w: t.w, h: t.h})) { if(!aviao2.escudo) aviao2.vida--; acertou = true; }
        if(acertou) tirosBoss.splice(i, 1);
    }
 
    colisao();
 
    let pontosAtuais = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
    let pontosParaBoss = modo2Players ? 700 : 350;
 
    if(pontosAtuais >= pontosParaBoss && !boss && jogar) {
        if(!modoOnline || meuNumero === 1) {
            inimigos = []; itens = []; tirosBoss = [];
            let bossVida = modo2Players ? 800 : 400;
            boss = new Boss(1200, 325, 250, 250, "./img/nave_final.png", bossVida);
            mostrarBossTexto = 150;
            audioFundo.pause();
            if(window.tocando) audioBossInicio.play();
            faseBossAtual = 1;
            fundoAvancado = true;
            if(modoOnline) socket.emit('spawnBoss', { roomId: salaOnline, vidaMaxima: bossVida });
        }
    }
 
    if(modoOnline && meuNumero === 1 && !boss) {
        let pcts = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
        let metade = modo2Players ? 350 : 175;
        if(pcts >= metade && !fundoAvancado) {
            fundoAvancado = true;
            socket.emit('syncFundo', { roomId: salaOnline, ativo: true });
        }
    }
}
 
function desenha() {
    if(!jogar) return;
 
    let pontosAtuais = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
    let pontosParaBoss = modo2Players ? 700 : 350;
    let deveUsarFundo2 = modoOnline ? fundoAvancado : (pontosAtuais >= pontosParaBoss / 2);
 
    if(boss) { des.drawImage(imgFundo3, 0, 0, 1600, 900); }
    else if(deveUsarFundo2) { des.drawImage(imgFundo2, 0, 0, 1600, 900); }
 
    if(aviao && aviao.vida > 0) aviao.des_img();
    if(aviao2 && aviao2.vida > 0) aviao2.des_img();
 
    inimigos.forEach(i => i.des_img());
    itens.forEach(item => item.des_img());
    tiros.forEach(t => t.des_quad());
    tirosBoss.forEach(t => { des.fillStyle = "red"; des.fillRect(t.x, t.y, t.w, t.h); });
 
    let isMobile = window.innerWidth <= 900;
    let fonte = isMobile ? "40px Arial" : "20px Arial";
    let marginY = isMobile ? 80 : 50;
    let espacoY = isMobile ? 50 : 30;
    let xPontos = isMobile ? 1100 : 1180;
 
    if(boss) {
        boss.des_img();
        let barWidth = 600, barHeight = 25, barX = 500, barY = 30;
        des.fillStyle = "rgba(0,0,0,0.7)"; des.fillRect(barX, barY, barWidth, barHeight);
        des.fillStyle = "red"; des.fillRect(barX, barY, Math.max(0, (boss.vida / boss.vidaMaxima) * barWidth), barHeight);
        des.strokeStyle = "white"; des.lineWidth = 2; des.strokeRect(barX, barY, barWidth, barHeight);
        let fontBoss = isMobile ? "bold 30px Arial" : "bold 18px Arial";
        des.fillStyle = "white"; des.font = fontBoss; des.textAlign = "center";
        des.fillText(`BOSS ALIEN: ${boss.vida} / ${boss.vidaMaxima}`, barX + barWidth / 2, barY + (isMobile ? 24 : 18));
        des.textAlign = "left";
    }

    // ── HUD limpo: só vida e pontos, P1 = vermelho | P2 = azul ──
    if(aviao && aviao.vida > 0) {
        t2.des_text("Vida P1: " + aviao.vida, 20, marginY, "#ff4444", fonte);
        t1.des_text("Pontos P1: " + aviao.pontos, xPontos, marginY, "#ff9999", fonte);
    } else if(modo2Players && aviao && aviao.vida <= 0) {
        t2.des_text("P1: ABATIDO", 20, marginY, "gray", fonte);
    }
 
    if(modo2Players) {
        if(aviao2 && aviao2.vida > 0) {
            t2.des_text("Vida P2: " + aviao2.vida, 20, marginY + espacoY, "#4c9fff", fonte);
            t1.des_text("Pontos P2: " + aviao2.pontos, xPontos, marginY + espacoY, "#99ccff", fonte);
        } else if(aviao2 && aviao2.vida <= 0) {
            t2.des_text("P2: ABATIDO", 20, marginY + espacoY, "gray", fonte);
        }
    }
}
 
function main(tempoAtual) {
    if(!jogar) return;
    loopAnimacao = requestAnimationFrame(main);
    if(!ultimaVez) ultimaVez = tempoAtual;
    let tempoDecorrido = tempoAtual - ultimaVez;
    ultimaVez = tempoAtual;
    if(tempoDecorrido > 100) tempoDecorrido = 100;
    window.fatorTempo = tempoDecorrido / 16.6666;
    des.clearRect(0, 0, 1600, 900);
    atualiza();
    desenha();
}
