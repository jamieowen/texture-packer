
var TexturePacker = require( '../TexturePacker' );
var Loader 		  = require( 'resource-loader' );
var pantoneSkin   = require( './pantone-skin' );


window.onload = function(){

	// canvases
	var texturePacker = new TexturePacker();
	var canvas,ctx;

	var w = 50;
	var h = 50;
	var rand = 100;

	for( var i = 0; i<pantoneSkin.length; i++ ){

		canvas = document.createElement( 'canvas' );
		canvas.width  = w + ( Math.random() * rand );
		canvas.height = h + ( Math.random() * rand );

		ctx = canvas.getContext( '2d' );
		ctx.fillStyle = pantoneSkin[i].hex;
		ctx.fillRect(0,0,canvas.width,canvas.height);

		texturePacker.add( canvas );
	}

	var loader = new Loader();
	var hash = {};
	var img;
	for( var i = 1; i<=5; i++ ){
		img = 'example/image' + i + '.jpg';
		loader.add( img );
		hash[ img ] = img;
	}

	loader.load( function( loader, resources ){
		var src;
		for( var key in hash ){
			src = resources[key].data;
			texturePacker.add( src );
		}

		texturePacker.pack();

		document.body.appendChild( texturePacker.texture );

	})

};