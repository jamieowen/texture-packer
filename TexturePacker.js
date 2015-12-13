
var pack = require( 'bin-pack' );

var defaultOpts = {
	pack: 'bin',
	spacing: 1
};

var TexturePacker = function( opts ){

	this._opts = opts || defaultOpts;

	this.texture  = null;
	this._sources = [];
	this.needsPack = true;
};

module.exports = TexturePacker;

TexturePacker.prototype = {

	constructor: TexturePacker,

	/**
	 * Add an item to be packed. This can be an Image element or Canvas element.
	 * @param src
	 * @param opts Can be an object specifying width and height to scale the source to when drawing to the texture.
	 */
	add: function( src, opts ){

		var entry = {
			src: src,
			width: null,
			height: null,
			packed: {
				width: null,
				height: null,
				u: null,
				v: null
			}
		};

		this._sources.push( entry );

		this.needsPack = true;

		if( opts && opts.width && opts.height ){
			entry.width = opts.width;
			entry.height = opts.height;
		}else
		if( src instanceof HTMLImageElement ){
			entry.width = src.naturalWidth;
			entry.height = src.naturalHeight;
		}else
		if( src instanceof HTMLCanvasElement ){
			entry.width = src.width;
			entry.height = src.height;
		}

	},

	remove: function( src ){
		for( var i = 0; i<this._sources.length; i++ ){
			if( this._sources[i].src === src ){
				this._sources.splice(i,1);
				break;
			}
		}
	},

	pack: function(){

		if( this.needsPack ){
			this.needsPack = false;

			if( !this.texture ){
				this.texture = document.createElement( 'canvas' );
			}

			var result;
			var opts = this._opts;

			var input = this._sources.map( function( obj ){

				obj.packed.width = obj.width + ( opts.spacing * 2 );
				obj.packed.height = obj.height + ( opts.spacing * 2 );

				return obj.packed;
			});

			if( this._opts.pack === 'bin' ){
				result = pack( input, { inPlace: true } );
			}

			this.texture.width =  result.width;
			this.texture.height = result.height;

			var ctx = this.texture.getContext('2d');
			ctx.clearRect( 0,0,result.width,result.height );

			var entry;

			for( var i = 0; i<this._sources.length; i++ ){
				entry = this._sources[i];
				ctx.drawImage(entry.src,entry.packed.x,entry.packed.y);
			}
			
		}

	}

};


