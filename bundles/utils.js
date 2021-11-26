var debug = debug || false;

function getRandomColor(letters = '0123456789ABCDEF', alpha = 1) {

	var color = '#';

	for (var i = 0; i < 6; i++)
		color += letters[Math.floor(Math.random() * letters.length)];

	alpha = letters[Math.floor(alpha * letters.length)];

	return color + alpha + alpha;
}


function getHttp(url)
{
    var xmlHttp = $.get(url)

	var htmlResponse = document.createElement("html");
	$(htmlResponse)[0].innerHTML = xmlHttp.responseText;


	console.log(xmlHttp.responseText);
    return htmlResponse;
}

function htmlentities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function rgb2hex(r, g, b, a = null) {

	var rhex = r.toString(16);
		rhex = (rhex.length == 1) ? "0" + rhex : rhex;
	var ghex = g.toString(16);
		ghex = (ghex.length == 1) ? "0" + ghex : ghex;
	var bhex = b.toString(16);
		bhex = (bhex.length == 1) ? "0" + bhex : bhex;

	var ahex = "";
	if(a != null) {
		ahex = a.toString(16);
		ahex = (ahex.length == 1) ? "0" + ahex : ahex;
	}

	return "#" + rhex + ghex + bhex + ahex;
}
function hex2rgb(hex) {

	if(hex[0] != "#") throw new Error("Hexacode expected: " + hex);

	hex = hex.substring(1);
	if(hex.length == 3)
		return [parseInt(hex[0]+hex[0], 16), parseInt(hex[1]+hex[1], 16), parseInt(hex[2]+hex[2], 16), 255];
	if(hex.length == 4)
		return [parseInt(hex[0]+hex[1], 16), parseInt(hex[1]+hex[1], 16), parseInt(hex[2]+hex[2], 16), parseInt(hex[3]+hex[3], 16)];
	if(hex.length == 6)
		return [parseInt(hex[0]+hex[1], 16), parseInt(hex[2]+hex[3], 16), parseInt(hex[4]+hex[5], 16), 255];
	if(hex.length == 8)
		return [parseInt(hex[0]+hex[1], 16), parseInt(hex[2]+hex[3], 16), parseInt(hex[4]+hex[5], 16), parseInt(hex[6]+hex[7], 16)];
}

$(function () {$('[data-toggle="tooltip"]').tooltip()})

/*
 * Preload image
 */
function Preload() {

	var url = [];
	var callback = function () {};

	for (var i = 0; i < arguments.length; i++) {

		var arg = Preload.arguments[i];

		if (typeof arg == "string") {
			url.push(arg);
		} else if (Array.isArray(arg)) {
			for (var j = 0; j < arg.length; j++)
				if (typeof arg[j] == "string") url.push(arg[j]);
		} else if (typeof arg == "function") {
			callback = arg;
		}
	}

	// If nothing to do, just call back..
	if (url.length == 0) return callback();

	var nloaded = 0;

	function _callback() {

		if (nloaded == url.length) {
			if (debug) console.log("All images loaded: ", url);
			return callback();
		};
	};

	for (var i = 0; i < url.length; i++) {

		var image = document.createElement('preload');
//		var image = new Image();
		image.onload = function () {
			nloaded++;
			_callback();
		};

		image.src = url[i];
	}
};

function NormalDistribution(x) {
	return GaussianDistribution(x, 0, 1);
}

function GaussianDistribution(x, mu = 0, sigma = 1) {
	if (x == null) throw new Error("Provide an x-value to compute the N(mu=" + mu + ",sigma=" + sigma + ") distribution");
	if (!sigma) throw new Error("Sigma must be != 0");
	return Math.exp(-1 / 2 * Math.pow((x - mu) / sigma, 2)) / sigma / Math.sqrt(2 * Math.PI);
}

function GaussianDistributionRange(x, a = -1, b = 1, N = 6) {
	if (!N) throw new Error("N argument must be != 0 ");
	return GaussianDistribution(x, (a + b) / 2, (b - a) / (2 * N));
}

