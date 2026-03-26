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
window.somTiroAlien = new Audio("audio/som_tiro_alien.mp3");

let faseBossAtual = 0; 

// =======================
// CARREGAMENTO DOS FUNDOS NOVOS 🌅🌃
// =======================
// =======================
// CARREGAMENTO DOS FUNDOS NOVOS 🌅🌃
// =======================
const imgFundo2 = new Image();
imgFundo2.src = "./img/fundo_2.webp"; // <-- Adicionei o ./img/

const imgFundo3 = new Image();
imgFundo3.src = "./img/fundo_3.avif"; // <-- Adicionei o ./img/

function pararSons() {
    audioFundo.pause(); audioFundo.currentTime = 0;
    audioBossInicio.pause(); audioBossInicio.currentTime = 0;
    audioBossFinal.pause(); audioBossFinal.currentTime = 0;
    audioMayday.pause(); audioMayday.currentTime = 0;
    audioVitoria.pause(); audioVitoria.currentTime = 0;
    audioDerrota.pause(); audioDerrota.currentTime = 0;
}

// =======================
// INTERAÇÃO INICIAL
// =======================
telaEntrada.addEventListener('click', () => { somInicio.play(); telaEntrada.style.display = 'none'; });

botaoSom.addEventListener('click', () => {
    if (window.tocando) {
        somInicio.pause(); audioFundo.muted = true; audioBossInicio.muted = true; audioBossFinal.muted = true;
        audioMayday.muted = true; audioVitoria.muted = true; audioDerrota.muted = true;
        somTiro.muted = true; window.somTiroAlien.muted = true;
        botaoSom.innerText = "📁 Som: OFF"; window.tocando = false;
    } else {
        if (!jogar) somInicio.play();
        audioFundo.muted = false; audioBossInicio.muted = false; audioBossFinal.muted = false;
        audioMayday.muted = false; audioVitoria.muted = false; audioDerrota.muted = false;
        somTiro.muted = false; window.somTiroAlien.muted = false;
        botaoSom.innerText = "🔊 Som: ON"; window.tocando = true;
    }
});

// =======================
// VARIÁVEIS DO JOGO
// =======================
let des, jogar = false, boss = null, tirosBoss = [], venceu = false;
let mostrarBossTexto = 0, loopAnimacao, aviao, aviao2, modo2Players = false;
let inimigos = [], tiros = [], itens = [], t1, t2;

const telaMenu = document.getElementById("menu");
const endScreen = document.getElementById("end-screen");
const endTitle = document.getElementById("end-title");
const endScore = document.getElementById("end-score");
const canvas = document.getElementById("des");

// Elementos dos Painéis do Menu
const mainPanel = document.getElementById("main-panel");
const howToPanel = document.getElementById("how-to-play-panel");
const creditsPanel = document.getElementById("credits-panel");

// =======================
// INIT & MENUS
// =======================
window.onload = () => {
    des = canvas.getContext("2d");
    
    // Botões de Iniciar Jogo
    document.getElementById("btn-jogar").onclick = () => iniciarModo(false);
    document.getElementById("btn-jogar-2p").onclick = () => iniciarModo(true);
    document.getElementById("btn-reiniciar").onclick = () => iniciarJogo();
    document.getElementById("btn-voltar-menu").onclick = voltarAoMenuPrincipal;

    // Botões de Navegação do Menu
    document.getElementById("btn-como-jogar").onclick = () => {
        mainPanel.classList.add("hidden");
        howToPanel.classList.remove("hidden");
    };
    document.getElementById("btn-creditos").onclick = () => {
        mainPanel.classList.add("hidden");
        creditsPanel.classList.remove("hidden");
    };
    document.getElementById("btn-voltar-howto").onclick = () => {
        howToPanel.classList.add("hidden");
        mainPanel.classList.remove("hidden");
    };
    document.getElementById("btn-voltar-credits").onclick = () => {
        creditsPanel.classList.add("hidden");
        mainPanel.classList.remove("hidden");
    };
}

function iniciarModo(is2P) {
    modo2Players = is2P;
    iniciarJogo();
}

