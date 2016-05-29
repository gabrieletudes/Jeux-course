/*
 * /game.js - Canvas initialisation, game launcher
 *
 * coded by Gabriel!
 * started at 16/05/2016
 */

( function( Driving ) {
    "use strict";

    var oApp = {
            "canvas": null,
            "context": null,
            "width": null,
            "height": null
        },
        _isCanvasSupported;

    _isCanvasSupported = function( $canvasElt ) {
        return !!$canvasElt.getContext;
    };
    // preparer notre canvas
    oApp.setup = function() {
        this.canvas = document.querySelector( "#game" );

        if ( !_isCanvasSupported( this.canvas ) ) {
            return console.error( "canvas isn't supported" );
        }

        this.context = this.canvas.getContext( "2d" );
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        // utiliser new Driving(); peut ne pas fonctioner
        window.game = new Driving( this );// this vaut oApp
    };

    oApp.setup();
} )( window.Driving );