function RandomString(N, ascii = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {

	var s = '';
	for ( var i = 0; i < N; i++ )
		s += ascii.charAt( Math.floor(Math.random() * ascii.length) );

	return s;
}

function RandomNormal() {
	var U1 = Math.random(),
		U2 = Math.random();
	var X1 = Math.sqrt(-2 * Math.log(U1)) * Math.cos(2 * Math.PI * U2);
	var X2 = Math.sqrt(-2 * Math.log(U1)) * Math.sin(2 * Math.PI * U2);

	return [X1, X2];
}

function RandomBoolean(rate) {
	return (RandomInt(0, rate) == 0);
}

function CheckEventTrigger(that, cls) { // Security when object is used with .addEventListener()

	if( !(that instanceof cls) )
		throw new Error("Cannot use "+cls.name+"() class that way.. Consider using .bind()");
}

function RandomGaussian(mu, sigma) {
	return sigma * RandomNormal() + mu;
}

function RandomInt(min, max) {

	if (min == null || max == null) throw new Error("Wrong usage of GetRandomInt(); Please provide minmax values");
	return min + Math.floor(Math.random() * Math.floor(max - min + 1));
}

/* Load image at a custom size.. */
function LoadRessource(url, opts, element, callback, callback2) {

	if(debug) console.log("Calling LoadRessource("+url+")..");
	if(debug) console.trace();

	if (callback != null && typeof callback !== "function")
		throw new Error("Unvalid object passed as callback function in \"" + url + "\".. "+ callback);
	callback = callback || function (url, element) {};

	if (callback2 != null && typeof callback2 !== "function")
		throw new Error("Unvalid object passed as callback2 function in \"" + url + "\".. "+ callback2);
	callback2 = callback2 || function (url, element) {};

	if (!url) throw new Error("Empty url.. nothing to load");

	if (opts && !isDict(opts))
		throw new Error("Unexpected options \"" + opts + "\" passed to \"" + url + "\"");

	if (typeof element === "function")
		throw new Error("A function has been passed as element in \"" + url + "\"..");

	//
	// First case: If url is an array
	if (Array.isArray(url)) {

		if (debug) console.log("Array of URL detected..", url);
		if (url.length == 0) {

			callback();
			return url;
		}

		var nloaded = 0;

		function _callback() {

			if (nloaded == url.length) {
				if (debug) console.log("All ressources loaded: ", url);
				callback();
			}
		};

		for (var i = 0; i < url.length; i++) {

			url[i] = LoadRessource(url[i], opts, element,
				function (url, element) {
					nloaded++;
					_callback();
				}
			);
		}

		return url;
	}

	//
	// Second case: If an object is passed as argument
	if (url.tagName == "CANVAS") {

		if (debug) console.log("Canvas already loaded: ", url);

		var c = url;
		var ctx = c.getContext('2d');

		if (opts["blur"]) ctx.filter = "blur(" + opts["blur"] + ")";
		if (opts["blur"]) ctx.imageSmoothingEnabled = true;

		if (opts["alpha"]) ctx.globalAlpha = opts["alpha"];
		else if (opts["opacity"]) ctx.globalAlpha = opts["opacity"];
		else ctx.globalAlpha = $(c).css("opacity");

		if (opts["flip"]) ctx.translate(0, c.height);
		if (opts["flip"]) ctx.scale(1, -1);
		if (opts["flipv"]) ctx.translate(c.width, 0);
		if (opts["flipv"]) ctx.scale(-1, 1);

		callback(c, element);
		return c;

	} else if (typeof url === "object") {

		callback(url, element);
		return url;
	}

	//
	// Third case (default): Build an image/canvas from input
	const img = new Image();
	img.onload = function () {
		return callback(url, element);
	};
	img.onerror = function () {
		return callback2(url, element);
	};

	if (opts["canvas"]) {

		var c = (element && element.tagName == "CANVAS") ? element : document.createElement('canvas');
		img.onload = function () {

			var resolution = opts["resolution"] || 1;
			c.width = img.width * resolution;
			c.height = img.height * resolution;

			c = LoadRessource(c, opts, element); // Just apply filters here (without callbacks)
			var ctx = c.getContext('2d');
				ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, c.width, c.height);

			// Apply transparency
			if (opts["colorkey"]) {

				var surface = ctx.getImageData(0, 0, c.width, c.height);
				var color = hex2rgb(opts["colorkey"])
				for (var i = 0; i < surface.data.length; i += 4) {
					if(color[0] != surface.data[i  ]) continue;
					if(color[1] != surface.data[i+1]) continue;
					if(color[2] != surface.data[i+2]) continue;
					surface.data[i + 3] = 0;
				}
				ctx.putImageData(surface, 0, 0);
			}

			return callback(url, element);
		}

		img.src = url;
		return c;
	}

	img.src = url;
	return img;
}

function hasCSS(stylesheet, element) {
	var links = element.getElementsByTagName("link")[i];
	if (!links) return false;
	for (var i = 0; i < links.length; i++)
		if (links[i].rel == "stylesheet" && links[i] == stylesheet) return true;

	return false;
}


function uniqID(a = "", b = false) {
    const c = Date.now()/1000;
    let d = c.toString(16).split(".").join("");
    while(d.length < 14) d += "0";
    let e = "";
    if(b){
        e = ".";
        e += Math.round(Math.random()*100000000);
    }
    return (a.replace(/[^a-zA-Z0-9 ]/g, "_") + d + e);
}

