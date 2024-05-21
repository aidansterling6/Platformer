class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.SCALE = 2;
        this.PARTICLE_VELOCITY = 50;
        //this.SCALE = 0.7;
        this.width = config.width;
        this.height = config.height;
        //the level the player is on
        this.CurrentLevel = 1;

        this.X = 0;
        this.Y = 0;
        this.tmpSprites = [];

        this.toRad = function(degrees){
          return degrees * (Math.PI/180);
        }
        this.toDeg = function(radians){
          return radians * (180/Math.PI);
        }
        this.sin = function(num){
          return Math.sin(this.toRad(num));
        }
        this.cos = function(num){
          return Math.cos(this.toRad(num));
        }
        this.atan = function(num){
          return this.toDeg(Math.atan(num));
        }
        this.atan2 = function(num1, num2){
          return this.toDeg(Math.atan2(num1, num2));
        }
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

        // this.mouseMoved = this.input.on('pointermove', (pointer) => {
        //     let tmp = 0;
        //     let dw = this.width - (this.width*this.SCALE)
        //     let dh = this.height - (this.height*this.SCALE)
        //     // this.mouseX = ((pointer.x - dw*0.5)/(this.width*this.SCALE)) * this.width;
        //     // this.mouseY = ((pointer.y - dh*0.5)/(this.height*this.SCALE)) * this.height;
        //     this.mouseX = pointer.x / this.SCALE - this.player.x;
        //     this.mouseY = pointer.y / this.SCALE;
        // });


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
        //an array holding all this.lazers
        this.lazer = [];
        //an array holding all this.mirrors
        this.mirror = [];
        //sets the level to it's argument
        this.level = function(num, bReset){
            for(let i = 0; i < this.rects.length; i++){
              if(this.rects[i].sprite){
                this.rects[i].sprite.destroy(true);
              }
              if(this.rects[i].sprite1){
                this.rects[i].sprite1.destroy(true);
              }
              if(this.rects[i].sprite2){
                this.rects[i].sprite2.destroy(true);
              }
            }
            if(num === 1){
            this.dragi = -1;
            this.gravity = 0.1;
            this.mspeed = 5;
            this.maxSpeed = 3;
            if(bReset){
              this.respawnX = 100;
              this.respawnY = 231;
              // this.respawnX = 800;
              // this.respawnY = 231;
            }
            this.dead = false;
            this.helpPoint = [{x:122,t:"Jump over the spikes"},{x:275,t:"Move the blue box onto the button to open the gate, you can push it."},{x:444,t:"Click and drag the box to use magic."},{x:594,t:"You can not use magic in the red area, you have to push this block."},{x:864,t:"Hover over a gate with your mouse to see its connections."},{x:1066,t:"The red line is a check point, if you go through it your character will spawn at it when you die"},{x:1080,t:"Do not take objects through checkpoints because you will die"},{x:1673,t:"The grey boxes with lines are pipes"},{x:1683,t:"Pipes connect when the lines are lined up"},{x:1693,t:"Pipes can only connect to other pipes if they have the blue bouncy water at one end"},{x:1703,t:"You can only move the lightly colored pipes"}];
            this.noMagic = [{x:646,y:200,w:109,h:40}];
            this.checkPoint = [204,1100,1650,2080,2223];
            this.rects = [
              {x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},
              {x:600,y:250 + 5000/2,w:1124,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:159,y:250,w:50,h:20,ax:0,ay:0,HitDown:false,type:"spike",n1:-1,n2:10,mi:false},
              {x:600,y:113 - 5000/2,w:1124,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:400,y:153,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:360,y:153,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:380,y:145,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:335,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:6,n2:0,mi:false},
              {x:308,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"box",n1:-1,n2:0,mi:false},
              {x:500,y:153,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:460,y:153,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:480,y:145,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:534,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:11,n2:0,mi:false},
              {x:565,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"box",n1:0,n2:0,mi:false},
              {x:700,y:146,w:20,h:60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:660,y:146,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:680,y:145,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:734,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:16,n2:0,mi:false},
              {x:670,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"box",n1:0,n2:0,mi:false},
              {x:1000,y:145,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:960,y:145,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:980,y:145,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:851,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:21,n2:0,mi:false},
              {x:811,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:21,n2:0,mi:false},
              {x:771,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:21,n2:0,mi:false},
              {x:1410,y:250 + 5000/2,w:500,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1310,y:140,w:100,h:100,ax:0,ay:0,HitDown:false,type:"gateu",n1:-1,n2:0,mi:false},
              {x:1250,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1370,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1310,y:80,w:140,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1215,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:26,n2:0,mi:false},
              {x:1397,y:240,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:36,n2:0,mi:false},
              {x:1139,y:180,w:50,h:50,ax:0,ay:0,HitDown:false,type:"box",n1:-1,n2:0,mi:false},
              {x:1566,y:80,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1546,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1586,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1566,y:140,w:20,h:100,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:1800,y:210 + 5000/2,w:100,h:100 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1700,y:250 + 5000/2,w:100,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1739,y:235,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},
              {x:1739,y:215,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeudm",n1:-1,n2:0,mi:false},
              {x:1880,y:130,w:100,h:160,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1819,y:155,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},
              {x:1935,y:90,w:20,h:20,ax:0,ay:0,HitDown:false,type:"piperrb",n1:-1,n2:0,mi:false},
              {x:2100,y:250 + 5000/2,w:500,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:2109,y:111,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1950,y:245,w:200,h:20,ax:0,ay:0,HitDown:false,type:"spike",n1:-1,n2:30,mi:false},
              {x:2151,y:235,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},
              {x:2151,y:215,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipedlm",n1:-1,n2:0,mi:false},
              {x:2172,y:195,w:20,h:100,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1700,y:0 - 5000/2,w:1124,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:-460,y:0 - 5000/2,w:1000,h:10000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:2750,y:0 - 5000/2,w:1000,h:10000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false}
                ];
                    
                    
                    
            }
            if(num === 2){
            this.dragi = -1;
            this.gravity = 0.1;
            this.mspeed = 5;
            this.maxSpeed = 3;
            if(bReset){
              // this.respawnX = 49;
              // this.respawnY = 200;
              this.respawnX = 180;
              this.respawnY = 200;
            }
            this.dead = false;
            this.helpPoint = [];
            this.noMagic = [{x:220,y:240,w:99,h:40},{x:664,y:84,w:100,h:120}];
            this.checkPoint = [600,819];
            this.rects = [
              {x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},
              {x:100,y:250 + 5000/2,w:230,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:212,y:270 + 5000/2,w:20,h:5000 + 60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:329,y:270 + 5000/2,w:20,h:5000 + 60,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:270,y:290 + 5000/2,w:100,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:388,y:250 + 5000/2,w:100,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:428,y:187,w:20,h:122,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:468,y:130 + 5000/2,w:100,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:245,y:60 - 5000/2,w:520,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:335,y:142,w:20,h:140,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:315,y:130,w:20,h:130,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:355,y:130,w:20,h:130,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:305,y:280,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:9,n2:0,mi:false},
              {x:236,y:280,w:20,h:0,ax:0,ay:0,HitDown:false,type:"button",n1:9,n2:0,mi:false},
              {x:145,y:177,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeudm",n1:5,n2:-1,mi:false},
              {x:145,y:157,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeudm",n1:-1,n2:0,mi:false},
              {x:407,y:233,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipeuub",n1:-1,n2:0,mi:false},
              {x:593,y:130 + 5000/2,w:176,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:683,y:172 + 5000/2,w:20,h:5000 + 104,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:733,y:214 + 5000/2,w:80,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:774,y:134 + 5000/2,w:20,h:5000 + 180,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:695,y:130,w:20,h:20,ax:0,ay:0,HitDown:false,type:"piperrb",n1:5,n2:-1,mi:false},
              {x:624,y:88,w:20,h:20,ax:0,ay:0,HitDown:false,type:"pipelum",n1:5,n2:-1,mi:false},
              {x:827,y:54 + 5000/2,w:100,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:610,y:-40 - 5000/2,w:240,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:500,y:10 - 5000/2,w:20,h:5000 + 120,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:735,y:-25 - 5000/2,w:20,h:5000 + 50,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:810,y:-10 - 5000/2,w:135,h:5000 + 20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:-500,y:-10,w:1000,h:10000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1370,y:-10,w:1000,h:10000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false}
            ]
                    
                    
            }
            if(num === 3){
            this.dragi = -1;
            this.gravity = 0.1;
            this.mspeed = 5;
            this.maxSpeed = 3;
            if(bReset){
              this.respawnX = 93;
              this.respawnY = 200;
            }
            this.dead = false;
            this.helpPoint = [{x:100,t:"The white lines ether reflect or block lasers"},{x:110,t:"The thin red lines are this.lazers, you can move the grey laser shoting box"},{x:120,t:"Get a laser to the greyish blue boxes to open a gate just like a button"}];
            this.noMagic = [];
            this.checkPoint = [261,474,800];
            this.mirror = [{x:269,y:266,l:1000,a:89.9999,c:1,r:false,tx:-219,ty:0,b:false},{x:335,y:118,l:100,a:89.9999,c:1,r:false,tx:-37,ty:-118,b:false}];
            this.lazer = [];
            //this.rects = [{x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},{x:100,y:250,w:230,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},{x:99,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"lazer",n1:180,n2:0,mi:false},{x:18,y:178,w:20,h:20,ax:0,ay:0,HitDown:false,type:"mirror",n1:45,n2:0,mi:false},{x:18,y:63,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:5,n2:0,mi:false},{x:154,y:137,w:20,h:20,ax:0,ay:0,HitDown:false,type:"gated",n1:0,n2:0,mi:false},{x:154,y:113,w:20,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:0,n2:0,mi:false}];
            this.rects = [
              {x:this.respawnX,y:this.respawnY,w:10,h:20,ax:0,ay:0,HitDown:false,type:"player",n1:-1,n2:0,mi:false},
              {x:479,y:250,w:800,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:206,y:128,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:186,y:160,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:226,y:160,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:127,y:-162,w:20,h:20,ax:0,ay:0,HitDown:false,type:"lazer",n1:0,n2:0,mi:false},
              {x:152,y:187,w:20,h:20,ax:0,ay:0,HitDown:false,type:"mirror",n1:135,n2:0,mi:false},
              {x:127,y:187,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:8,n2:0,mi:false},
              {x:206,y:187,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:301,y:290 + 5000/2,w:60,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:281,y:270,w:20,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:321,y:270,w:20,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:301,y:270,w:20,h:20,ax:0,ay:0,HitDown:false,type:"lazer",n1:-90,n2:0,mi:false},
              {x:279,y:187,w:20,h:20,ax:0,ay:0,HitDown:false,type:"mirror",n1:135,n2:0,mi:false},
              {x:279,y:118,w:20,h:20,ax:0,ay:0,HitDown:false,type:"mirror",n1:135,n2:0,mi:false},
              {x:279,y:45,w:20,h:20,ax:0,ay:0,HitDown:false,type:"mirror",n1:135,n2:0,mi:false},
              {x:386,y:116,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:20,n2:0,mi:false},
              {x:456,y:108,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:436,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:476,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:456,y:187,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:656,y:108,w:60,h:20,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:636,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:676,y:140,w:20,h:80,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:656,y:187,w:20,h:80,ax:0,ay:0,HitDown:false,type:"gated",n1:-1,n2:0,mi:false},
              {x:586,y:210,w:20,h:20,ax:0,ay:0,HitDown:false,type:"sense",n1:24,n2:0,mi:false},
              {x:90,y:250 + 5000/2,w:400,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:800,y:250 + 5000/2,w:980,h:20 + 5000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:656,y:-500,w:10000,h:1000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:-512,y:0,w:1000,h:10000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              {x:1400,y:0,w:1000,h:10000,ax:0,ay:0,HitDown:false,type:"platform",n1:-1,n2:0,mi:false},
              ];
                    
            }


            for(let i = 0; i < this.rects.length; i++){
              this.rects[i].spriteShiftx = 0;
              this.rects[i].spriteShifty = 0;
              if(this.rects[i].type === "box"){
                this.rects[i].sprite1 = this.add.sprite(this.rects[i].w,this.rects[i].h, "tileGrey");
                let tex1 = this.textures.get("tileGrey").getSourceImage();
                this.rects[i].sprite1.scale = this.rects[i].w/tex1.height;
              }
              if(this.rects[i].type === "pipeudm"){
                this.rects[i].sprite1 = this.add.sprite(this.rects[i].w,this.rects[i].h, "tileGrey");
                let tex1 = this.textures.get("tileGrey").getSourceImage();
                this.rects[i].sprite1.scale = 20/tex1.height;

                this.rects[i].sprite2 = this.add.sprite(this.rects[i].w,this.rects[i].h, "pipe1");
                let tex2 = this.textures.get("pipe1").getSourceImage();
                this.rects[i].sprite2.scale = 20/tex2.height;
              }
              if(this.rects[i].type === "pipeuub"){
                this.rects[i].sprite1 = this.add.sprite(this.rects[i].w,this.rects[i].h, "tileGrey");
                let tex1 = this.textures.get("tileGrey").getSourceImage();
                this.rects[i].sprite1.scale = 20/tex1.height;

                this.rects[i].sprite2 = this.add.sprite(this.rects[i].w,this.rects[i].h, "pipe1");
                let tex2 = this.textures.get("pipe1").getSourceImage();
                this.rects[i].sprite2.scale = 20/tex2.height;
              }
              if(this.rects[i].type === "piperrb"){
                this.rects[i].sprite1 = this.add.sprite(this.rects[i].w,this.rects[i].h, "tileGrey");
                let tex1 = this.textures.get("tileGrey").getSourceImage();
                this.rects[i].sprite1.scale = 20/tex1.height;

                this.rects[i].sprite2 = this.add.sprite(this.rects[i].w,this.rects[i].h, "pipe2");
                let tex2 = this.textures.get("pipe2").getSourceImage();
                this.rects[i].sprite2.scale = 20/tex2.width;
              }
              if(this.rects[i].type === "pipelum"){
                this.rects[i].sprite1 = this.add.sprite(this.rects[i].w,this.rects[i].h, "tileGrey");
                let tex1 = this.textures.get("tileGrey").getSourceImage();
                this.rects[i].sprite1.scale = 20/tex1.height;

                this.rects[i].sprite2 = this.add.sprite(this.rects[i].w,this.rects[i].h, "pipe3");
                let tex2 = this.textures.get("pipe3").getSourceImage();
                let tmp = 5;
                this.rects[i].sprite2.scale = (20-tmp)/tex2.height;
                this.rects[i].spriteShiftx = -tmp/2;
                this.rects[i].spriteShifty = -tmp/2;
              }
              if(this.rects[i].type === "pipedlm"){
                this.rects[i].sprite1 = this.add.sprite(this.rects[i].w,this.rects[i].h, "tileGrey");
                let tex1 = this.textures.get("tileGrey").getSourceImage();
                this.rects[i].sprite1.scale = 20/tex1.height;

                this.rects[i].sprite2 = this.add.sprite(this.rects[i].w,this.rects[i].h, "pipe4");
                let tex2 = this.textures.get("pipe4").getSourceImage();
                let tmp = 5;
                this.rects[i].sprite2.scale = (20-tmp)/tex2.height;
                this.rects[i].spriteShiftx = -tmp/2;
                this.rects[i].spriteShifty = tmp/2;
              }
            }
            for(let i = 0; i < this.rects.length; i++){
              this.rects[i].sprite = null;
              if(this.rects[i].type.substring(0, 4) === "gate"){
                this.rects[i].sprite = this.add.tileSprite(0, 0,this.rects[i].w,this.rects[i].h, "tileGrey2");
                let tex = this.textures.get("tileGrey2").getSourceImage();
                this.rects[i].sprite.tileScaleX = 20/tex.width;
                this.rects[i].sprite.tileScaleY = 20/tex.height;
              }
              if(this.rects[i].type === "platform"){
                this.rects[i].sprite = this.add.tileSprite(0, 0,this.rects[i].w,this.rects[i].h, "metal");
                let tex = this.textures.get("metal").getSourceImage();
                this.rects[i].sprite.tileScaleX = 20/tex.width;
                this.rects[i].sprite.tileScaleY = 20/tex.height;
              }
            }
        };


        this.hex = function(value){
            let a = value.toString(16);
            if(a.length === 1){
                a = "0" + a;
            }
            return a;
        }
        this.color = function(r, g, b, a = 255){
            return {rgb: "0x" + this.hex(r) + this.hex(g) + this.hex(b), a: a};
        }
        this.Fill = this.color(255, 255, 255);
        this.Stroke = this.color(255, 255, 255);
        this.StrokeWeight = 1;
    }

    preload() {
      this.load.setPath("./assets/");
      this.load.image("metal", "Tiles/metalCenter.png");
      this.load.image("pipe1", "Tiles/pipeGreen_25.png");
      this.load.image("pipe2", "Tiles/pipeGreen_26.png");
      this.load.image("pipe3", "Tiles/pipeGreen_36.png");
      this.load.image("pipe4", "Tiles/pipeGreen_24.png");
      this.load.image("tileGrey", "Tiles/tileGrey_01.png");
      this.load.image("tileGrey2", "Tiles/tile_0022.png");
      this.load.image("background", "Tiles//Marble/tile_0070.png");
      //tile_0070.png
      //tile_0022.png
      //pipeGreen_36.png
    }

    create() {

      //this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
      //this.cameras.main.setDeadzone(50, 50);
      this.cameras.main.setZoom(this.SCALE);



        this.WKey = this.input.keyboard.addKey("W");
        this.AKey = this.input.keyboard.addKey("A");
        this.SKey = this.input.keyboard.addKey("S");
        this.DKey = this.input.keyboard.addKey("D");
        this.start = true;

        console.log(this.fill);
        this.graphics = this.add.graphics();

        this.fill = function(r, g, b, a = 255){
            this.Fill = this.color(r, g, b, a);
        }
        this.stroke = function(r, g, b, a = 255){
            this.Stroke = this.color(r, g, b, a);
        }
        this.noStroke = function(){
            this.Stroke.a = 0;
        }
        this.noFill = function(){
          this.Fill.a = 0;
      }
        this.strokeWeight = function(num){
            this.StrokeWeight = num;
        }

        this.background = function(r, g, b, a = 255){
            let tmpColor = this.color(r, g, b, a);
            const tmpRect = new Phaser.Geom.Rectangle(this.player.x - this.width/2, this.player.y - this.height/2, this.width, this.height);
            this.graphics.lineStyle(1, tmpColor.rgb, tmpColor.a/255);
            this.graphics.fillStyle(tmpColor.rgb, tmpColor.a/255);
            this.graphics.strokeRectShape(tmpRect);
            this.graphics.fillRectShape(tmpRect);
        }

        this.triangle = function(x1, y1, x2, y2, x3, y3){
            const tmpTri = new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3);
            this.graphics.lineStyle(this.StrokeWeight, this.Stroke.rgb, this.Stroke.a/255);
            this.graphics.fillStyle(this.Fill.rgb, this.Fill.a/255);
            this.graphics.strokeTriangleShape(tmpTri);
            this.graphics.fillTriangleShape(tmpTri);
        }


        this.line = function(x1, y1, x2, y2){
            const tmpLine = new Phaser.Geom.Line(x1, y1, x2, y2);
            this.graphics.lineStyle(this.StrokeWeight, this.Stroke.rgb, this.Stroke.a/255);
            this.graphics.strokeLineShape(tmpLine);
        }
        this.rect = function(x, y, w, h){
            //console.log("rect");
            const tmpRect = new Phaser.Geom.Rectangle(x, y, w, h);
            this.graphics.lineStyle(this.StrokeWeight, this.Stroke.rgb, this.Stroke.a/255);
            this.graphics.fillStyle(this.Fill.rgb, this.Fill.a/255);
            this.graphics.strokeRectShape(tmpRect);
            this.graphics.fillRectShape(tmpRect);
        }

        this.lineS = function(x1,y1,x2,y2,x3,y3,x4,y4){
          var a = y2 - y1;
          var b = x2 - x1;
          var h = x1;
          var k = y1;
          var c = y4 - y3;
          var d = x4 - x3;
          var j = x3;
          var l = y3;
          this.noFill();
          var x = ((-c*j*b)+(d*l*b)+(a*d*h)-(d*k*b))/((a*d)-(c*b));
          //this.fill(0, 0, 0);
          //this.noFill();
          //this.rect(x1 - this.X,y1 - this.Y,5,5);
          return {x:x,y:(c/d)*(x-j)+l,t:((Math.round(this.dist(x1,y1,x,(c/d)*(x-j)+l) + this.dist(x2,y2,x,(c/d)*(x-j)+l)) === Math.round(this.dist(x1,y1,x2,y2))) && (Math.round(this.dist(x3,y3,x,(c/d)*(x-j)+l) + this.dist(x4,y4,x,(c/d)*(x-j)+l)) === Math.round(this.dist(x3,y3,x4,y4))))};
          //ellipse(x2,y2,5,5);
        };
      //converts a this.line into an angle
        this.angLine = function(x1,y1,x2,y2){
          return this.atan2(y2-y1, x2-x1);
          //var t = 0;
          //if(x2 >= x1){
          //  t = this.atan((y2 - y1)/(x2 - x1)) + 90;
          //}
          //else{
          //  t = this.atan((y2 - y1)/(x2 - x1)) + 180 + 90;
          //}
          //return t - 90;
        };
      //logic and drawing of this.mirrors
        this.drawMirrors = function(){
          for(var i = 0; i < this.mirror.length;i++){
            //moves this.mirror to conected blocks coordinates
            if(this.rects[this.mirror[i].c].type === "mirror"){
              this.mirror[i].x = this.rects[this.mirror[i].c].x + this.mirror[i].tx;
              this.mirror[i].y = this.rects[this.mirror[i].c].y + this.mirror[i].ty;
              this.mirror[i].a = this.rects[this.mirror[i].c].n1;
            }
            else{
              this.mirror[i].x = this.rects[this.mirror[i].c].x + this.mirror[i].tx;
              this.mirror[i].y = this.rects[this.mirror[i].c].y + this.mirror[i].ty;
              //this.mirror[i].a = this.rects[this.mirror[i].c].n1;
            }
            //draw this.mirror
            this.stroke(255, 255, 255);
            this.line(this.mirror[i].x - (this.cos(this.mirror[i].a)*this.mirror[i].l) - this.X,this.mirror[i].y - (this.sin(this.mirror[i].a)*this.mirror[i].l) - this.Y,this.mirror[i].x + (this.cos(this.mirror[i].a)*this.mirror[i].l) - this.X,this.mirror[i].y + (this.sin(this.mirror[i].a)*this.mirror[i].l) - this.Y);
          }
        };
      //logic and drawing of lasers
        this.lazers = function(){
          for(var i = 0; i < this.lazer.length;i++){
            //move this.lazer to connected block
            if(this.lazer[i].c !== -1){
              this.lazer[i].x = this.rects[this.lazer[i].c].x;
              this.lazer[i].y = this.rects[this.lazer[i].c].y;
              this.lazer[i].a = this.rects[this.lazer[i].c].n1;
            }
            var x = 0;
            var y = 0;
            var snum = 9999999;
            //find closest this.mirror
            for(var o = 0; o < this.mirror.length;o++){
              if(o !== this.lazer[i].nb){
                var xy = this.lineS(this.lazer[i].x,this.lazer[i].y,this.lazer[i].x + (this.cos(this.lazer[i].a)*99999999),this.lazer[i].y + (this.sin(this.lazer[i].a)*99999999),this.mirror[o].x - (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y - (this.sin(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].x + (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y + (this.sin(this.mirror[o].a)*this.mirror[o].l));
                if(xy.t && this.dist(xy.x,xy.y,this.lazer[i].x,this.lazer[i].y) < snum){
                  snum = this.dist(xy.x,xy.y,this.lazer[i].x,this.lazer[i].y);
                }
              }
            }
            var lazertf = false;
            //reflection logic
            for(var o = 0; o < this.mirror.length;o++){
              this.mirror[o].b = false;
              var xy = this.lineS(this.lazer[i].x,this.lazer[i].y,this.lazer[i].x + (this.cos(this.lazer[i].a)*99999999),this.lazer[i].y + (this.sin(this.lazer[i].a)*99999999),this.mirror[o].x - (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y - (this.sin(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].x + (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y + (this.sin(this.mirror[o].a)*this.mirror[o].l));
              if(o !== this.lazer[i].nb){
                if(this.dist(xy.x,xy.y,this.lazer[i].x,this.lazer[i].y) === snum){
                  this.fill(0, 0, 0);
                  //ellipse(xy.x - this.X,xy.y - this.Y,5,5);
                  if(xy.t){
                    x = xy.x;
                    y = xy.y;
                    
                    var xy2 = this.lineS(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),x - (this.cos(this.lazer[i].a)*20) - (this.sin(this.mirror[o].a)*20),y - (this.sin(this.lazer[i].a)*20) + (this.cos(this.mirror[o].a)*20),this.mirror[o].x - (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y - (this.sin(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].x + (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y + (this.sin(this.mirror[o].a)*this.mirror[o].l));
                    
                    if(xy.t){
                      lazertf = true;
                      this.mirror[o].b = true;
                    }
                    
                    //this.rect(x - (this.cos(this.lazer[i].a)*20) - this.X,y - (this.sin(this.lazer[i].a)*20) - this.Y,5,5);
                    //this.line(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),x - (this.cos(this.lazer[i].a)*20) - (this.sin(this.mirror[o].a)*20),y - (this.sin(this.lazer[i].a)*20) + (this.cos(this.mirror[o].a)*20));
                    //ellipse(xy2.x,xy2.y,5,5);
                    var x3 = x - (this.cos(this.mirror[o].a)*this.dist(x,y,xy2.x,xy2.y));
                    var y3 = y - (this.sin(this.mirror[o].a)*this.dist(x,y,xy2.x,xy2.y));
                    if(Math.round(x3) === Math.round(xy2.x) && Math.round(y3) === Math.round(xy2.y)){
                      x3 = x - (this.cos(this.mirror[o].a)*-this.dist(x,y,xy2.x,xy2.y));
                      y3 = y - (this.sin(this.mirror[o].a)*-this.dist(x,y,xy2.x,xy2.y));
                    }
                    //ellipse(x3,y3,5,5);
                    var x4 = x3 + (this.sin(this.mirror[o].a)*this.dist(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),xy2.x,xy2.y));
                    var y4 = y3 - (this.cos(this.mirror[o].a)*this.dist(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),xy2.x,xy2.y));
                    
                    if(this.lineS(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),x4,y4,this.mirror[o].x - (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y - (this.sin(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].x + (this.cos(this.mirror[o].a)*this.mirror[o].l),this.mirror[o].y + (this.sin(this.mirror[o].a)*this.mirror[o].l)).t){
                      x4 = x3 + (this.sin(this.mirror[o].a)*-this.dist(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),xy2.x,xy2.y));
                      y4 = y3 - (this.cos(this.mirror[o].a)*-this.dist(x - (this.cos(this.lazer[i].a)*20),y - (this.sin(this.lazer[i].a)*20),xy2.x,xy2.y));
                    }
                    //ellipse(x4,y4,5,5);
                    //ellipse(x - (this.cos(this.mirror[o].a)*this.dist(x,y,xy2.x,xy2.y)) + (this.sin(this.mirror[o].a)*this.dist(x,y,xy2.x,xy2.y)),y - (this.sin(this.mirror[o].a)*this.dist(x,y,xy2.x,xy2.y)) - (this.cos(this.mirror[o].a)*this.dist(x,y,xy2.x,xy2.y)),5,5);
                    ////important
                    var a = this.angLine(x,y,x4,y4);
                    this.stroke(255, 0, 255);
                    //this.line(x,y,x + this.cos(a)*20,y + this.sin(a)*20);
                    //this.line(x,y,x4,y4);
                    if(this.mirror[o].r === true){
                      if(this.lazer[i].t === false){
                        this.lazer.push({x:x,y:y,a:a,t:false,nb:o,gr:this.lazer[i].gr,c:-1});
                        //ellipse(x - this.X,y - this.Y,5,5);
                        this.lazer[i].t = true;
                      }
                    } else{
                      this.rect(x - this.X - 2.5,y - this.Y - 2.5,5,5);
                    }
                  }
                }
              }
            }
            //draw this.lazer
            this.stroke(255, 0, 0);
            if(lazertf){
              this.line(this.lazer[i].x - this.X,this.lazer[i].y - this.Y,this.lazer[i].x + (this.cos(this.lazer[i].a)*this.dist(this.lazer[i].x,this.lazer[i].y,x,y)) - this.X,this.lazer[i].y + (this.sin(this.lazer[i].a)*this.dist(this.lazer[i].x,this.lazer[i].y,x,y)) - this.Y);
            }
            else{
              this.line(this.lazer[i].x - this.X,this.lazer[i].y - this.Y,this.lazer[i].x + (this.cos(this.lazer[i].a)*10000) - this.X,this.lazer[i].y + (this.sin(this.lazer[i].a)*10000) - this.Y);
            }
          }
          
        };

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
                this.rects[i].lx = this.rects[i].x;
                //move camera to block
                this.player.x = this.rects[i].x;
                this.player.y = this.rects[i].y - 2;
                ////////////////////////////////this.X = this.rects[i].x - (this.width/2);
                ////////////////////////////////this.Y = this.rects[i].y - (this.height/2);
                //if you fall, die
                if(this.rects[i].y > 400){
                  this.dead = true;
                }
                this.rects[i].timer--;


                //movement
                if(this.DKey.isDown){
                   this.rects[i].ax = 2;
                   this.player.setFlip(true, false);
                   //this.player.anims.play('walk', true);
                }
                if(this.AKey.isDown){
                  this.rects[i].ax = -2;
                  this.player.resetFlip();
                  //this.player.anims.play('walk', true);
                }
                let pj = this.rects[i].HitDown;
                if(this.WKey.isDown/*keyIsPressed && (keys[87] || keys[32] || keys[38] === true)*/ && this.rects[i].HitDown === true){
                  this.rects[i].ay =  -3;
                  this.jumping.startFollow(this.player, this.player.displayWidth/2-10, this.player.displayHeight/2-3, false);
                  this.jumping.setParticleSpeed(0, -40);

                    // Only play smoke effect if touching the ground

                    if (this.rects[i].HitDown) {

                      this.jumping.start();
                      this.rects[i].timer = 2;

                    }
                }
                this.rects[i].justDown = this.rects[i].HitDown;
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
                if(pj != this.rects[i].HitDown && this.rects[i].HitDown){
                  this.jumping.startFollow(this.player, this.player.displayWidth/2-10, this.player.displayHeight/2-3, false);
                  this.jumping.setParticleSpeed(0, -40);

                    // Only play smoke effect if touching the ground

                    if (this.rects[i].HitDown) {

                      this.jumping.start();
                      this.rects[i].timer = 2;

                    }
                }


                if(this.rects[i].timer < 0){
                this.walking.stop();
                this.jumping.stop();
                }
                if(Math.abs(this.rects[i].lx - this.rects[i].x) > 0.1){
                  if(this.DKey.isDown){
                    this.player.setFlip(true, false);
                    this.player.anims.play('walk', true);

                    this.walking.startFollow(this.player, this.player.displayWidth/2-10, this.player.displayHeight/2-3, true);
                    this.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

                    // Only play smoke effect if touching the ground

                    if (this.rects[i].HitDown) {

                      this.walking.start();

                    }
                 }
                 if(this.AKey.isDown){
                   this.player.resetFlip();
                   this.player.anims.play('walk', true);

                   this.walking.startFollow(this.player, this.player.displayWidth/2-10, this.player.displayHeight/2-3, false);
                    this.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                    // Only play smoke effect if touching the ground

                    if (this.rects[i].HitDown) {

                      this.walking.start();

                    }
                 }
                }
                else {
                  this.player.anims.play('idle');
                }

                if(this.rects[i].ax === 0 && this.rects[i].ay === 0){
                  //this.player.anims.play('idle');
                }
                if(!this.rects[i].HitDown){
                  this.player.anims.play('jump');

                }
                //draw player
                //this.fill(255, 0, 0);
                //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              //logic and drawing of the buttons
              if(this.rects[i].type === "button"){
                var out = true;
                 this.rects[i].HitDown = false;
                // //ditect a hit
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
                  if(this.WKey.isDown || this.AKey.isDown || this.DKey.isDown/*keyIsPressed*/){
                    this.dragi = -1;
                  }
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
                  // if(this.dragi === i){
                  //   if(dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0 && this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed < this.maxSpeed){
                  //     this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                  //     this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)/this.mspeed);
                  //   }
                  //   else if(this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY) !== 0){
                  //     this.rects[i].ax = -(this.rects[i].x - this.X - this.mouseX)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(maxSpeed);
                  //     this.rects[i].ay = -(this.rects[i].y - this.Y - this.mouseY)/this.dist(this.rects[i].x - this.X,this.rects[i].y - this.Y,this.mouseX,this.mouseY)*(maxSpeed);
                  //   }
                  // }
                  //if clicked on set deagi to its position in this.rects
                  if(this.mouseIsPressed && this.rects[i].HitDown && this.dragi === -1 && this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                    this.dragi = i;
                  }  
                  //if not presthis.sing the mouse, stop this.draging
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
                  //this.fill(64, 64, 64);
                  this.stroke(64, 64, 64);
                  this.fill(255, 255, 255);
                }
                else{
                  this.stroke(64, 64, 64);
                  this.fill(255, 255, 255);
                }
                //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].sprite1){
                  this.rects[i].sprite1.x = this.rects[i].x - this.X;
                  this.rects[i].sprite1.y = this.rects[i].y - this.Y;
                }
                if(this.rects[i].sprite2){
                  this.rects[i].sprite2.x = this.rects[i].x - this.X + this.rects[i].spriteShiftx;
                  this.rects[i].sprite2.y = this.rects[i].y - this.Y + this.rects[i].spriteShifty;
                }
                // if(this.rects[i].n2 === 1 || this.rects[i].n2 === 3 || this.rects[i].n2 === 0){
                //   if(link1 === "u"){
                //     //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                //     //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                //     this.line(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                //   if(link1 === "d"){
                //     //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                //     //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                //     this.line(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                //   if(link1 === "l"){
                //     //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                //     //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                //     this.line(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                //   if(link1 === "r"){
                //     //this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                //     //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                //     this.line(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                // }
                // if(this.rects[i].n2 === 2 || this.rects[i].n2 === 3 || this.rects[i].n2 === 0){
                //   if(link2 === "u"){
                //     //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,-10);
                //     //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                //     this.line(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                //   if(link2 === "d"){
                //     //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w,10);
                //     //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                //     this.line(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                //   if(link2 === "l"){
                //     //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,-10,this.rects[i].h);
                //     //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                //     this.line(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                //   if(link2 === "r"){
                //     //this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,10,this.rects[i].h);
                //     //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                //     this.line(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,this.rects[i].x - this.X,this.rects[i].y - this.Y);
                //   }
                // }
                this.fill(49, 66, 247);
                if(islinked === false){
                  if(this.rects[i].n2 === 2){
                    if(link1 === "u"){
                      this.rect(this.rects[i].x - this.rects[i].w/4 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w/2,-10);
                      
                    }
                    if(link1 === "d"){
                      this.rect(this.rects[i].x - this.rects[i].w/4 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w/2,10);
                      //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    }
                    if(link1 === "l"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/4 - this.Y,-10,this.rects[i].h/2);
                      //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                    if(link1 === "r"){
                      this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/4 - this.Y,10,this.rects[i].h/2);
                      //ellipse(this.rects[i].x + (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                  }
                  if(this.rects[i].n2 === 1){
                    if(link2 === "u"){
                      this.rect(this.rects[i].x - this.rects[i].w/4 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w/2,-10);
                      //ellipse(this.rects[i].x - this.X,this.rects[i].y - (this.rects[i].h/2) - this.Y,5,5);
                    }
                    if(link2 === "d"){
                      this.rect(this.rects[i].x - this.rects[i].w/4 - this.X,this.rects[i].y + this.rects[i].h/2 - this.Y,this.rects[i].w/2,10);
                      //ellipse(this.rects[i].x - this.X,this.rects[i].y + (this.rects[i].h/2) - this.Y,5,5);
                    }
                    if(link2 === "l"){
                      this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/4 - this.Y,-10,this.rects[i].h/2);
                      //ellipse(this.rects[i].x - (this.rects[i].w/2) - this.X,this.rects[i].y - this.Y,5,5);
                    }
                    if(link2 === "r"){
                      this.rect(this.rects[i].x + this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/4 - this.Y,10,this.rects[i].h/2);
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
                if(this.WKey.isDown || this.AKey.isDown || this.DKey.isDown/*keyIsPressed*/){
                  this.dragi = -1;
                }
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
                //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].sprite1){
                  this.rects[i].sprite1.x = this.rects[i].x - this.X;
                  this.rects[i].sprite1.y = this.rects[i].y - this.Y;
                }
              }
            }
            for(var i = 0; i < this.rects.length;i++){
              this.stroke(0, 0, 0);
              //logic and drawing of the laser boxes
              if(this.rects[i].type === "lazer"){
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
              if(this.WKey.isDown || this.AKey.isDown || this.DKey.isDown/*keyIsPressed*/){
                  this.dragi = -1;
                }
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
              if(this.rects[i].type === "mirror"){
                //create it's this.mirror
                if(this.rects[i].mi === false){
                  //this.mirror.push({x:304,y:266,l:Math.sqrt(200),a:45,c:i});
                  this.mirror.push({x:304,y:266,l:Math.sqrt(200),a:45,c:i,r:true,tx:0,ty:0,b:false});
                  this.rects[i].mi = true;
                }
                //implement this.gravity
                this.rects[i].ay += this.gravity;
                //if fall die
                if(this.rects[i].y > 400){
                  this.dead = true;
                }
                //if a key is pressed, dont drag
                if(this.WKey.isDown || this.AKey.isDown || this.DKey.isDown/*keyIsPressed*/){
                  this.dragi = -1;
                }
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
              //logic and drawing of the laser senthis.sing boxes
              if(this.rects[i].type === "sense"){
                //create its this.mirror
                if(this.rects[i].mi === false){
                  //this.mirror.push({x:304,y:266,l:Math.sqrt(200),a:45,c:i});
                  this.mirror.push({x:304,y:266,l:Math.sqrt(200),a:45,c:i,r:true,tx:0,ty:0,b:false});
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
              if(this.mouseIsPressed && this.mouseX > this.rects[i].x - this.X - (this.rects[i].w/2) && this.mouseX < this.rects[i].x - this.X + (this.rects[i].w/2) && this.mouseY > this.rects[i].y - this.Y - (this.rects[i].h/2) && this.mouseY < this.rects[i].y - this.Y + (this.rects[i].h/2)){
                console.log(i);
              }  
              this.noStroke();
              //logic and drawing of the platforms
              if(this.rects[i].type === "platform"){
                //draw
                //this.tmpSprites.push(this.add.tileSprite(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y + 2500,this.rects[i].w,this.rects[i].h, "metal"));
                //this.stroke(100, 100, 100);
                //this.fill(100, 100, 100);
                //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                
                if(this.rects[i].sprite){
                  this.rects[i].sprite.x = this.rects[i].x - this.X;
                  this.rects[i].sprite.y = this.rects[i].y - this.Y;
                }
                
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
                //this.fill(0, 150, 0);
                //this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].sprite){
                  this.rects[i].sprite.x = this.rects[i].x  - this.X;
                  this.rects[i].sprite.y = this.rects[i].y - this.Y;
                }
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
                // this.fill(0, 150, 0);
                // this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].sprite){
                  this.rects[i].sprite.x = this.rects[i].x  - this.X;
                  this.rects[i].sprite.y = this.rects[i].y - this.Y;
                }
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
                // this.fill(0, 150, 0);
                // this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].sprite){
                  this.rects[i].sprite.x = this.rects[i].x  - this.X;
                  this.rects[i].sprite.y = this.rects[i].y - this.Y;
                }
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
                // this.fill(0, 150, 0);
                // this.rect(this.rects[i].x - this.rects[i].w/2 - this.X,this.rects[i].y - this.rects[i].h/2 - this.Y,this.rects[i].w,this.rects[i].h);
                if(this.rects[i].sprite){
                  this.rects[i].sprite.x = this.rects[i].x  - this.X;
                  this.rects[i].sprite.y = this.rects[i].y - this.Y;
                }
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
          //logic and drawing of the no magic zones
        this.noMagicZone = function(draw){
          for(var i = 0; i < this.noMagic.length;i++){
            this.stroke(179, 0, 0,200);
            this.fill(255, 0, 0,80);
            if(this.mouseIsPressed && this.mouseX > this.noMagic[i].x - this.X && this.mouseX < this.noMagic[i].x - this.X + this.noMagic[i].w && this.mouseY > this.noMagic[i].y - this.Y && this.mouseY < this.noMagic[i].y - this.Y + this.noMagic[i].h){
              this.dragi = -1;
            }
            if(draw){
              this.rect(this.noMagic[i].x - this.X,this.noMagic[i].y - this.Y,this.noMagic[i].w,this.noMagic[i].h);
            }
          }
        };
          //console.log(this.rects);
        this.paralax = this.add.tileSprite(0, 0, 1000, 1000, "tileGrey");
        this.paralax.depth = -100;

        this.player = this.add.sprite(200, 200, "platformer_characters", "tile_0000.png");
        this.player.depth = 1000;

        this.walking = this.add.particles(0, 0, "kenny-particles", {
          frame: ['smoke_08.png', 'smoke_10.png'],
          // TODO: Try: add random: true
          random: true,
          scale: {start: 0.03*0.6, end: 0.1*0.6},
          // TODO: Try: maxAliveParticles: 8,
          maxAliveParticles: 8,
          lifespan: 250,
          // TODO: Try: gravityY: -400,
          gravityY: -300,
          alpha: {start: 1, end: 0.0}, 
      });
      this.jumping = this.add.particles(0, 0, "kenny-particles", {
        frame: ['smoke_07.png', 'smoke_19.png'],
        // TODO: Try: add random: true
        random: true,
        scale: {start: 0.03*0.6, end: 0.1},
        // TODO: Try: maxAliveParticles: 8,
        maxAliveParticles: 8,
        lifespan: 150,
        // TODO: Try: gravityY: -400,
        gravityY: -100,
        alpha: {start: 1, end: 0.0}, 
    });

      this.jumping.stop();
      this.walking.stop();
    }

    update() {
      this.width = this.sys.game.canvas.width;
      this.height = this.sys.game.canvas.height;
      this.cameras.main.setViewport(0, 0, this.width, this.height);
      this.cameras.main.startFollow(this.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
      this.cameras.main.setDeadzone(50, 50);
      this.cameras.main.setZoom(this.SCALE);

      this.mouseX = this.player.x + (game.input.mousePointer.x - this.width/2) / this.SCALE;
      this.mouseY = this.player.y + (game.input.mousePointer.y - this.height/2) / this.SCALE;

      //this.player.x = this.width/2;
      //this.player.y = this.height/2 - 2;
      //this.player.anims.play('idle');

      let tmpScale = 0.2
      let ratio = this.width/this.height;
      this.paralax.tileScaleX = tmpScale / ratio;
      this.paralax.tileScaleY = tmpScale;
      this.paralax.tilePositionX = this.player.x;
      this.paralax.tilePositionY = this.player.y;
      this.paralax.displayWidth = this.width;
      this.paralax.displayHeight = this.height;
      this.paralax.x = this.player.x;
      this.paralax.y = this.player.y;
      /*this.paralax.setCrop(
        0, 0, this.width, this.height
    );*/

      // while(this.tmpSprites.length > 0){
      //   this.tmpSprites[0].destroy(true);
      //   this.tmpSprites.splice(0, 1);
      // }
      if(this.start){
        this.level(this.CurrentLevel, true);
        this.start = false;
      }

        this.graphics.clear();
        this.background(0, 0, 0,  100);

        this.noMagicZone(true);
        this.blocks();
        this.drawMirrors();

        this.noStroke();
        this.lazers();
        for(var i = 0; i < this.lazer.length;i++){
          this.lazer[i].t = false;
          if(this.lazer[i].gr !== i){
            this.lazer.splice(i,1);
          }
        }
        this.lazers();
        for(var i = 0; i < this.lazer.length;i++){
          this.lazer[i].t = false;
          if(this.lazer[i].gr !== i){
            this.lazer.splice(i,1);
          }
        }
        this.lazers();
        for(var i = 0; i < this.lazer.length;i++){
          this.lazer[i].t = false;
          if(this.lazer[i].gr !== i){
            this.lazer.splice(i,1);
          }
        }
        this.stroke(255, 0, 0);
        this.lazers();


        this.noMagicZone(true);

        for(var i = 0; i < this.checkPoint.length;i++){
          for(var o = 0; o < this.rects.length;o++){
            if(this.rects[o].type === "player" && this.rects[o].x > this.checkPoint[i] - 5 && this.rects[o].x < this.checkPoint[i] + 5){
              this.respawnX = this.checkPoint[i];
              this.respawnY = this.rects[o].y;
              if(i === this.checkPoint.length - 1){
                this.CurrentLevel++;
                this.level(this.CurrentLevel, true);
              }
            }
            if(this.rects[o].type !== "player" && this.rects[o].type !== "gated" && this.rects[o].type !== "platform" && this.rects[o].x > this.checkPoint[i] - 5 && this.rects[o].x < this.checkPoint[i] + 5){
              this.dead = true;
            }
          }
          this.stroke(255, 0, 0,150);
          this.strokeWeight(10);
          this.line(this.checkPoint[i] - this.X,0,this.checkPoint[i] - this.X,this.height);
          this.strokeWeight(1);
        }

        if(this.dead === true){
          //frameRate(1);
          this.dragi = -1;
          this.dead = false;
          this.level(this.CurrentLevel, false);
        }
        //this.add.sprite(100, 100, "metal")h
        if(this.CurrentLevel > 3){
          this.background(0, 0, 0);
          //you won
        }
    }
}