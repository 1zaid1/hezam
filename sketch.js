let balls = [], img, globalOn, dx, dy, pmouse, bal;
function Ball(x, y, r) {
	this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.ac = createVector(0, 0);
	this.on = true;
	this.r = r;

	this.draw = function () {
		circle(this.pos.x, this.pos.y, 2*this.r);
	}

    this.seek = function(tar, mx) {
        let desired = p5.Vector.sub(tar, this.pos);
        if (desired.mag() <= 100) desired.setMag(map(desired.mag(), 0, 100, 0, mx));
        else desired.setMag(mx);
        let seeking = p5.Vector.sub(desired, this.vel);
        this.ac.add(seeking);
    }

	this.update = function() {
        this.pos.add(this.vel);
        this.vel.add(this.ac);
        this.ac = createVector(0, 0);
		if (this.on) this.r += 1;
		if (this.x - this.r <= 0 ||
			this.y - this.r <= 0 ||
			this.x + this.r > width ||
			this.y + this.r) this.on = false;
        if (this.on) {
          for (let ball of balls) {
            if (ball == this) continue;
            if (Dist(this.pos, ball.pos) <= this.r + ball.r) {
              this.on = 0;
              break;
            }
          }
        } else if (!globalOn) {
          let mouse = createVector(mouseX, mouseY);
          let ptocur = Dist(mouse, pmouse);
          if (Dist(this.pos, mouse) < min(ptocur**2, 100)) this.seek(mouse, -20);
          else this.seek(createVector(x, y), 5);
        }
	}
}

function Dist(a, b) {
    return dist(a.x, a.y, b.x, b.y);
}

function makeEm() {
	let cnt = 0;
	let ar = [];
	for (let i = 0; i < img.width; i++) {
		for (let j = 0; j < img.height; j++) {
		    if (brightness(img.get(i, j)) >= 55 && img.get(i, j)[3] > 0)
		    	ar.push({x: i, y: j});
		}
	}

	for (let i = 0; i < 3000; i++) {
      let ind = floor(ar.length*random());
      balls.push(new Ball(ar[ind].x, ar[ind].y, 0));
    }
}

function bake2() {
	for (let ball of balls) ball.update();
    
    globalOn = false;
    for (let ball of balls) if (ball.on) globalOn = true;
    pmouse = createVector(mouseX, mouseY);
    if (globalOn) bake2();
}

function preload() {
	img = loadImage('hezam.png');
	bal = loadImage('balloons Small.png');
}

let bals = [], by;
function setup() {
	let cnv = createCanvas(500, 500);
    img.resize(width, height);
    makeEm();
    bake2();
  
    by = height;
    for (let i = 0; i < 15; i++) {
      bals.push(random(width+50)-50);
    }
  
    rectMode(CENTER);
}

function draw() {
	background(255);
    noStroke();

    fill('rgb(69,150,177)')
	for (let ball of balls) {
		ball.update();
		ball.draw();
	}
    
  if(by > -1000) {
    for (let ball of bals) {
      image(bal, ball+20*sin(frameCount/5+ball), by);
    }}
    
    by-=10;
  
    pmouse = createVector(mouseX, mouseY);
}
