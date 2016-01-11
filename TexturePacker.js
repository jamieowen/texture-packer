
var pack = require( 'bin-pack' );

var defaultOpts = {
	pack: 'bin',
	spacing: 1
};

var TexturePacker = function( opts ){

	this._opts = opts || defaultOpts;

	this.canvas  = document.createElement( 'canvas' );
	this._sources = [];
	this.needsPack = true;
};

module.exports = TexturePacker;

TexturePacker.prototype = {

	constructor: TexturePacker,

	/**
	 * Add an item to be packed. This can be an Image element or Canvas element.
	 * @param source The source element
	 * @param data A custom data object that is related to the source ( usually a texture object ) - will be passed when packing to return uvs.
	 * @param opts Can be an object specifying width and height to scale the source to when drawing to the texture.
	 */
	add: function( source, data, opts ){

		var entry = {
			source: source,
			data: data,
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
		if( source instanceof HTMLImageElement ){
			entry.width = source.naturalWidth;
			entry.height = source.naturalHeight;
		}else
		if( source instanceof HTMLCanvasElement ){
			entry.width = source.width;
			entry.height = source.height;
		}

	},

	remove: function( source ){
		for( var i = 0; i<this._sources.length; i++ ){
			if( this._sources[i].source === source ){
				this._sources.splice(i,1);
				break;
			}
		}
	},

	pack: function(){

		if( this.needsPack ){
			this.needsPack = false;

			var result;
			var opts = this._opts;

			var input = this._sources.map( function( obj ){

				obj.packed.width = obj.width + ( opts.spacing * 2 );
				obj.packed.height = obj.height + ( opts.spacing * 2 );

				return obj.packed;
			});

			if( this._opts.pack === 'bin' ){
				result = pack( input, { inPlace: true } );
			}else
			if( this._opts.pack === 'grid' ){
				// TODO
			}

			this.canvas.width =  result.width;
			this.canvas.height = result.height;

			var ctx = this.canvas.getContext('2d');
			ctx.clearRect( 0,0,result.width,result.height );

			var entry;

			for( var i = 0; i<this._sources.length; i++ ){

				entry = this._sources[i];

				// adjust packed values to account for spacing.
				entry.packed.x += opts.spacing;
				entry.packed.y += opts.spacing;
				entry.packed.width -= opts.spacing * 2;
				entry.packed.height -= opts.spacing * 2;

				ctx.drawImage(entry.source,entry.packed.x,entry.packed.y);

				// TODO : generate uvs
				//entry.packed.u = entry.packed.x / result.width;
				//entry.packed.v = entry.packed.y / result.height;

			}
			
		}

	},

	forEach: function( each ){

		var entry;
		for( var i = 0; i<this._sources.length; i++ ){

			entry = this._sources[i];
			if( each ){
				each( entry.source, entry.data, entry.packed );
			}
		}

	}

};


