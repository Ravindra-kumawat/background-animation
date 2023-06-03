const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const numParticles = Math.floor(innerWidth * innerHeight * 7e-4);
const pixelSizeX = 6;
const pixelSizeY = 6;
const gridX = 10;
const gridY = 10;

class Particle {
    
    constructor() {
        this.pixelSizeX = rand(4,8);
        this.pixelSizeY = rand(4, 8);
        this.setRandomPosition();
        this.setRandomColor();
        this.setRandomDirection();
        
    }
    
    setRandomDirection() {
        const d = rand(0,1) ? -1 : 1;
        if (rand(0, 1) === 0) {
            this.xr = 0;
            this.yr = d;
        } else {
            this.xr = d;
            this.yr = 0;
        }
    }
    
    setRandomColor() {
        this.color =
            "#" +
            rand(0, 15).toString(16) +
            rand(0, 15).toString(16) +
            rand(0, 15).toString(16);
    }

    get maxX() {
        return Math.floor(innerWidth / this.pixelSizeX);
    }
    
    get maxY() {
        return Math.floor(innerHeight / this.pixelSizeY);
    }
    
    
    setRandomPosition() {
        this.x = rand(0, this.maxX);
        this.y = rand(0, this.maxY);
    }
    
    distanceTo(p) {
        const x0 = this.x * this.pixelSizeX;
        const y0 = this.y * this.pixelSizeY;
        const x1 = p.x * p.pixelSizeX;
        const y1 = p.y * p.pixelSizeY;
        const dx = Math.abs(x0 - x1);
        const dy = Math.abs(y0 - y1);
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
    

    draw() {
        const { pixelSizeX, pixelSizeY } = this;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * pixelSizeX, this.y * pixelSizeY, pixelSizeX, pixelSizeY);
    }
    
    move() {
        this.x += this.xr;
        this.y += this.yr;
        if (this.xr === 1 && this.x >= this.maxX) {
            this.x = this.maxX;
            this.xr *= -1;
        }
        if (this.xr === -1 && this.x < 0) {
            this.x = 0;
            this.xr *= -1;
        }
        if (this.yr === 1 && this.y >= this.maxY) {
            this.y = this.maxY;
            this.yr *= -1;
        }
        if (this.yr === -1 && this.y < 0) {
            this.y = 0;
            this.yr *= -1;
        }
        if (this.x % gridX === 0 || this.y % gridY === 0) {
            this.setRandomDirection();
        }
    }
}

function setSize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

setSize();
window.addEventListener('resize', setSize);

const particles = Array(numParticles)
    .fill(0)
    .map((_) => new Particle());

function loop(time = 0) {
    ctx.fillStyle = 'rgba(0,0,0,.1)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    particles.map((p, idx) => {
        p.draw();
        p.move();
        for (let i = idx + 1; i < particles.length; i ++) {
            const p1 = particles[i];
            const d = p1.distanceTo(p)
            if (d > 0 && d < 50) {
                ctx.beginPath();
                const x0 = p.x * p.pixelSizeX + p.pixelSizeX * .5;
                const y0 = p.y * p.pixelSizeY + p.pixelSizeY * .5;
                const x1 = p1.x * p1.pixelSizeX + p1.pixelSizeX * .5;
                const y1 = p1.y * p1.pixelSizeY + p1.pixelSizeY * .5;
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                const grad = ctx.createLinearGradient(x0,y0,x1,y1);
                grad.addColorStop("0.0", p.color);
                grad.addColorStop("1.0", p1.color);
                ctx.strokeStyle= grad;
                ctx.stroke();
            }
        
        }
    });
    
    ctx.globalCompositeOperation = 'source-over';
    window.setTimeout(() => requestAnimationFrame(loop), 0);
}

loop();