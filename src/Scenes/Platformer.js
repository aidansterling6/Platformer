class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.SCALE = 2.0;
        this.width = config.width;
        this.height = config.height;

        this.X = 44;
        this.Y = 0;

        this.dist = function(x1, y1, x2, y2){
            return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
        }
        this.mouseIsPressed = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            this.mouseIsPressed = true;
        });
        this.mouseUp = this.input.on('pointerup', (pointer) => {
            this.mouseIsPressed = false;
        });

        this.mouseMoved = this.input.on('pointermove', (pointer) => {
            this.mouseX = pointer.x;
            this.mouseY = pointer.y;
        });


        this.dragi = -1;
        //the acceleration of this.gravity
        this.gravity = 0.1;
        //a value that determines how fast you drag blocks
        this.mspeed = 5;
        //the max speed that you can drag blocks at
        this.maxSpeed = 3;
        //x and y of the respawn location for the player
        this.respawnX = 70;
        this.respawnY = 220;
        //messages
        this.popUp = [];
        //Pop up rect height
        this.popH = 13;
        //amount of time before you cane skip a pop up window
        this.popSkipt = 20;
        //pop up translateion y
        this.popy = 0;
        //amount of time a popup window atays for
        this.popTime = 500;
        //timer that restricts how often you can toggle the help menu in a given time
        this.btime = 0;
        //if the player is this.dead
        this.dead = false;
        //an array holding all of the no magic zones
        this.noMagic = [{x:646,y:200,w:109,h:40}];
        //an array holding all of the checkpoints
        this.checkPoint = [204,1100,1650,2080,2223];
        //if the help menu if open or not
        this.HELP = false;
        //all this.texts in the help menu
        this.texts = ["Use the WASD or arrow keys to move. you can also use space to jump","Press R to reset to the nearest checkpoint.","Use H to toggle this help screen"];
        //an aray holding all helppoints
        this.helpPoint = [];
        //an array holding all of the blocks
        this.rects = [];
        //the level the player is on
        this.CurrentLevel = 1;
        //an array holding all this.lazers
        this.lazer = [];
        //an array holding all this.mirrors
        this.mirror = [];
        //sets the level to it's argument
        this.level = function(num){
            if(num === 1){
            this.dragi = -1;
            this.gravity = 0.1;
            this.mspeed = 5;
            this.maxSpeed = 3;
            this.respawnX = 100;
            this.respawnY = 231;
            this.dead = false;
            this.helpPoint = [{x:122,t:"Jump over the spikes"},{x:275,t:"Move the blue box onto the button to open the gate, you can push it."},{x:444,t:"Click and drag the box to use magic."},{x:594,t:"this.You can not use magic in the red area, you have to push this block."},{x:864,t:"Hover over a gate with your mouse to see its connections."},{x:1066,t:"The red line is a check point, if you go through it your character will spawn at it when you die"},{x:1080,t:"Do not take objects through checkpoints because you will die"},{x:1673,t:"The grey boxes with lines are pipes"},{x:1683,t:"Pipes connect when the lines are lined up"},{x:1693,t:"Pipes can only connect to other pipes if they have the blue bouncy water at one end"},{x:1703,t:"this.You can only move the lightly colored pipes"}];
            this.noMagic = [{x:646,y:200,w:109,h:40}];
            this.checkPoint = [204,1100,1650,2080,2223];
            this.rects = [{x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},{x:600,y:250,w:1124,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:159,y:250,w:50,h:20,ax:0,ay:0,HitDown:false,type:"spike",n1:-1,n2:10,mi:false},{x:600,y:113,w:1124,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:400,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:360,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:380,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:335,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:6,n2:0,mi:false},{x:308,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"box",n1:6,n2:0,mi:false},{x:500,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:460,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:480,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:534,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:11,n2:0,mi:false},{x:565,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"box",n1:0,n2:0,mi:false},{x:700,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:660,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:680,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:734,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:16,n2:0,mi:false},{x:670,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"box",n1:0,n2:0,mi:false},{x:1000,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:960,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
                    {x:980,y:145,w:20,h:70,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:851,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:21,n2:0,mi:false},{x:811,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,
                        type:"button",n1:21,n2:0,mi:false},{x:771,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:21,n2:0,mi:false},{x:1410,y:250,w:500,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1310,y:140,w:98,h:100,ax:0,ay:0,HitDown:false,type:"gateu",n1:-1,n2:0,mi:false},{x:1251,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1369,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1310,y:80,w:138,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1215,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:26,n2:0,mi:false},{x:1397,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:36,n2:0,mi:false},{x:1139,y:180,w:50,h:50,ax:0,ay:0,HitDown:false,type:"box",n1:-1,n2:0,mi:false},{x:1566,y:80,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1546,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1586,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1566,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:1800,y:210,w:100,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1700,y:250,w:100,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1739,y:235,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},{x:1739,y:215,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeudm",n1:-1,n2:0,mi:false},{x:1880,y:130,w:100,h:160,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1819,y:155,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},{x:1935,y:90,w:20,h:20,ax:0,ay:0,HitDown:false,type:"piperrb",n1:-1,n2:0,mi:false},{x:2100,y:250,w:500,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
                    {x:2109,y:111,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:1950,y:245,w:200,h:20,ax:0,ay:0,HitDown:false,type:"spike",n1:-1,n2:30,mi:false},
                    {x:2151,y:235,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},{x:2151,y:215,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipedlm",n1:-1,n2:0,mi:false},{x:2172,y:195,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false}];
                    
                    
                    
            }
            if(num === 2){
            this.dragi = -1;
            this.gravity = 0.1;
            this.mspeed = 5;
            this.maxSpeed = 3;
            this.respawnX = 49;
            this.respawnY = 200;
            this.dead = false;
            this.helpPoint = [];
            this.noMagic = [{x:220,y:240,w:99,h:40},{x:664,y:84,w:100,h:120}];
            this.checkPoint = [600,819];
            this.rects = [{x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},{x:100,y:250,w:230,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:212,y:270,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:329,y:270,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:270,y:290,w:100,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:388,y:250,w:100,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:428,y:187,w:20,h:122,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:468,y:130,w:100,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:295,y:60,w:500,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:335,y:142,w:20,h:146,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:315,y:130,w:20,h:130,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:355,y:130,w:20,h:130,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:305,y:280,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:9,n2:0,mi:false},{x:236,y:280,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:9,n2:0,mi:false},{x:145,y:177,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeudm",n1:5,n2:-1,mi:false},{x:145,y:157,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeudm",n1:-1,n2:0,mi:false},{x:407,y:233,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},{x:593,y:130,w:176,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:683,y:172,w:20,h:104,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:733,y:214,w:80,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:774,y:134,w:20,h:180,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
                    {x:695,y:130,w:20,h:20,ax:0,ay:0,HitDown:false,type:"piperrb",n1:5,n2:-1,mi:false},{x:624,y:88,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipelum",n1:5,n2:-1,mi:false},{x:827,y:54,w:100,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false}];
                    
                    
            }
            if(num === 3){
            this.dragi = -1;
            this.gravity = 0.1;
            this.mspeed = 5;
            this.maxSpeed = 3;
            this.respawnX = 93;
            this.respawnY = 200;
            this.dead = false;
            this.helpPoint = [{x:100,t:"The white lines ether reflect or block lasers"},{x:110,t:"The thin red lines are this.lazers, you can move the grey laser shoting box"},{x:120,t:"Get a laser to the greyish blue boxes to open a gate just like a button"}];
            this.noMagic = [];
            this.checkPoint = [261,474,800];
            this.mirror = [{x:269,y:266,l:1000,a:89.9999,c:1,r:false,tx:-219,ty:0,b:false},{x:335,y:118,l:100,a:89.9999,c:1,r:false,tx:-37,ty:-118,b:false}];
            this.lazer = [];
            //this.rects = [{x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},{x:100,y:250,w:230,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:99,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.lazer",n1:180,n2:0,mi:false},{x:18,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.mirror",n1:45,n2:0,mi:false},{x:18,y:63,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:5,n2:0,mi:false},{x:154,y:137,w:20,h:20,ax:0,ay:0,HitDown:false,type:"gated",n1:0,n2:0,mi:false},{x:154,y:113,w:20,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:0,n2:0,mi:false}];
            this.rects = [{x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},{x:479,y:250,w:800,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:206,y:128,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:186,y:160,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:226,y:160,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:127,y:-162,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.lazer",n1:0,n2:0,mi:false},{x:152,y:187,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.mirror",n1:135,n2:0,mi:false},{x:127,y:187,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:8,n2:0,mi:false},{x:206,y:187,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:301,y:290,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:281,y:270,w:20,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:321,y:270,w:20,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:301,y:270,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.lazer",n1:-90,n2:0,mi:false},{x:279,y:187,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.mirror",n1:135,n2:0,mi:false},{x:279,y:118,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.mirror",n1:135,n2:0,mi:false},{x:279,y:45,w:20,h:20,ax:0,ay:0,HitDown:false,type:"this.mirror",n1:135,n2:0,mi:false},{x:386,y:116,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:20,n2:0,mi:false},{x:456,y:108,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:436,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:476,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
                    {x:456,y:187,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:656,y:108,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:636,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:676,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:656,y:187,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},{x:586,y:210,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:24,n2:0,mi:false}];
                    
            }
        };


        this.hex = function(value){
            let a = value.toString(16);
            if(a.length === 1){
                a = "0" + a;
            }
            return a;
        }
        this.color = function(r, g, b){
            return "0x" + this.hex(r) + this.hex(g) + this.hex(b);
        }
        this.Fill = this.color(255, 255, 255);
        this.Stroke = this.color(255, 0, 0);
        this.StrokeWeight = 1;
    }

    create() {

        this.level(this.CurrentLevel);

        console.log(this.fill);
        this.graphics = this.add.graphics();

        this.fill = function(r, g, b){
            this.Fill = this.color(r, g, b);
        }
        this.stroke = function(r, g, b){
            this.Stroke = this.color(r, g, b);
        }
        this.noStroke = function(){
            //this.StrokeWeight = 0;
        }
        this.strokeWeight = function(num){
            this.StrokeWeight = num;
        }

        this.background = function(r, g, b){
            let tmpColor = this.color(r, g, b);
            const tmpRect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
            this.graphics.lineStyle(1, tmpColor);
            this.graphics.fillStyle(tmpColor);
            this.graphics.strokeRectShape(tmpRect);
            this.graphics.fillRectShape(tmpRect);
        }

        this.triangle = function(x1, y1, x2, y2, x3, y3){
            const tmpTri = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);
            this.graphics.lineStyle(this.StrokeWeight, this.Stroke);
            this.graphics.fillStyle(this.Fill);
            this.graphics.strokeTriangleShape(tmpTri);
            this.graphics.fillTriangleShape(tmpTri);
        }


        this.line = function(x1, y1, x2, y2){
            const tmpLine = new Phaser.Geom.Line(x1, y1, x2, y2);
            this.graphics.lineStyle(this.StrokeWeight, this.Stroke);
            this.graphics.strokeLineShape(tmpLine);
        }
        this.rect = function(x, y, w, h){
            console.log("rect");
            const tmpRect = new Phaser.Geom.Rectangle(x, y, w, h);
            this.graphics.lineStyle(this.StrokeWeight, this.Stroke);
            this.graphics.fillStyle(this.Fill);
            this.graphics.strokeRectShape(tmpRect);
            this.graphics.fillRectShape(tmpRect);
        }
        this.blocks = function(){
            for(var i = 0; i < this.rects.length;i++){
              //restrict width and hight of blocks
              if(this.rects[i].h <= 0){
                this.rects[i].h = 2;
              }
              if(this.rects[i].w <= 0){
                this.rects[i].w = 2;
              }
              this.noStroke();
              //logic and drawing of the player
              if(this.rects[i].type === "player"){
                //implement this.gravity
                this.rects[i].ay += this.gravity;
                //move camera to block
                this.X = this.rects[i].x - (this.width/2);
                this.Y = this.rects[i].y - (this.height/2);
                //if you fall, die
                if(this.rects[i].y > 400){
                  this.dead = true;
                }
                //movement
                // if(keyIsPressed && (keys[68] === true || keys[39] === true)){
                //   this.rects[i].ax = 2;
                // }
                // if(keyIsPressed && (keys[65] === true || keys[37] === true)){
                //   this.rects[i].ax = -2;
                // }
                // if(keyIsPressed && (keys[87] || keys[32] || keys[38] === true) && this.rects[i].HitDown === true){
                //   this.rects[i].ay =  -3;
                // }
                //this.rects[i].ax *= 0.8;
                this.rects[i].HitDown = false;
                //collision logic
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                    this.rects[i].HitDown = true;
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                  }
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                }
                //change x and y from acceleration
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                //friction
                if(this.rects[i].HitDown){
                  this.rects[i].ax *= 0.0;
                }
                else{
                  this.rects[i].ax *= 0.95;
                }
                //draw player
                this.fill(255, 0, 0);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              //logic and drawing of the buttons
              if(this.rects[i].type === "button"){
                var out = true;
                this.rects[i].HitDown = false;
                //ditect a hit
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y - (this.rects[i].h/2) === this.rects[o].y + (this.rects[o].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].HitDown = true;
                  }
                }
                if(this.rects[i].HitDown === false){
                  out = false;
                }
                //check that all other buttons are pressed
                for(var o = 0; o < this.rects.length;o++){
                  if(this.rects[i].type === "button" && this.rects[i].n1 === this.rects[o].n1 && this.rects[o].HitDown === false){
                    out = false;
                  }
                }
                //move gates
                if(out === true){
                  if(this.rects[this.rects[i].n1].type === "gated"){
                    this.rects[this.rects[i].n1].ay = -1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gateu"){
                    this.rects[this.rects[i].n1].ay = 1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gater"){
                    this.rects[this.rects[i].n1].ax = -1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gatel"){
                    this.rects[this.rects[i].n1].ax = 1;
                  }
                }
                if(out === false){
                  if(this.rects[this.rects[i].n1].type === "gated"){
                    this.rects[this.rects[i].n1].ay = 1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gateu"){
                    this.rects[this.rects[i].n1].ay = -1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gater"){
                    this.rects[this.rects[i].n1].ax = 1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gatel"){
                    this.rects[this.rects[i].n1].ax = -1;
                  }
                }
                //draw and change shape when pressed
                if(this.rects[i].HitDown === true){
                  this.fill(255, 0, 255);
                  this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                }
                else{
                  this.fill(255, 0, 255);
                  this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - (this.rects[i].h + 10)/2 - this.Y,this.rects[i].w,this.rects[i].h + 10);
                }
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.noStroke();
              //logic and drawing of the spikes
              if(this.rects[i].type === "spike"){
                var out = true;
                this.rects[i].HitDown = false;
                //detect a hit
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[o].type === "player" && this.rects[i].y - (this.rects[i].h/2) - 5 <= this.rects[o].y + (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) >= this.rects[o].y + (this.rects[o].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].HitDown = true;
                  }
                }
                if(this.rects[i].HitDown === false){
                  out = false;
                }
                //check if other spikes are being pressed, usless test without
                for(var o = 0; o < this.rects.length;o++){
                  if(this.rects[i].type === "spike" && this.rects[i].n1 === this.rects[o].n1 && this.rects[o].HitDown === false){
                    out = false;
                  }
                }
                //kill on hit
                if(this.rects[i].HitDown){
                  this.dead = true;
                }
                this.fill(71, 71, 71);
                //draw
                for(var s = 0; s < this.rects[i].w - this.rects[i].w/this.rects[i].n2;s += this.rects[i].w/this.rects[i].n2){
                  this.triangle(this.rects[i].x - this.rects[i].w/2 - this.X + s + (this.rects[i].w/this.rects[i].n2/2),this.rects[i].y - this.rects[i].h/2 - this.Y - 5,this.rects[i].x - this.rects[i].w/2 - this.X + s,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].x - this.rects[i].w/2 - this.X + s + (this.rects[i].w/this.rects[i].n2),this.rects[i].y - this.rects[i].h/2 - this.Y);
                }
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.stroke(0, 0, 0);
              //logic and drawing of the pipes
              if(this.rects[i].type.substring(0,4) === "pipe"){
                //get info from rect's type
                var link1 = this.rects[i].type.substring(4,5);
                var link2 = this.rects[i].type.substring(5,6);
                var link3 = (this.rects[i].type.substring(6,7) === "b");
                var islinked = false;
                //sets is linked
                for(var o = 0; o < this.rects.length;o++){
                  if(o !== i){
                    if(this.rects[i].type.substring(0,4) === "pipe" && this.rects[o].n1 === i){
                      islinked = true;
                    }
                  }
                }
                //if(this.dragi === -1){
                this.rects[i].n2 = 0;
                //sets values that determine which sides are linked
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.dragi !== i && this.rects[o].type.substring(6,7) === "b" && (this.rects[i].n1 === o || this.rects[i].n1 === -1)){
                    if((this.rects[o].type.substring(4,5) === "u" || this.rects[o].type.substring(5,6) === "u") && (link1 === "d" || link2 === "d") && this.dist(this.rects[i].x,this.rects[i].y + (this.rects[i].h/2),this.rects[o].x,this.rects[o].y - (this.rects[i].h/2)) < 4){
                      if(link1 === "d"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 1;
                        }
                        if(this.rects[i].n2 === 2){
                          this.rects[i].n2 = 3;
                        }
                      }
                      else if(link2 === "d"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 2;
                        }
                        if(this.rects[i].n2 === 1){
                          this.rects[i].n2 = 3;
                        }
                      }
                      
                      //dellipse(0,0,10,10);
                    }
                    if((this.rects[o].type.substring(4,5) === "d" || this.rects[o].type.substring(5,6) === "d") && (link1 === "u" || link2 === "u") && this.dist(this.rects[i].x,this.rects[i].y - (this.rects[i].h/2),this.rects[o].x,this.rects[o].y + (this.rects[i].h/2)) < 4){
                      if(link1 === "u"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 1;
                        }
                        if(this.rects[i].n2 === 2){
                          this.rects[i].n2 = 3;
                        }
                      }
                      else if(link2 === "u"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 2;
                        }
                        if(this.rects[i].n2 === 1){
                          this.rects[i].n2 = 3;
                        }
                      }
                      
                      //ellipse(0,0,10,10);
                    }
                    if((this.rects[o].type.substring(4,5) === "l" || this.rects[o].type.substring(5,6) === "l") && (link1 === "r" || link2 === "r") && this.dist(this.rects[i].x + (this.rects[i].w/2),this.rects[i].y,this.rects[o].x - (this.rects[o].w/2),this.rects[o].y) < 4){
                      if(link1 === "r"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 1;
                        }
                        if(this.rects[i].n2 === 2){
                          this.rects[i].n2 = 3;
                        }
                      }
                      else if(link2 === "r"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 2;
                        }
                        if(this.rects[i].n2 === 1){
                          this.rects[i].n2 = 3;
                        }
                      }
                      
                      //dellipse(0,0,10,10);
                    }
                    if((this.rects[o].type.substring(4,5) === "r" || this.rects[o].type.substring(5,6) === "r") && (link1 === "l" || link2 === "l") && this.dist(this.rects[i].x - (this.rects[i].w/2),this.rects[i].y,this.rects[o].x + (this.rects[o].w/2),this.rects[o].y) < 4){
                      if(link1 === "l"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 1;
                        }
                        if(this.rects[i].n2 === 2){
                          this.rects[i].n2 = 3;
                        }
                      }
                      else if(link2 === "l"){
                        if(this.rects[i].n2 === 0){
                          this.rects[i].n2 = 2;
                        }
                        if(this.rects[i].n2 === 1){
                          this.rects[i].n2 = 3;
                        }
                      }
                      
                      //ellipse(0,0,10,10);
                    }
                  }
                }
                if(link1 === link2){
                  this.rects[i].n2 = 1;
                }
                //attaches pipes that should be
                for(var o = 0; o < this.rects.length;o++){
                  if(this.rects[o].type.substring(0,4) !== "pipe"){
                    if(i !== o && ((link1 === "u" && this.rects[i].n2 === 2) || (link2 === "u" && this.rects[i].n2 === 1)) && this.rects[i].y - (this.rects[i].h/2) - 10 <= this.rects[o].y + (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) >= this.rects[o].y + (this.rects[o].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                      //if(link1 !== link2){
                      this.rects[o].ay = -4;
                      //}
                    }
                    if(i !== o && ((link1 === "d" && this.rects[i].n2 === 2) || (link2 === "d" && this.rects[i].n2 === 1)) && this.rects[i].y + (this.rects[i].h/2) + 10 >= this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y + (this.rects[i].h/2) <= this.rects[o].y - (this.rects[o].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                      //if(link1 !== link2){
                      this.rects[o].ay = 4;
                      //}
                    }
                    if(i !== o && ((link1 === "l" && this.rects[i].n2 === 2) || (link2 === "l" && this.rects[i].n2 === 1)) && this.rects[i].x - (this.rects[i].w/2) - 10 <= this.rects[o].x + (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) >= this.rects[o].x + (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                      //if(link1 !== link2){
                      this.rects[o].ax = -10;
                      //}
                    }
                    if(i !== o && ((link1 === "r" && this.rects[i].n2 === 2) || (link2 === "r" && this.rects[i].n2 === 1)) && this.rects[i].x + (this.rects[i].w/2) + 10 >= this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x + (this.rects[i].w/2) <= this.rects[o].x - (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                      //if(link1 !== link2){
                      this.rects[o].ax = 10;
                      //}
                    }
                  }
                }
                //implement this.gravity
                if(link1 !== link2){
                  this.rects[i].ay += this.gravity;
                  
                  //}
                  //kill if it falls
                  if(this.rects[i].y > 400){
                    this.dead = true;
                  }
                  //stop this.draging if key is pressed
                //   if(keyIsPressed){
                //     this.dragi = -1;
                //   }
                  //move when draged
                  if(this.dragi === i){
                    if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0 && this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed < this.maxSpeed){
                      this.rects[i].ax = -(this.rects[i].x - this.X - mousethis.X)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                      this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                    }
                    else if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0){
                      this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                      this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                    }
                  }
                  //if clicked on set deagi to its position in this.rects
                  if(this.mouseIsPressed && this.rects[i].HitDown && this.dragi === -1 && this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                    this.dragi = i;
                  }  
                  //if not pressing the mouse, stop this.draging
                  if(this.mouseIsPressed === false){
                    this.dragi = -1;
                  }
                  //this.rects[i].ax *= 0.8;
                  this.rects[i].HitDown = false;
                  //dont allow link when draged
                  if(this.dragi === i){
                    this.rects[i].type = this.rects[i].type.substring(0,6) + "u";
                    this.rects[i].n1 = -1;
                  }
                  //dont link if the other pipe is not linked to a base pipe in any way
                  if(this.rects[i].n1 !== -1 && this.rects[this.rects[i].n1].type.substring(6,7) !== "b"){
                    this.rects[i].type = this.rects[i].type.substring(0,6) + "u";
                  }
                  //move when linked
                  for(var o = 0; o < this.rects.length;o++){
                    if(i !== o && this.dragi !== i && this.rects[o].type.substring(6,7) === "b" && (this.rects[i].n1 === o || this.rects[i].n1 === -1)){
                      if((this.rects[o].type.substring(4,5) === "u" || this.rects[o].type.substring(5,6) === "u") && (link1 === "d" || link2 === "d") && this.dist(this.rects[i].x,this.rects[i].y + (this.rects[i].h/2),this.rects[o].x,this.rects[o].y - (this.rects[i].h/2)) < 4){
                        
                        this.rects[i].n1 = o;
                        this.rects[i].ay = (this.rects[o].y - this.rects[i].y)/10;
                        this.rects[i].ax = (this.rects[o].x - this.rects[i].x)/10;
                        this.rects[i].HitDown = true;
                        this.rects[o].HitDown = true;
                        this.rects[i].type = this.rects[i].type.substring(0,6) + "b";
                        //dellipse(0,0,10,10);
                      }
                      if((this.rects[o].type.substring(4,5) === "d" || this.rects[o].type.substring(5,6) === "d") && (link1 === "u" || link2 === "u") && this.dist(this.rects[i].x,this.rects[i].y - (this.rects[i].h/2),this.rects[o].x,this.rects[o].y + (this.rects[i].h/2)) < 4){
                        
                        this.rects[i].n1 = o;
                        this.rects[i].ay = (this.rects[o].y - this.rects[i].y)/10;
                        this.rects[i].ax = (this.rects[o].x - this.rects[i].x)/10;
                        this.rects[i].HitDown = true;
                        this.rects[o].HitDown = true;
                        this.rects[i].type = this.rects[i].type.substring(0,6) + "b";
                        //ellipse(0,0,10,10);
                      }
                      if((this.rects[o].type.substring(4,5) === "l" || this.rects[o].type.substring(5,6) === "l") && (link1 === "r" || link2 === "r") && this.dist(this.rects[i].x + (this.rects[i].w/2),this.rects[i].y,this.rects[o].x - (this.rects[o].w/2),this.rects[o].y) < 4){
                        
                        
                        this.rects[i].n1 = o;
                        this.rects[i].ay = (this.rects[o].y - this.rects[i].y)/10;
                        this.rects[i].ax = (this.rects[o].x - this.rects[i].x)/10;
                        this.rects[i].HitDown = true;
                        this.rects[o].HitDown = true;
                        this.rects[i].type = this.rects[i].type.substring(0,6) + "b";
                        //dellipse(0,0,10,10);
                      }
                      if((this.rects[o].type.substring(4,5) === "r" || this.rects[o].type.substring(5,6) === "r") && (link1 === "l" || link2 === "l") && this.dist(this.rects[i].x - (this.rects[i].w/2),this.rects[i].y,this.rects[o].x + (this.rects[o].w/2),this.rects[o].y) < 4){
                        
                        this.rects[i].n1 = o;
                        this.rects[i].ay = (this.rects[o].y - this.rects[i].y)/10;
                        this.rects[i].ax = (this.rects[o].x - this.rects[i].x)/10;
                        this.rects[i].HitDown = true;
                        this.rects[o].HitDown = true;
                        this.rects[i].type = this.rects[i].type.substring(0,6) + "b";
                        //ellipse(0,0,10,10);
                      }
                    }
                  }
                  //collision logic
                  for(var o = 0; o < this.rects.length;o++){
                    
                    if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                      this.rects[i].ay = this.rects[i].ay * -0;
                      this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                      this.rects[i].HitDown = true;
                    }
                    if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                      this.rects[i].ay = this.rects[i].ay * -0.0;
                      this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                      if(this.rects[o].type === "player"){
                        this.dragi = -1;
                      }
                    }
                    if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                      this.rects[i].ax = this.rects[i].ax * -0;
                      this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                    }
                    
                    if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                      this.rects[i].ax = this.rects[i].ax * -0;
                      this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                    }
                    if(this.rects[o].type.substring(0,4) !== "pipe"){
                      if(i !== o && this.rects[i].x - (this.rects[i].w/2) === this.rects[o].x + (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                        this.rects[i].ax = 1;
                      }
                      if(i !== o && this.rects[i].x + (this.rects[i].w/2) === this.rects[o].x - (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                        this.rects[i].ax = -1;
                      }
                    }
                  }
                  //move with acceleration
                  this.rects[i].y += this.rects[i].ay;
                  this.rects[i].x += this.rects[i].ax;
                  //friction
                  if(this.rects[i].HitDown){
                    this.rects[i].ax = 0;
                  }
                }
                //draw
                if(link1 === link2){
                  this.fill(64, 64, 64);
                }
                else{
                  this.fill(115, 115, 117);
                }
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].n2 === 1 || this.rects[i].n2 === 3 || this.rects[i].n2 === 0){
                  if(link1 === "u"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link1 === "d"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link1 === "l"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                    //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link1 === "r"){
                    //this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                    //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                }
                if(this.rects[i].n2 === 2 || this.rects[i].n2 === 3 || this.rects[i].n2 === 0){
                  if(link2 === "u"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link2 === "d"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link2 === "l"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                    //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link2 === "r"){
                    //this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                    //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                }
                this.fill(49, 66, 247);
                if(islinked === false){
                  if(this.rects[i].n2 === 2){
                    if(link1 === "u"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                      
                    }
                    if(link1 === "d"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                      //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    }
                    if(link1 === "l"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                      //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                    if(link1 === "r"){
                      this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                      //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                  }
                  if(this.rects[i].n2 === 1){
                    if(link2 === "u"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                      //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                    }
                    if(link2 === "d"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                      //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    }
                    if(link2 === "l"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                      //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                    if(link2 === "r"){
                      this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                      //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                  }
                  //if(this.rects[i].n2 === 1){
                  if(link1 === "u"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link1 === "d"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link1 === "l"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                    //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link1 === "r"){
                    //this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                    //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  //}
                  //if(this.rects[i].n2 === 2){
                  if(link2 === "u"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link2 === "d"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                    //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    this.line(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link2 === "l"){
                    //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                    //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  if(link2 === "r"){
                    //this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                    //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    this.line(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                  }
                  //}
                }
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.stroke(0, 0, 0);
              //logic and drawing of the boxes
              if(this.rects[i].type === "box"){
                //this.gravity acceleration
                this.rects[i].ay += this.gravity;
                //if fall, then die
                if(this.rects[i].y > 400){
                  this.dead = true;
                }
                //dond drag when a key is pressed
                // if(keyIsPressed){
                //   this.dragi = -1;
                // }
                //move when draged
                if(this.dragi === i){
                  if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0 && this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed < this.maxSpeed){
                    this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                    this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                  }
                  else if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0){
                    this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                    this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                  }
                }
                //set drag i to it's position in this.rects when draged
                if(this.mouseIsPressed && this.rects[i].HitDown && this.dragi === -1 && this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  this.dragi = i;
                }  
                //if mouse is not pressed, dont drag
                if(this.mouseIsPressed === false){
                  this.dragi = -1;
                }
                //this.rects[i].ax *= 0.8;
                this.rects[i].HitDown = false;
                //collision logic
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) - 1 && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                    this.rects[i].HitDown = true;
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0.0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                    if(this.rects[o].type === "player"){
                      this.dragi = -1;
                    }
                  }
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = 0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = 0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                  if(i !== o && this.rects[i].x - (this.rects[i].w/2) === this.rects[o].x + (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                    this.rects[i].ax = 1;
                  }
                  if(i !== o && this.rects[i].x + (this.rects[i].w/2) === this.rects[o].x - (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                    this.rects[i].ax = -1;
                  }
                }
                //use acceleration
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                //friction
                if(this.rects[i].HitDown){
                  this.rects[i].ax = 0;
                }
                //draw
                this.noStroke();
                this.fill(0, 0, 255);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.stroke(0, 0, 0);
              //logic and drawing of the laser boxes
              if(this.rects[i].type === "this.lazer"){
                //create it's laser
                if(this.rects[i].n2 === 0){
                  this.lazer.push({x:211,y:278,a:180,t:false,nb:-1,gr:this.lazer.length,c:i});
                  this.rects[i].n2 = 1;
                }
                //implement this.gravity
                this.rects[i].ay += this.gravity;
                //if fall, die
                if(this.rects[i].y > 400){
                  this.dead = true;
                }
                //dont drag if a key is pressed
                // if(keyIsPressed){
                //   this.dragi = -1;
                // }
                //move when linked
                if(this.dragi === i){
                  if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0 && this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed < this.maxSpeed){
                    this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                    this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                  }
                  else if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0){
                    this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                    this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                  }
                }
                //if draged, set this.dragi to it's position in this.rects
                if(this.mouseIsPressed && this.rects[i].HitDown && this.dragi === -1 && this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  this.dragi = i;
                }  
                //if not this.draging, dont drag
                if(this.mouseIsPressed === false){
                  this.dragi = -1;
                }
                //this.rects[i].ax *= 0.8;
                this.rects[i].HitDown = false;
                //collision logic
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) - 1 && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                    this.rects[i].HitDown = true;
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0.0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                    if(this.rects[o].type === "player"){
                      this.dragi = -1;
                    }
                  }
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = 0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = 0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                  if(i !== o && this.rects[i].x - (this.rects[i].w/2) === this.rects[o].x + (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                    this.rects[i].ax = 1;
                  }
                  if(i !== o && this.rects[i].x + (this.rects[i].w/2) === this.rects[o].x - (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                    this.rects[i].ax = -1;
                  }
                }
                //move with acceleration
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                //friction
                if(this.rects[i].HitDown){
                  this.rects[i].ax = 0;
                }
                //draw
                this.noStroke();
                this.fill(87, 87, 87);
                
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.stroke(0, 0, 0);
              //logic and drawing of the this.mirror boxes
              if(this.rects[i].type === "this.mirror"){
                //create it's this.mirror
                if(this.rects[i].mi === false){
                  //this.mirror.push({x:304,y:266,l:sqrt(200),a:45,c:i});
                  this.mirror.push({x:304,y:266,l:sqrt(200),a:45,c:i,r:true,tx:0,ty:0,b:false});
                  this.rects[i].mi = true;
                }
                //implement this.gravity
                this.rects[i].ay += this.gravity;
                //if fall die
                if(this.rects[i].y > 400){
                  this.dead = true;
                }
                //if a key is pressed, dont drag
                // if(keyIsPressed){
                //   this.dragi = -1;
                // }
                //move when draged
                if(this.dragi === i){
                  if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0 && this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed < this.maxSpeed){
                    this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                    this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                  }
                  else if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0){
                    this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                    this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.maxSpeed);
                  }
                }
                //if draged, set this.dragi to it's position in this.rects
                if(this.mouseIsPressed && this.rects[i].HitDown && this.dragi === -1 && this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  this.dragi = i;
                }  
                //if not this.draging dont drag
                if(this.mouseIsPressed === false){
                  this.dragi = -1;
                }
                //this.rects[i].ax *= 0.8;
                //collision logic
                this.rects[i].HitDown = false;
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) - 1 && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                    this.rects[i].HitDown = true;
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0.0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                    if(this.rects[o].type === "player"){
                      this.dragi = -1;
                    }
                  }
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = 0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = 0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                  if(i !== o && this.rects[i].x - (this.rects[i].w/2) === this.rects[o].x + (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                    this.rects[i].ax = 1;
                  }
                  if(i !== o && this.rects[i].x + (this.rects[i].w/2) === this.rects[o].x - (this.rects[o].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2) && (this.rects[o].type === "player" || this.rects[o].type === "box" || this.rects[o].type.substring(0,4) === "pipe")){
                    this.rects[i].ax = -1;
                  }
                }
                //move with acceleration
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                //friction
                if(this.rects[i].HitDown){
                  this.rects[i].ax = 0;
                }
                //draw
                this.noStroke();
                this.fill(0, 0, 255);
                
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.stroke(0, 0, 0);
              //logic and drawing of the laser sensing boxes
              if(this.rects[i].type === "sense"){
                //create its this.mirror
                if(this.rects[i].mi === false){
                  //this.mirror.push({x:304,y:266,l:sqrt(200),a:45,c:i});
                  this.mirror.push({x:304,y:266,l:sqrt(200),a:45,c:i,r:true,tx:0,ty:0,b:false});
                  this.rects[i].mi = true;
                }
                
                var out = false;
                var num = 0;
                //test for laser
                for(var o = 0; o < this.lazer.length;o++){
                  if(this.lazer[o].x > this.rects[i].x - (this.rects[i].w/2) && this.lazer[o].x < this.rects[i].x + (this.rects[i].w/2) && this.lazer[o].y > this.rects[i].y - (this.rects[i].h/2) && this.lazer[o].y < this.rects[i].y + (this.rects[i].h/2)){
                    out = true;
                  }
                }
                this.fill(0, 0, 0);
                //text(num,200,20);
                //move gates
                if(out === true){
                  if(this.rects[this.rects[i].n1].type === "gated"){
                    this.rects[this.rects[i].n1].ay = -1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gateu"){
                    this.rects[this.rects[i].n1].ay = 1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gater"){
                    this.rects[this.rects[i].n1].ax = -1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gatel"){
                    this.rects[this.rects[i].n1].ax = 1;
                  }
                }
                if(out === false){
                  if(this.rects[this.rects[i].n1].type === "gated"){
                    this.rects[this.rects[i].n1].ay = 1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gateu"){
                    this.rects[this.rects[i].n1].ay = -1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gater"){
                    this.rects[this.rects[i].n1].ax = 1;
                  }
                  if(this.rects[this.rects[i].n1].type === "gatel"){
                    this.rects[this.rects[i].n1].ax = -1;
                  }
                }
                //draw
                this.noStroke();
                this.fill(0, 60, 82);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                
              }
            }
            this.noStroke();
            for(var i = 0; i < this.rects.length;i++){
              this.noStroke();
              //logic and drawing of the platforms
              if(this.rects[i].type === "platform"){
                //draw
                this.fill(0, 255, 0);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.noStroke();
              //logic and drawing of the gates, all have vary simular logic, look at gated for comments
              if(this.rects[i].type === "gated"){
                //this.rects[i].ax *= 0.8;
                //collision logic
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                  }
                  
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                }
                //no x acceleration
                this.rects[i].ax *= 0;
                //move with acceleration
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                //draw
                this.fill(0, 150, 0);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                //if hovered over, draw a line to conections
                if(this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  for(var o = 0; o < this.rects.length;o++){
                    if((this.rects[o].type === "button" || this.rects[o].type === "sense") && this.rects[o].n1 === i){
                      this.stroke(255, 0, 0);
                      this.line(this.rects[o].x - this.X,this.rects[o].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                    }
                  }
                }  
              }
              if(this.rects[i].type === "gateu"){
                //this.rects[i].ax *= 0.8;
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                  }
                  
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                }
                this.rects[i].ax *= 0;
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                this.fill(0, 150, 0);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  for(var o = 0; o < this.rects.length;o++){
                    if((this.rects[o].type === "button" || this.rects[o].type === "sense") && this.rects[o].n1 === i){
                      this.stroke(255, 0, 0);
                      this.line(this.rects[o].x - this.X,this.rects[o].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                    }
                  }
                }  
              }
              if(this.rects[i].type === "gater"){
                //this.rects[i].ax *= 0.8;
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                  }
                  
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                }
                this.rects[i].ay *= 0;
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                this.fill(0, 150, 0);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  for(var o = 0; o < this.rects.length;o++){
                    if((this.rects[o].type === "button" || this.rects[o].type === "sense") && this.rects[o].n1 === i){
                      this.stroke(255, 0, 0);
                      this.line(this.rects[o].x - this.X,this.rects[o].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                    }
                  }
                }  
              }
              if(this.rects[i].type === "gatel"){
                //this.rects[i].ax *= 0.8;
                for(var o = 0; o < this.rects.length;o++){
                  if(i !== o && this.rects[i].y < this.rects[o].y && this.rects[i].y + this.rects[i].ay > this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y - (this.rects[o].h/2) - (this.rects[i].h/2);
                  }
                  if(i !== o && this.rects[i].y > this.rects[o].y && this.rects[i].y + this.rects[i].ay < this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2) && this.rects[i].x + (this.rects[i].w/2) - 1 > this.rects[o].x - (this.rects[o].w/2) && this.rects[i].x - (this.rects[i].w/2) + 1 < this.rects[o].x + (this.rects[o].w/2)){
                    this.rects[i].ay = this.rects[i].ay * -0;
                    this.rects[i].y = this.rects[o].y + (this.rects[o].h/2) + (this.rects[i].h/2);
                  }
                  
                  if(i !== o && this.rects[i].x < this.rects[o].x && this.rects[i].x + this.rects[i].ax > this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x - (this.rects[o].w/2) - (this.rects[i].w/2);
                  }
                  if(i !== o && this.rects[i].x > this.rects[o].x && this.rects[i].x + this.rects[i].ax < this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2) && this.rects[i].y + (this.rects[i].h/2) - 1 > this.rects[o].y - (this.rects[o].h/2) && this.rects[i].y - (this.rects[i].h/2) + 1 < this.rects[o].y + (this.rects[o].h/2)){
                    this.rects[i].ax = this.rects[i].ax * -0;
                    this.rects[i].x = this.rects[o].x + (this.rects[o].w/2) + (this.rects[i].w/2);
                  }
                  
                }
                this.rects[i].ay *= 0;
                this.rects[i].y += this.rects[i].ay;
                this.rects[i].x += this.rects[i].ax;
                this.fill(0, 150, 0);
                this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                  for(var o = 0; o < this.rects.length;o++){
                    if((this.rects[o].type === "button" || this.rects[o].type === "sense") && this.rects[o].n1 === i){
                      this.stroke(255, 0, 0);
                      this.line(this.rects[o].x - this.X,this.rects[o].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                    }
                  }
                }  
              }
            }
            
          };
          console.log(this.rects);

    }

    update() {


        this.graphics.clear();
        this.background(255, 255, 255);

        this.blocks();

        this.fill(255, 0, 0);
        //this.rect(30, 30, 30, 30);

    }
}