var fadeScrollState = {};
function fadeScroll(uniqid, axis, fadeIn, thrIn, fadeOut, thrOut) {

	if(thrIn > thrOut) thrOut = thrIn;
	if(!fadeScrollState[uniqid]) fadeScrollState[uniqid] = -1;

	if(fadeScrollState[uniqid] < 0) {

		if(debug) console.log("Fade scroll ready for \""+uniqid+"\"");
		var scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;

		fadeScrollState[uniqid] = (scroll >= thrIn) ? 1 : 0;
		if(fadeScrollState[uniqid]) fadeIn();
	}

	$(window).scroll(function(){

		if(debug) console.log("Fade scroll state : "+ fadeScrollState[uniqid] + "; " + window.scrollY);
		var scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;
		if (!fadeScrollState[uniqid] && scroll >= thrIn) {

			setTimeout(function() {

				scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;
				if(scroll >= thrIn) {
					fadeScrollState[uniqid] = 1;
					fadeIn();
				}
			}, 500);

		} else if (fadeScrollState[uniqid] && scroll <= thrOut) {

			setTimeout(function() {

				scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;
				if(scroll <= thrOut) {
					fadeScrollState[uniqid] = 0;
					fadeOut();
				}
			}, 500);
		}
	});
}

function fov2focal(fov = Math.PI/2) {

	var tan = Math.tan(fov/2);
	if(tan) return 1/tan;

	return Infinity;
}


function focal2fov(focal = 1) {

	if(focal) return 2 * Math.atan(1/focal);
	return 0;
}

function parseLabelToPx(label, size = []) {

	// Check input
	if(typeof label === "string") label = label.split(" ");
	if (label.length != 2)
		throw new Error("Label must be an Array[2]");

	if(typeof size === "string") size = size.split(" ");
	if (size.length != 2)
				throw new Error("Size must be an Array[2]");

	// Swap XY labels if needed
	if(label[0] == "top" || label[0] == "bottom") {
		if(label[1] == "top" || label[1] == "bottom")
			throw new Error("Wrong usage of label, cannot distinguish xy-labels");
		label = [label[1], label[0]];
	}
	if(label[1] == "left" || label[1] == "right") {
		if(label[0] == "left" || label[0] == "right")
			throw new Error("Wrong usage of label, cannot distinguish xy-labels");
		label = [label[1], label[0]];
	}

	var xy = [0,0];
	if(typeof label[0] === "string") {

		if (label[0] == "left") xy[0] += 0; // Just for completeness.. LMFAO
		else if (label[0] == "center") xy[0] += size[0] / 2;
		else if (label[0] == "right") xy[0] += size[0];
		else throw new Error("Unexpected model label X.. " + label[0]);

	} else xy[0] = label[0];

	if(typeof label[1] === "string") {

		if (label[1] == "top") xy[1] += 0; // Just for completeness.. LMFAO
		else if (label[1] == "center") xy[1] += size[1] / 2;
		else if (label[1] == "bottom") xy[1] += size[1];
		else throw new Error("Unexpected model label Y.. " + label[1]);

	} else xy[1] = label[1];

	return xy;
}

function parseCssToJs(css, extra = null) {

	if(!css) return "";

	var js = parseFloat(css,10);
	var length = parseInt(js).toString().length;
	var suffix = css.substring(length,css.length);

	if(suffix == "%") {
		if(extra == "width") js *= document.documentElement.clientWidth/100;
		else if(extra == "height") js *= document.documentElement.clientHeight/100;
		else throw new Error("Need extra information to convert from % to pixel..");
	} else if(suffix == "em") {
		if(extra) js *= parseInt(extra);
		else js *= 16;
	} else if(suffix == "vh") {
		js *= document.documentElement.clientHeight/100;
	} else if(suffix == "vw") {
		js *= document.documentElement.clientWidth/100;
	}

	return js;
}

function isASCII(str, extended = false) {
	return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(str);
}

/*
 * Math & time functions
 */
function timestamp(t) {

	if (t == undefined || t < 0 || t != t) return -1;
	if (Number.isInteger(t)) return t;
	return 3600 * t.getHours() + 60 * t.getMinutes() + t.getSeconds();
}

function timestamp_str(t, format = 0) {

	if (t == undefined || t < 0 || t != t) {

		if (format == 1) return "??" + "h" + "??";
		else return "??:??:??";
	}

	var h = 0,
		m = 0,
		s = 0;
	if (Number.isInteger(t)) {

		s = t % 60;
		m = (t - s) % 3600 / 60;
		h = (t - 60 * m - s) / 3600;

	} else {

		h = t.getHours();
		m = t.getMinutes();
		s = t.getSeconds();
	}

	var h0 = (h < 10 ? "0" : ""),
		m0 = (m < 10 ? "0" : ""),
		s0 = (s < 10 ? "0" : "");
	if (format == 1)
		return h + "h" + m0 + m;
	else
		return h0 + h + ":" + m0 + m + ":" + s0 + s;
}

