// =======================
// VARIÁVEIS DE ÁUDIO & INTERFACE 🎵
// =======================
const telaEntrada = document.getElementById('tela-entrada');
const somInicio = new Audio('audio/som_inicio.mp3'); 
somInicio.loop = true; 

const botaoSom = document.getElementById('botao-som');
let tocando = true; 

let audioFundo = new Audio("audio/som_fundo.mp3");
audioFundo.loop = true; 

let audioBossInicio = new Audio("audio/som_inicio_boss.mp3");
audioBossInicio.loop = true;

let audioBossFinal = new Audio("audio/som_final.mp3");
audioBossFinal.loop = true;

let audioMayday = new Audio("audio/mayday.mp3");
let tocouMayday = false; 

// NOVOS SONS DE FIM DE JOGO
let audioVitoria = new Audio("audio/vitoria.mp3");
let audioDerrota = new Audio("audio/derrota.mp3");

let faseBossAtual = 0; 

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
telaEntrada.addEventListener('click', () => {
    somInicio.play();
    telaEntrada.style.display = 'none';
});

botaoSom.addEventListener('click', () => {
    if (tocando) {
        somInicio.pause();
        audioFundo.muted = true;
        audioBossInicio.muted = true;
        audioBossFinal.muted = true;
        audioMayday.muted = true;
        audioVitoria.muted = true;
        audioDerrota.muted = true;
        botaoSom.innerText = "📁 Som: OFF";
        tocando = false;
    } else {
        if (!jogar) somInicio.play();
        audioFundo.muted = false;
        audioBossInicio.muted = false;
        audioBossFinal.muted = false;
        audioMayday.muted = false;
        audioVitoria.muted = false;
        audioDerrota.muted = false;
        botaoSom.innerText = "🔊 Som: ON";
        tocando = true;
    }
});

// =======================
// VARIÁVEIS DO JOGO
// =======================
let des, jogar = false, boss = null, tirosBoss = [], venceu = false;
let mostrarBossTexto = 0, loopAnimacao, aviao, inimigos = [], tiros = [], itens = [], t1, t2;

const telaMenu = document.getElementById("menu");
const mainPanel = document.getElementById("main-panel");
const howToPanel = document.getElementById("how-to-play-panel");
const creditsPanel = document.getElementById("credits-panel");
const endScreen = document.getElementById("end-screen");
const endTitle = document.getElementById("end-title");
const endScore = document.getElementById("end-score");
const canvas = document.getElementById("des");

// =======================
// INIT & MENUS
// =======================
window.onload = () => {
    des = canvas.getContext("2d");
    document.getElementById("btn-jogar").onclick = iniciarJogo;
    document.getElementById("btn-como-jogar").onclick = () => { mainPanel.classList.add("hidden"); howToPanel.classList.remove("hidden"); }
    document.getElementById("btn-creditos").onclick = () => { mainPanel.classList.add("hidden"); creditsPanel.classList.remove("hidden"); }
    document.getElementById("btn-voltar-howto").onclick = () => { howToPanel.classList.add("hidden"); mainPanel.classList.remove("hidden"); }
    document.getElementById("btn-voltar-credits").onclick = () => { creditsPanel.classList.add("hidden"); mainPanel.classList.remove("hidden"); }
    document.getElementById("btn-reiniciar").onclick = iniciarJogo;
    document.getElementById("btn-voltar-menu").onclick = voltarAoMenuPrincipal;
}

function iniciarJogo() {
    somInicio.pause(); somInicio.currentTime = 0;
    telaMenu.style.display = "none";
    endScreen.classList.add("hidden");
    inimigos = []; tiros = []; tirosBoss = []; itens = [];
    aviao = new Aviao(100, 375, 150, 150, "./img/aviao_1.png");
    t1 = new Text(); t2 = new Text();
    jogar = true; venceu = false; boss = null; mostrarBossTexto = 0; tocouMayday = false;
    pararSons();
    if (tocando) audioFundo.play();
    faseBossAtual = 0;
    cancelAnimationFrame(loopAnimacao);
    main();
}

