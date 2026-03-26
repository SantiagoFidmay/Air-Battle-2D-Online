class Obj {
    constructor(x, y, w, h, img) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.img = new Image()
        this.img.src = img
    }

    des_img() {
        des.save()
        des.translate(this.x + this.w/2, this.y + this.h/2)
        if(this instanceof AviaoInimigo || this instanceof Boss){
            des.rotate(Math.PI)
        }
        des.rotate(Math.PI / 2)
        des.drawImage(this.img, -this.w/2, -this.h/2, this.w, this.h)
        des.restore()
    }

    colid(o){
        let margemThis = (this instanceof Aviao || this instanceof AviaoInimigo) ? 40 : 5;
        let margemO = (o instanceof Aviao || o instanceof AviaoInimigo) ? 40 : 5;
        if (this instanceof Boss) margemThis = 60;
        if (o instanceof Boss) margemO = 60;

        return (
            this.x + margemThis < o.x + o.w - margemO &&
            this.x + this.w - margemThis > o.x + margemO &&
            this.y + margemThis < o.y + o.h - margemO &&
            this.y + this.h - margemThis > o.y + margemO
        )
    }
}

class Aviao extends Obj{
    constructor(x,y,w,h,img){
        super(x,y,w,h,img)
        this.dir = 0
        this.vida = 5
        this.pontos = 0
        this.fase = 1
        this.ultimoTiro = 0
        this.cooldown = 250
        this.velAtual = 8
        this.tiroDuplo = false
        this.escudo = false
    }

    mov_aviao(){
        this.y += this.dir
        if(this.y < 0) this.y = 0
        if(this.y > 750) this.y = 750 
    }

    evoluir(){
        let novaFase = Math.floor(this.pontos / 50) + 1
        if(novaFase !== this.fase){
            this.fase = novaFase
            if(this.fase === 1) this.img.src = "./img/aviao_6.png"
            if(this.fase === 2) this.img.src = "./img/aviao_guerra_simples.png"
            if(this.fase === 3) this.img.src = "./img/aviao_guerra.png"
            if(this.fase === 4) this.img.src = "./img/sr-71.png"
            if(this.fase >= 5) this.img.src = "./img/b2_spirit.png"
        }
    }
}

class AviaoInimigo extends Obj{
    constructor(x,y,w,h,img){
        super(x,y,w,h,img)
        this.vel = 3
    }
    mov_aviao(){ this.x -= this.vel }
}

class Boss extends Obj{
    constructor(x,y,w,h,img, vidaTotal = 400){
        super(x,y,w,h,img)
        this.vidaMaxima = vidaTotal 
        this.vida = vidaTotal
        this.dir = 2
        this.ultimoTiro = 0
    }
    mov(){
        this.y += this.dir
        if(this.y <= 0 || this.y >= 650) this.dir *= -1
    }
    atirar(){
        let agora = Date.now()
        if(agora - this.ultimoTiro > 400){
            this.ultimoTiro = agora
            tirosBoss.push({ x: this.x, y: this.y + this.h/2, w: 10, h: 5, vel: 6 })
            
            if (window.tocando && window.somTiroAlien) {
                window.somTiroAlien.cloneNode().play();
            }
        }
    }
}

class Tiro{
    constructor(x,y, owner = null){
        this.x = x; this.y = y; this.w = 15; this.h = 5;
        this.owner = owner;
    }
    mov(){ this.x += 10 }
    des_quad(){
        des.fillStyle = "yellow"; des.fillRect(this.x, this.y, this.w, this.h);
    }
    colid(o){
        return (this.x < o.x + o.w && this.x + this.w > o.x && this.y < o.y + o.h && this.y + this.h > o.y)
    }
}

class Item extends Obj{
    constructor(x,y,w,h){
        super(x,y,w,h,"")
        this.tipo = this.sortearTipo()
        this.atualizarVisual()
        this.vel = 3
    }
    sortearTipo(){
        let tipos = ["tiro", "velocidade", "escudo"]
        return tipos[Math.floor(Math.random() * tipos.length)]
    }
    atualizarVisual(){
        if(this.tipo === "tiro") this.img.src = "./img/item_tiro.png" 
        if(this.tipo === "velocidade") this.img.src = "./img/item_velocidade.png"
        if(this.tipo === "escudo") this.img.src = "./img/item_escudo.png"
    }
    mov(){ this.x -= this.vel }
    des_img() { des.drawImage(this.img, this.x, this.y, this.w, this.h) }
}

class Text{
    des_text(t,x,y,c,f){
        des.fillStyle = c; des.font = f; des.fillText(t,x,y);
    }
}