function iniciarJogo() {
    somInicio.pause(); somInicio.currentTime = 0;
    telaMenu.style.display = "none";
    endScreen.classList.add("hidden");
    inimigos = []; tiros = []; tirosBoss = []; itens = [];
    
    aviao = new Aviao(100, modo2Players ? 250 : 375, 150, 150, "./img/aviao_1.png");
    
    if(modo2Players){
        aviao2 = new Aviao(100, 500, 150, 150, "./img/aviao_1.png");
    } else {
        aviao2 = null;
    }

    t1 = new Text(); t2 = new Text();
    jogar = true; venceu = false; boss = null; mostrarBossTexto = 0; tocouMayday = false;
    pararSons();
    if (window.tocando) audioFundo.play();
    faseBossAtual = 0;
    cancelAnimationFrame(loopAnimacao);
    main();
}

function encerrarJogo(isVitoria) {
    jogar = false; 
    pararSons();
    endScreen.classList.remove("hidden");
    
    let pontosFinais = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
    endScore.innerText = "Pontuação Total: " + pontosFinais;
    
    if(isVitoria) { 
        if(window.tocando) audioVitoria.play();
        endTitle.innerText = "MISSÃO CUMPRIDA!"; endTitle.style.color = "#4ade80"; 
    } else { 
        if(window.tocando) audioDerrota.play();
        endTitle.innerText = "GAME OVER"; endTitle.style.color = "#f87171"; 
    }
}

function voltarAoMenuPrincipal() {
    pararSons();
    if (window.tocando) somInicio.play();
    endScreen.classList.add("hidden");
    telaMenu.style.display = "flex";
    des.clearRect(0,0,1600,900); 
}

// =======================
// CONTROLES E MECÂNICAS
// =======================
function atirar(player){
    let agora = Date.now();
    if(agora - player.ultimoTiro > player.cooldown){
        player.ultimoTiro = agora;
        
        if(window.tocando) somTiro.cloneNode().play();

        if (player.tiroDuplo) {
            tiros.push(new Tiro(player.x + player.w, player.y + player.h/2 - 25, player)); 
            tiros.push(new Tiro(player.x + player.w, player.y + player.h/2 + 25, player));
        } else {
            tiros.push(new Tiro(player.x + player.w, player.y + player.h/2, player));
        }
    }
}

document.addEventListener("keydown", e => {
    if(!jogar) return;
    
    if(aviao && aviao.vida > 0){
        if(e.key === "w" || e.key === "W") aviao.dir = -aviao.velAtual;
        if(e.key === "s" || e.key === "S") aviao.dir = aviao.velAtual;
        if(e.key === " ") atirar(aviao);
    }
    
    if(modo2Players && aviao2 && aviao2.vida > 0){
        if(e.key === "ArrowUp") { aviao2.dir = -aviao2.velAtual; e.preventDefault(); }
        if(e.key === "ArrowDown") { aviao2.dir = aviao2.velAtual; e.preventDefault(); }
        if(e.key === "Enter") atirar(aviao2);
    }
});

document.addEventListener("mousedown", () => { if(jogar && aviao && aviao.vida > 0) atirar(aviao); });

document.addEventListener("keyup", e => {
    if(!jogar) return;
    if(aviao && (e.key === "w" || e.key === "s" || e.key === "W" || e.key === "S")) aviao.dir = 0;
    if(aviao2 && (e.key === "ArrowUp" || e.key === "ArrowDown")) aviao2.dir = 0;
});

function spawnEntidades(){
    if(boss) return;
    
    // BALANCEAMENTO E FAIXAS (LANES)
    let limiteInimigos = modo2Players ? 10 : 8; // 2P tem um pouco mais de inimigos totais
    let chanceInimigo = modo2Players ? 0.02 : 0.03; // Mas nascem um pouco mais devagar em 2P para não lotar de uma vez

    if(inimigos.length < limiteInimigos && Math.random() < chanceInimigo){ 
        
        // Divide a tela em 5 faixas para evitar engavetamento
        let numeroDeFaixas = 5;
        let tamanhoFaixa = 750 / numeroDeFaixas; 
        let faixaAleatoria = Math.floor(Math.random() * numeroDeFaixas);
        
        // Centraliza na faixa sorteada (75 é metade da altura 150)
        let novoY = (faixaAleatoria * tamanhoFaixa) + (tamanhoFaixa / 2) - 75;
        
        // Verifica se já não tem alguém muito perto na mesma faixa horizontal
        let sobreposto = inimigos.some(inimigo => Math.abs(inimigo.y - novoY) < 80 && inimigo.x > 1400);

        if(!sobreposto) {
            let imagensInimigos = ["./img/aviao_1.png", "./img/aviao_2.png"];
            let imgSorteada = imagensInimigos[Math.floor(Math.random() * imagensInimigos.length)];
            inimigos.push(new AviaoInimigo(1600, novoY, 150, 150, imgSorteada));
        }
    }
    
    // Aumentando BASTANTE a chance de powerups no modo 2 Players (0.01 vs 0.002)
    let chanceItem = modo2Players ? 0.01 : 0.002;
    if((itens.length === 0 || itens[itens.length-1].x < 1000) && Math.random() < chanceItem){ 
        itens.push(new Item(1600, Math.random() * 830, 70, 70));
    }
}