function encerrarJogo(isVitoria) {
    jogar = false; 
    pararSons(); // Para as músicas de fundo e boss
    
    endScreen.classList.remove("hidden");
    endScore.innerText = "Sua pontuação final: " + aviao.pontos;
    
    if(isVitoria) { 
        if(tocando) audioVitoria.play(); // TOCA VITORIA
        endTitle.innerText = "MISSÃO CUMPRIDA!"; 
        endTitle.style.color = "#4ade80"; 
    } else { 
        if(tocando) audioDerrota.play(); // TOCA DERROTA
        endTitle.innerText = "GAME OVER"; 
        endTitle.style.color = "#f87171"; 
    }
}

function voltarAoMenuPrincipal() {
    pararSons();
    if (tocando) somInicio.play();
    endScreen.classList.add("hidden");
    telaMenu.style.display = "flex";
    mainPanel.classList.remove("hidden");
    des.clearRect(0,0,1600,900); 
}

function atirar(){
    let agora = Date.now();
    if(agora - aviao.ultimoTiro > aviao.cooldown){
        aviao.ultimoTiro = agora;
        if (aviao.tiroDuplo) {
            tiros.push(new Tiro(aviao.x + aviao.w, aviao.y + aviao.h/2 - 25)); 
            tiros.push(new Tiro(aviao.x + aviao.w, aviao.y + aviao.h/2 + 25));
        } else {
            tiros.push(new Tiro(aviao.x + aviao.w, aviao.y + aviao.h/2));
        }
    }
}

document.addEventListener("keydown", e => {
    if(!aviao || !jogar) return;
    if(e.key === "w" || e.key === "W") aviao.dir = -aviao.velAtual;
    if(e.key === "s" || e.key === "S") aviao.dir = aviao.velAtual;
    if(e.key === " ") atirar();
});

document.addEventListener("mousedown", () => { if(!aviao || !jogar) return; atirar(); });
document.addEventListener("keyup", e => {
    if(!aviao || !jogar) return;
    if(e.key === "w" || e.key === "s" || e.key === "W" || e.key === "S") aviao.dir = 0;
});

function spawnEntidades(){
    if(boss) return;
    if(inimigos.length < 8 && Math.random() < 0.06){ 
        let novoY = Math.random() * 750;
        let podeSpawnar = true;
        for(let inimigo of inimigos) {
            if (inimigo.x > 1300 && Math.abs(novoY - inimigo.y) < 120) { podeSpawnar = false; break; }
        }
        if(podeSpawnar) {
            let imagensInimigos = ["./img/aviao_1.png", "./img/aviao_2.png"];
            let imgSorteada = imagensInimigos[Math.floor(Math.random() * imagensInimigos.length)];
            inimigos.push(new AviaoInimigo(1600, novoY, 150, 150, imgSorteada));
        }
    }
    if((itens.length === 0 || itens[itens.length-1].x < 1000) && Math.random() < 0.002){ 
        itens.push(new Item(1600, Math.random() * 830, 70, 70));
    }
}

function aplicarPowerUp(tipo) {
    if(tipo === "velocidade"){
        aviao.velAtual = 14; setTimeout(() => { if(aviao) aviao.velAtual = 8; }, 5000);
    } else if(tipo === "escudo"){
        aviao.escudo = true; setTimeout(() => { if(aviao) aviao.escudo = false; }, 5000);
    } else if(tipo === "tiro"){
        aviao.tiroDuplo = true; setTimeout(() => { if(aviao) aviao.tiroDuplo = false; }, 5000);
    }
}

