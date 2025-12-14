let hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', e => {
    let handle;
    let header = document.querySelector('header');
    let nav = header.querySelector('nav');
    let links = nav.querySelector('ul')
    if(e.target.matches('.hamburger')){
        handle = e.target;
    }
    else if(e.target.closest('.hamburger')){
        handle = e.target.closest('.hamburger');
    }

    handle.classList.toggle('toggle');
    nav.classList.toggle('open');
    nav.style.height = nav.offsetHeight === 0 ? links.offsetHeight + 'px': '0px';
    addEventListener('resize', a => {
        if(document.offsetWidth > '768px'){
            hamburger.classList.remove('toggle');
            nav.classList.remove('open');
            nav.style.height = "0px";
        }
    })
})

var myGamePiece;
var myObstacles = [];
var myScore;
let canvasWidth = 640;
let canvasHeight = 360;
if(window.innerWidth < 768){
    canvasHeight = 300;
    canvasWidth = 300;
}
function startGame() {
    myGamePiece = new component(30, 30, "images/cat-9219298_1280.png", 10, 120, "image");
    myGamePiece.gravity = 0.05;
    myScore = new component("32px", "white", "white", 20, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.querySelector('canvas'),
    start : function() {
        this.canvas.height = canvasHeight;
        this.canvas.width = canvasWidth;
        this.context = this.canvas.getContext("2d");
        var myGame = document.getElementById("game");
        myGame.insertBefore(this.canvas, myGame.childNodes[0]);        
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if(type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if(this.type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(20, height, "#783F8E", x, 0));
        myObstacles.push(new component(20, x - height - gap, "#783F8E", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}