function aplicarPowerUp(player, tipo) {
    if(tipo === "velocidade"){
        player.velAtual = 14; setTimeout(() => { if(player) player.velAtual = 8; }, 5000);
    } else if(tipo === "escudo"){
        player.escudo = true; setTimeout(() => { if(player) player.escudo = false; }, 5000);
    } else if(tipo === "tiro"){
        player.tiroDuplo = true; setTimeout(() => { if(player) player.tiroDuplo = false; }, 5000);
    }
}

function colisao(){
    itens.forEach((it, i) => { 
        if(aviao && aviao.vida > 0 && aviao.colid(it)){ aplicarPowerUp(aviao, it.tipo); itens.splice(i,1); }
        else if(aviao2 && aviao2.vida > 0 && aviao2.colid(it)){ aplicarPowerUp(aviao2, it.tipo); itens.splice(i,1); }
    });

    for(let i = inimigos.length-1; i>=0; i--){
        let inimigo = inimigos[i];
        
        for(let t = tiros.length-1; t>=0; t--){
            if(tiros[t].colid(inimigo)){ 
                if(tiros[t].owner) tiros[t].owner.pontos += 10; 
                inimigos.splice(i,1); 
                tiros.splice(t,1); 
                break; 
            }
        }
        
        if(inimigos[i]){
            if(aviao && aviao.vida > 0 && aviao.colid(inimigos[i])){ 
                if(!aviao.escudo) aviao.vida--; 
                inimigos.splice(i,1); 
                continue; 
            }
            if(aviao2 && aviao2.vida > 0 && aviao2.colid(inimigos[i])){ 
                if(!aviao2.escudo) aviao2.vida--; 
                inimigos.splice(i,1); 
            }
        }
    }
    
    if(boss){
        for(let t = tiros.length-1; t>=0; t--){
            if(tiros[t].colid(boss)){
                boss.vida -= 10; 
                if(tiros[t].owner) tiros[t].owner.pontos += 10;
                tiros.splice(t,1);
                
                let limitFase2 = boss.vidaMaxima * 0.375; 
                if(boss.vida <= limitFase2 && faseBossAtual === 1) {
                    audioBossInicio.pause(); if(window.tocando) audioBossFinal.play(); faseBossAtual = 2; 
                }
                if(boss.vida <= 0){ boss.vida = 0; encerrarJogo(true); break; }
            }
        }
    }
}

