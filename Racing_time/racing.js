    /*
     * /driving.js - Driving time main class
     *
     * coded by Gabriel!
     * started at 16/05/2016
     */
    ( function() {

        "use strict";

        var Driving;

        //   classe Driving
        Driving = function( oApp ) {
            var game = this, //   eslint-disable-line consistent-this
                Cars;

            this.app = oApp;

            this.time = {
                "start": null,
                "current": null
            };

            this.startingscreen = {
                "frames": {
                    "logo": {
                        //   spritesheet
                        "sx": 496,
                        "sy": 21,
                        "sw": 212,
                        "sh": 212,
                        //   canvas
                        "dx": game.app.width / 5,
                        "dy": game.app.height / 7,
                        "dw": 212,
                        "dh": 212
                    },
                    "fleches": {
                        //   spritesheet
                        "sx": 381,
                        "sy": 346,
                        "sw": 321,
                        "sh": 78,
                        //   canvas
                        "dx": game.app.width / 18,
                        "dy": game.app.height - 140,
                        "dw": 321,
                        "dh": 78
                    }
                },
                //   desiner notre image
                "draw": function() {
                    game._drawSpriteFromFrame( this.frames.logo );
                    game._drawSpriteFromFrame( this.frames.fleches );
                }
            };//   end this startingscreen

            this.overscreen = {
                "frames": {
                    "over": {
                    //   spritesheet
                        "sx": 377,
                        "sy": 427,
                        "sw": 212,
                        "sh": 212,
                        //   canvas
                        "dx": game.app.width / 5,
                        "dy": game.app.height / 7,
                        "dw": 212,
                        "dh": 212
                    },
                    "scorecard": {
                        //   spritesheet
                        "sx": 488,
                        "sy": 242,
                        "sw": 228,
                        "sh": 85,
                        //   canvas
                        "dx": game.app.width / 5,
                        "dy": game.app.height / 2,
                        "dw": 228,
                        "dh": 85
                    }
                },
                //   desiner notre image
                "draw": function() {
                    game._drawSpriteFromFrame( this.frames.over );
                    game._drawSpriteFromFrame( this.frames.scorecard );
                }
            };//   end this overscreen

            //   asphalt object
            this.asphalt = {
                //   dessiner l'element
                "frame": {
                    //   spritesheet
                    "sx": 0,
                    "sy": 0,
                    "sw": 360,
                    "sh": 1280,
                    //   canvas
                    "dx": 0,
                    "dy": ( game.app.height - game.app.height ),
                    "dw": 360,
                    "dh": 1280
                },
                //   velocite
                "speed": 6,
                //   maxOffset of background
                "maxOffset": ( game.app.height - game.app.height ) - 10,
                //   dessiner l'image
                "draw": function() {
                    game._drawSpriteFromFrame( this.frame );
                },
                //   actualizer
                "update": function() {
                    //   si l'image arrive a bout on replace l'image au debout
                    if ( this.frame.dy >= ( this.maxOffset ) ) {
                        this.frame.dy = ( game.app.height - game.app.height ) - 100;

                    }
                    //   changer la postiion du dy
                    this.frame.dy += this.speed;
                    this.draw();
                }
            };
            //   fin asphalt

            //   greencar object
            this.greencar = {
                //   dessiner l'element
                "frame": {
                    //   spritesheet
                    "sx": 381,
                    "sy": 172,
                    "sw": 60,
                    "sh": 115,
                    //   canvas
                    "dx": ( game.app.width - 60 ) / 2,
                    "dy": game.app.height - 172,
                    "dw": 60,
                    "dh": 115
                },
                "state": {
                    "move": false,
                    "isInSafeZone": false
                },
                "score": {
                    "current": 0,
                    "previous": 0
                },
                "position": {
                    "top": 0,
                    "bottom": 0,
                    "right": 0,
                    "left": 0
                },
                //   max and min offset for right and left
                "maxOffset": game.app.width - 90,
                "minOffset": ( game.app.width - game.app.width ) + 35,
                //   dessiner l'image
                "draw": function() {
                    game._drawSpriteFromFrame( this.frame );
                },
                //   actualizer
                "update": function( oEvent ) {
                    var self = this,
                        key = oEvent.keyCode;

                    if ( oEvent ) {
                        if ( oEvent.type === "keyup" && key === 37 || key === 39 ) {
                            if ( !game.over.ended ) {
                                if ( !this.state.move ) {
                                    //   since we know that this is the first click, we can generate
                                    Cars.generate( 4 );
                                    game.started = true;
                                    this.state.move = true;
                                }
                                if ( key === 37 && this.frame.dx > this.minOffset ) {
                                    this.frame.dx -= 120;
                                }
                                if ( key === 39 && this.frame.dx < this.maxOffset ) {
                                    this.frame.dx += 120;
                                }
                            }else {
                                //   restart game
                                return game.start();
                            }
                        } else {
                            return;
                        }
                    }

                    //    update hitzone border
                    this.position.top = ( this.frame.dy - this.frame.dh ) + 115;

                    this.position.bottom = this.frame.dy + this.frame.dh;

                    this.position.left = ( this.frame.dx + this.frame.dw ) - 5;

                    this.position.right = ( this.frame.dx + this.frame.dw ) + 55;


                    //   check car hitzones collision
                    game.cars.forEach( function( oCar ) {
                        var oPosition = self.position,
                            oCarTop = oCar.frame.top.dy + oCar.frame.top.dh,
                            oCarBottom = ( oCar.frame.top.dy - oCar.frame.top.dh ) + 115,
                            oCarRight = oCar.frame.top.dx + oCar.frame.top.dw,
                            oCarLeft = ( oCar.frame.top.dx - oCar.frame.top.dw ) + 60;

                        //   collisions
                        if ( ( oPosition.left < oCarRight && oPosition.right > oCarLeft ) ) {
                            if ( oPosition.top < oCarBottom && oPosition.top > oCarTop ) {
                                game.over();

                            }else {
                                self.state.isInSafeZone = true;
                            }
                        }
                        // update score when key are pressed and cars are avoid
                        if ( self.state.isInSafeZone ) {

                            if ( self.score.current === self.score.previous ) {
                                self.score.current++;
                            }
                        }else {
                            self.score.previous = self.score.current;
                        }
                        self.state.isInSafeZone = false;
                    } );
                }

            };
            //   fin greencar

            //    utils
            this._drawSpriteFromFrame = function( oFrame ) {
                this.app.context.drawImage(
                    this.spriteSheet,
                    oFrame.sx,
                    oFrame.sy,
                    oFrame.sw,
                    oFrame.sh,
                    //   canvas
                    oFrame.dx,
                    oFrame.dy,
                    oFrame.dw,
                    oFrame.dh
                );
            };
            //   utils fin

            //   Start Cars function
            Cars = function( iDy ) {
            //   commencera avec une valeur alleatoire
                var iPairWidth = Cars.generateNextCarWidth();

                this.frame = {
                    "top": {
                        //    spritesheet
                        "sx": 381,
                        "sy": 18,
                        "sw": 60,
                        "sh": 115,
                        //   canvas
                        "dx": iPairWidth,
                        "dy": iDy,
                        "dw": 60,
                        "dh": 115
                    }
                };
            };
            //   End Cars function

            //   Gestion cars
            Cars.prototype.draw = function() {
                game._drawSpriteFromFrame( this.frame.top );
            };
            //   end gestion cars

            //   start gestion cars
            Cars.prototype.update = function() {
                var iPairWidth;

                this.frame.top.dy += game.asphalt.speed;

                if ( this.frame.top.dy > ( this.frame.top.dh ) + 720 ) {
                    this.frame.top.dy = ( game.app.height - game.app.height ) - 115;
                    iPairWidth = Cars.generateNextCarWidth();
                    //   des largeur differentes
                    this.frame.top.dx = iPairWidth;
                }

                // detect vertical collisions
                if ( game.greencar.frame.dy < this.frame.top.dy + this.frame.top.dh && game.greencar.frame.dx <= this.frame.top.dx + this.frame.top.dw ) {
                    game.over();
                }else {
                    console.log( "is ok" );
                }
                this.draw();
            };
            //   start gestion cars

            //   garder la reference
            Cars.lastGeneratedCarWidth = -1 * ( 20 + Math.floor( Math.random() * 115 ) );

            //   Start generateNextPairWidth
            Cars.generateNextCarWidth = function() {
                //   0 ou 1 et 1 ou moins -1
                var iMultiplier = Math.round( Math.random() ) % 2 ? 1 : -1,
                    iMaxGap = 270, //   plus petit plus proche et plus grand plus dificil
                    iNewValue = Cars.lastGeneratedCarWidth + Math.floor( Math.random() * iMaxGap ) * iMultiplier;

                //   if et else
                ( iNewValue < 90 ) && ( iNewValue = 30 );
                ( iNewValue >= 90 && iNewValue <= 210 ) && ( iNewValue = 150 );
                ( iNewValue > 210 ) && ( iNewValue = 270 );

                Cars.lastGeneratedCarWidth = iNewValue;
                return iNewValue;

            };

            //   end generateNextPairWidth

            //   start generate
            Cars.generate = function( iAmount ) {
                var i = 0,
                    iCarStartingPosition = -600,
                    iCarGap = 230;//   space entre chaque car

                for ( ; i < iAmount ; i++ ) {
                    game.cars.push( new Cars( iCarStartingPosition + ( i * iCarGap ) ) );
                }
            };
            //   end generate

    //   animation loop
            this.animate = function() {
                this.time.current = Date.now();
                this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );

                //   draw clear
                this.app.context.clearRect( 0, 0, this.app.width, this.app.height );

                //   draw asphalt
                this.asphalt.update();

                //   draw orangecars
                this.cars.forEach( function( oCar ) {
                    oCar.update();
                } );

                //   draw greencar
                this.greencar.draw();

                if( this.time.current - this.time.start > 50 ) {
                    this.time.start = Date.now();
                }

                //   draw start screen if needed
                if ( !game.started ) {
                    this.startingscreen.draw();
                }
            };
    //   animation loop fin

    //   game over
            this.over = function() {
                //   stop animation
                window.cancelAnimationFrame( this.animationRequestID );
                //   jeux termine ?
                this.ended = true;
                //  draw game over
                this.overscreen.draw();
                //  draw score
                game.app.context.strokeStyle = "#F5A623";
                game.app.context.font = "25.9px sans-serif";
                game.app.context.textAlign = "end";
                game.app.context.strokeText( this.greencar.score.current * 100, ( game.app.width / 2 ) + 102, ( game.app.height / 2 ) + 60 );

            };
    //   game over fin

    //   Init game
            this.start = function() {
                //   setup events
                if( !this.eventsSetted ) { //   vaut faux
                    window.addEventListener( "keyup", this.greencar.update.bind( this.greencar ) );
                    this.eventsSetted = true;

                }

                //    reset some variables
                this.cars = [];
                this.time.start = Date.now();
                this.started = false;
                game.over.ended = false;

                //   launch animation
                this.animate();

            };
    //   Init game fin

            //   charger le sprites
            this.spriteSheet = new Image();
            this.spriteSheet.addEventListener( "load", this.start.bind( this ) );
            this.spriteSheet.src = "./resources/spritesheet.png";
        };
        //   class Driving fin

        //   Driving accecible de partout
        window.Driving = Driving;
    } )();