function colisao(){
    itens.forEach((it, i) => { if(aviao.colid(it)){ aplicarPowerUp(it.tipo); itens.splice(i,1); } });
    for(let i = inimigos.length-1; i>=0; i--){
        let inimigo = inimigos[i];
        for(let t = tiros.length-1; t>=0; t--){
            if(tiros[t].colid(inimigo)){ aviao.pontos += 10; inimigos.splice(i,1); tiros.splice(t,1); break; }
        }
        if(inimigos[i] && aviao.colid(inimigo)){ if(!aviao.escudo) aviao.vida--; inimigos.splice(i,1); }
    }
    if(boss){
        for(let t = tiros.length-1; t>=0; t--){
            if(tiros[t].colid(boss)){
                boss.vida -= 10; tiros.splice(t,1);
                if(boss.vida <= 150 && faseBossAtual === 1) {
                    audioBossInicio.pause(); if(tocando) audioBossFinal.play(); faseBossAtual = 2; 
                }
                if(boss.vida <= 0){ boss.vida = 0; encerrarJogo(true); break; }
            }
        }
    }
}

function atualiza(){
    if(!jogar) return;
    if(aviao.vida <= 0) encerrarJogo(false); 

    if(aviao.vida === 1 && !tocouMayday) {
        if(tocando) audioMayday.play();
        tocouMayday = true;
    }
    if(aviao.vida > 1) tocouMayday = false;

    aviao.mov_aviao();
    spawnEntidades();
    if(boss){ boss.mov(); boss.atirar(); }
    inimigos.forEach(i => i.mov_aviao());
    tiros.forEach(t => t.mov());
    itens.forEach(item => item.mov());
    inimigos = inimigos.filter(i => i.x > -150);
    itens = itens.filter(item => item.x > -70);
    
    for(let i = tirosBoss.length - 1; i >= 0; i--){
        let t = tirosBoss[i]; t.x -= t.vel;
        if(aviao.colid({x: t.x, y: t.y, w: t.w, h: t.h})){
            if(!aviao.escudo) aviao.vida--; tirosBoss.splice(i,1); continue;
        }
        if(t.x < -60) tirosBoss.splice(i,1);
    }
    colisao(); aviao.evoluir();
    if(aviao.pontos >= 350 && !boss && jogar){
        inimigos = []; tirosBoss = []; itens = []; 
        boss = new Boss(1200, 325, 250, 250, "./img/nave_final.png");
        mostrarBossTexto = 150;
        audioFundo.pause(); if(tocando) audioBossInicio.play(); faseBossAtual = 1;
    }
}

function desenha(){
    if(!jogar) return; 
    if(mostrarBossTexto > 0){ t1.des_text("FINAL BOSS", 450, 450, "red", "80px 'Press Start 2P', cursive"); mostrarBossTexto--; }
    aviao.des_img();
    if(aviao.escudo){
        des.beginPath(); des.arc(aviao.x + aviao.w/2, aviao.y + aviao.h/2, aviao.w/2 + 5, 0, Math.PI * 2);
        des.strokeStyle = "cyan"; des.lineWidth = 5; des.stroke();
    }
    inimigos.forEach(i => i.des_img());
    itens.forEach(item => item.des_img());
    tiros.forEach(t => t.des_quad());
    tirosBoss.forEach(t => { des.fillStyle = "red"; des.fillRect(t.x, t.y, t.w, t.h); });

    if(boss){
        boss.des_img();
        des.fillStyle = "darkred"; des.fillRect(1000, 30, 500, 35);
        des.fillStyle = "red"; des.fillRect(1000, 30, boss.vida * 2.5, 35);
        des.fillStyle = "white"; des.font = "16px 'Press Start 2P', cursive";
        des.fillText(boss.vida + " / " + boss.vidaMaxima + " HP", 1120, 55);
    }

    if(aviao.vida === 1 && Math.floor(Date.now() / 500) % 2 === 0) {
        t1.des_text("AVIAO DANIFICADO!", 480, 150, "red", "30px 'Press Start 2P', cursive");
    }

    t1.des_text("Pontos: " + aviao.pontos, 1180, 100, "yellow", "20px 'Press Start 2P', cursive");
    t2.des_text("Vida: " + aviao.vida, 50, 50, "red", "20px 'Press Start 2P', cursive");
}

function main(){
    if(!jogar) return; 
    des.clearRect(0,0,1600,900); desenha(); atualiza();
    loopAnimacao = requestAnimationFrame(main);
}