function atualiza(){
    if(!jogar) return;
    
    let p1Vivo = aviao && aviao.vida > 0;
    let p2Vivo = aviao2 && aviao2.vida > 0;

    if(!modo2Players && !p1Vivo) encerrarJogo(false);
    else if(modo2Players && !p1Vivo && !p2Vivo) encerrarJogo(false);

    if(((p1Vivo && aviao.vida === 1) || (p2Vivo && aviao2.vida === 1)) && !tocouMayday) {
        if(window.tocando) audioMayday.play(); tocouMayday = true;
    }

    if(p1Vivo) { aviao.mov_aviao(); aviao.evoluir(); }
    if(p2Vivo) { aviao2.mov_aviao(); aviao2.evoluir(); }
    
    spawnEntidades();
    if(boss){ boss.mov(); boss.atirar(); }
    inimigos.forEach(i => i.mov_aviao());
    tiros.forEach(t => t.mov());
    itens.forEach(item => item.mov());
    
    for(let i = tirosBoss.length - 1; i >= 0; i--){
        let t = tirosBoss[i]; t.x -= t.vel;
        let acertou = false;
        
        if(p1Vivo && aviao.colid({x: t.x, y: t.y, w: t.w, h: t.h})){
            if(!aviao.escudo) aviao.vida--; acertou = true;
        } else if(p2Vivo && aviao2.colid({x: t.x, y: t.y, w: t.w, h: t.h})){
            if(!aviao2.escudo) aviao2.vida--; acertou = true;
        }
        if(acertou) tirosBoss.splice(i,1);
    }
    
    colisao(); 
    
    let pontosAtuais = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
    let pontosParaBoss = modo2Players ? 700 : 350;

    if(pontosAtuais >= pontosParaBoss && !boss && jogar){
        inimigos = []; 
        itens = [];
        tirosBoss = [];

        let bossVida = modo2Players ? 800 : 400; 
        boss = new Boss(1200, 325, 250, 250, "./img/nave_final.png", bossVida);
        
        mostrarBossTexto = 150;
        audioFundo.pause(); 
        if(window.tocando) audioBossInicio.play(); 
        faseBossAtual = 1;
    }
}

function desenha(){
    if(!jogar) return; 
    
    // ==========================================
    // LÓGICA DO FUNDO
    // ==========================================
    let pontosAtuais = (aviao ? aviao.pontos : 0) + (aviao2 ? aviao2.pontos : 0);
    let pontosParaBoss = modo2Players ? 700 : 350;

    if (boss) {
        des.drawImage(imgFundo3, 0, 0, 1600, 900);
    } else if (pontosAtuais >= pontosParaBoss / 2) {
        des.drawImage(imgFundo2, 0, 0, 1600, 900);
    }
    // ==========================================
    
    if(aviao && aviao.vida > 0) aviao.des_img();
    if(aviao2 && aviao2.vida > 0) aviao2.des_img();
    
    inimigos.forEach(i => i.des_img());
    itens.forEach(item => item.des_img());
    tiros.forEach(t => t.des_quad());
    tirosBoss.forEach(t => { des.fillStyle = "red"; des.fillRect(t.x, t.y, t.w, t.h); });

    if(boss){
        boss.des_img();
        
        let barWidth = 600; let barHeight = 25;
        let barX = 500; let barY = 30;

        des.fillStyle = "rgba(0, 0, 0, 0.7)"; des.fillRect(barX, barY, barWidth, barHeight);
        let vidaAtualLargura = (boss.vida / boss.vidaMaxima) * barWidth;
        des.fillStyle = "red"; des.fillRect(barX, barY, Math.max(0, vidaAtualLargura), barHeight); 
        des.strokeStyle = "white"; des.lineWidth = 2; des.strokeRect(barX, barY, barWidth, barHeight);

        des.fillStyle = "white"; des.font = "bold 18px Arial"; des.textAlign = "center"; 
        des.fillText(`BOSS ALIEN: ${boss.vida} / ${boss.vidaMaxima}`, barX + barWidth / 2, barY + 18);
        des.textAlign = "left";
    }

    if(aviao && aviao.vida > 0) {
        t2.des_text("Vida P1: " + aviao.vida, 50, 50, "red", "20px Arial");
        t1.des_text("Pontos P1: " + aviao.pontos, 1180, 50, "yellow", "20px Arial");
    } else if (modo2Players && aviao && aviao.vida <= 0) {
        t2.des_text("P1: ABATIDO", 50, 50, "gray", "20px Arial");
    }

    if(modo2Players){
        if(aviao2 && aviao2.vida > 0) {
            t2.des_text("Vida P2: " + aviao2.vida, 50, 80, "cyan", "20px Arial");
            t1.des_text("Pontos P2: " + aviao2.pontos, 1180, 80, "cyan", "20px Arial");
        } else if (aviao2 && aviao2.vida <= 0) {
            t2.des_text("P2: ABATIDO", 50, 80, "gray", "20px Arial");
        }
    }
}

function main(){
    if(!jogar) return; 
    des.clearRect(0,0,1600,900); 
    desenha(); 
    atualiza();
    loopAnimacao = requestAnimationFrame(main);
}