function mod(x, y) {
	if (!y) return 0;
	return x - y * Math.floor(x / y);
}

function isDict(v) {
	return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
}

function SortedKeys(v, prop = null) {

	if (!v || !v.length) return [];

	if (isDict(v)) return Object.keys(v).map(String).sort((a, b) => a - b);
	else if (Array.isArray(v)) {

		var indices = [];
		for (var i = 0; i < v.length; ++i)
			indices.push(i);

		// Special array dictionary sort
		if (prop) {

			if (v[0][prop] == null) throw new Error("Invalid property \"" + prop + "\" to sort the array provided. (e.g. " + v[0] + ")");
			return indices.sort(function (a, b) {
				return v[a][prop] - v[b][prop]
			});
		}

		// Std array sort
		return indices.sort(function (a, b) {
			return v[a] - v[b]
		});
	}

	throw new Error("Unexpected variable passed as argument", v);
}

function DeepClone(obj) {

	var copy = Array.isArray(obj) ? copy = obj.slice() :
		Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);

	for (var i in copy) {

		if (copy[i] == null || typeof copy[i] !== "object")
			continue;

		if (copy[i].tagName == "CANVAS") {

			var ccopy = document.createElement("canvas");
				ccopy.width  = copy[i].width;
				ccopy.height = copy[i].height;

			for (var j = 0; j < copy[i].attributes.length; j++) {

				var attr = copy[i].attributes[j];
				ccopy.setAttribute(attr.nodeName, attr.nodeValue);
			}

			if(ccopy.width*ccopy.height) {

				var cctx = ccopy.getContext('2d');
					cctx.drawImage(copy[i], 0, 0);
			}

			copy[i] = ccopy;

		} else {

			copy[i] = DeepClone(copy[i]);
		}
	}

	return copy;
}

//
// Implement min/max function for array
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

//
// GCP function for numbers and arrays
function gcd(a, b = null) {

	if (Array.isArray(a)) {

		var gcdres = gcd(a[0], a[1]);
		for (var i = 3; i < a.length; i++)
			gcdres = gcd(gcdres, a[i])

		return gcdres;

	}

	if(b == null) return a;

	a = Math.abs(a)
	b = Math.abs(b)
	while (a != b) {
		if (a > b) a -= b
		else b -= a
	}
	return a;
}


function Sort(v) {

	if(!v) return v;
	if (Array.isArray(v)) return v.sort();
	else if(isDict(v)) {

		var sorted = [];
		for(var key in v) {
			sorted[sorted.length] = key;
		}
		sorted.sort();

		var v2 = {};
		for(var i = 0; i < sorted.length; i++) {
			v2[sorted[i]] = v[sorted[i]];
		}

		return v2;
	}

	throw new Error("Unexpected variable passed as argument", v);
}

function uniqid(a = "", b = false) {
    const c = Date.now()/1000;
    let d = c.toString(16).split(".").join("");
    while(d.length < 14) d += "0";
    let e = "";
    if(b){
        e = ".";
        e += Math.round(Math.random()*100000000);
    }
    return a + d + e;
}

var fadeScrollState = {};
function fadeScroll(uniqid, axis, thrIn, thrOut, fadeIn, fadeOut) {

	if(!fadeScrollState[uniqid]) fadeScrollState[uniqid] = -1;

	if(fadeScrollState[uniqid] < 0) {

		if(debug) console.log("Fade scroll ready for \""+uniqid+"\"");
		var scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;

		fadeScrollState[uniqid] = (scroll >= thrIn) ? 1 : 0;
		if(fadeScrollState[uniqid]) fadeIn();
	}

	$(window).scroll(function(){

		if(debug) console.log("Fade scroll state : "+ fadeScrollState[uniqid] + "; " + window.scrollY);
		var scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;
		if (!fadeScrollState[uniqid] && scroll >= thrIn) {

			setTimeout(function() {

				scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;
				if(scroll >= thrIn) {
					fadeScrollState[uniqid] = 1;
					fadeIn();
				}
			}, 500);

		} else if (fadeScrollState[uniqid] && scroll <= thrOut) {

			setTimeout(function() {

				scroll = (axis == "Y" || axis == 1) ? window.scrollY : window.scrollX;
				if(scroll <= thrOut) {
					fadeScrollState[uniqid] = 0;
					fadeOut();
				}
			}, 500);
		}
	});
}
