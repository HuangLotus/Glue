var Global = this;
var Glue = {
	name: "Glue",
	version:"1.0.0"
};
var Util = (function () {
	var   uid = ['0','0','0','0']
		, class2type = {}
		, core_toString = class2type.toString
		, core_hasOwn = class2type.hasOwnProperty
		, core_concat = uid.concat
		, core_push = uid.push
		, core_slice = uid.slice
		, core_splice = uid.splice
		, core_shift = uid.shift
		, core_pop = uid.pop
		, core_indexOf = uid.indexOf
		, core_trim = Glue.version.trim
		, core_type = [
			"Boolean",
			"Number",
			"String",
			"Function",
			"Array",
			"RegExp",
			"Date",
			"Object",
			"Error"
		]
		, ret = {
			name: "Util",
			version: "1.0.0"
		};
	core_type.forEach(function extendClass2type(typeName) {
		var name = typeName.toLowerCase();
		class2type["[object "+typeName+"]"] = name;
		ret['is'+typeName] = function (o) {
			return type(o) === name;
		};
	}, this);

	ret.extend = extend;

	return extend(ret, {
		extend: extend,
		guid: guid,
		isDiff: isDiff,
		forEach: forEach,
		map:map,
		filter: filter,
		type: type,
		isWindow: isWindow,
		isNumeric: isNumeric,
		isPlainObject: isPlainObject,
		isEmptyObject: isEmptyObject,
		isInt: isInt,
		slice: slice,
		splice: splice,
		shift: shift,
		pop: pop,
		unshift: unshift,
		push: push,
		proxy: proxy,
		Error: ThrowError,
		now: now
	});
	function now () {
		return new Date;
	}
	function ThrowError () {
		
	}
	function proxy (target, binder) {
		return function () {
			target.apply(binder || target.scope, arguments);
		};
	}
	function slice (o, f, t) {
		if (isArrayLike(o)) {
			return core_slice.call(o, f, t);
		}
	}
	function splice (o, f, l) {
		if (isArrayLike(o)) {
			return core_splice.call(o, f, l);
		}
	}
	function shift (o) {
		if (isArrayLike(o)) {
			return core_shift.call(o);
		}
	}
	function unshift (o, i) {
		if (isArrayLike(o)) {
			return core_unshift.call(o, i);
		}
	}
	function pop (o) {
		if (isArrayLike(o)) {
			return core_pop.call(o, i);
		}
	}
	function push (o, i) {
		if (isArrayLike(o)) {
			return core_push.call(o, i);
		}
	}
	function isArrayLike (obj) {
		var length = obj.length,
			t = type(obj);

		if ( isWindow( obj ) ) {
			return false;
		}

		if ( obj.nodeType === 1 && length ) {
			return true;
		}

		return t === "array" || t !== "function" &&
			( length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj );
	}
	/**
	 * [diff ]
	 * @param  {*} a [description]
	 * @param  {*} b [description]
	 * @return {Boolean}   [description]
	 */
	function isDiff (a, b) {
			// a is b or is NaN not diff
		if (a === b || (isNaN(a) && isNaN(b))) {
			return false;
		}
		// except Error and Object also an Date
		var strDiff = core_type.slice(0, -2).join(" ").toLowerCase();
		var aType = type(a);
		var bType = type(b);
		// well the type is not equal got diff
		if (aType !== bType) {
			return true;
		}
		// when got an date diff with ms
		if (aType === 'date') {
			return +a !== +b;
		}
		// both source of this is varible check the source 
		// also String Number RegExp Boolean Function Array
		if (strDiff.indexOf(aType) !== -1) {
			return a.toString() !== b.toString();
		}
		var akeys = Object.keys(a);
		var bkeys = Object.keys(b);
		if (diff(akeys, bkeys)) {
			return true;
		} else {
			for(var i = 0, l = akeys.length, key; i < l; i++) {
				key = akeys[i];
				if (diff(a[key], b[key])) {
					return true;
				}
			}
			return false;
		}
	};
	/**
	 * [forEach for loop]
	 * @method forEach
	 * @param  {[type]} target [description]
	 * @param  {[type]} handle [description]
	 * @param  {[type]} binder [description]
	 * @return {[type]}        [description]
	 */
	function forEach (target, handle, binder) {
		if (!target){return;}
		if (target.forEach) {
			return target.forEach(handle, binder);
		}
		var args = core_slice.call(arguments);
		target = args.shift();
		handle = args.shift();
		binder = args.shift();
		var keys = Object.keys(target);
		keys.forEach(function (key) {
			var val = target[key];
			var arg = [val, key].concat(args);
			handle.apply(binder || val, arg);
		});
	};
	function map (target, handle, binder) {
		if (target.map) {
			return target.map(handle, binder);
		}
		// this must be an Object;
		forEach(target, function _handle(item, key) {
			target[key] = handle.call(this || item, item, key);
		}, binder);
		return target;
	};
	function filter (target, handle, binder) {
		if (target.filter) {
			return target.filter(handle, binder);
		}
		forEach(target, function _handle (item, key) {
			if (!handle.call(this || item, item, key)) {
				target[key] = null;
				try {delete target[key];} catch(e){};
			}
		}, binder);
		return ret;
	};
	/**
	 * [type description]
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	function type (obj) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	};

	function isWindow (obj) {
		return obj != null && obj === obj.window;
	};
	function isNumeric (obj) {
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	};
	function isPlainObject (obj) {
		if (type(obj) !== "object" || 
			obj.nodeType || 
			isWindow(obj)) {
			return false;
		}
		try {
			if (obj.constructor &&
					!core_hasOwn.call( 
						obj.constructor.prototype, 
						"isPrototypeOf"
					)
				) {
				return false;
			}
		} catch (e) {
			return false;
		}
		return true;
	};
	function isEmptyObject (obj) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	};
	function isInt (n) {
		return n % 1 === 0;
	};
	/**
	 * [guid create an guid]
	 * @return {[type]} [description]
	 */
	function guid () {
		var index = uid.length;
		var digit;

		while(index) {
			index--;
				digit = uid[index].charCodeAt(0);
			if (digit == 57 /*'9'*/) {
				uid[index] = 'A';
				return uid.join('');
			}
			if (digit == 90  /*'Z'*/) {
				uid[index] = '0';
			} else {
				uid[index] = String.fromCharCode(digit + 1);
				return uid.join('');
			}
		}
		uid.unshift('0');
		return uid.join('');
	}

	function extend () {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = ret.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && ret.isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};
})();

var Class = (function (U) {
	/**
	 * [mix  create an es5 object use the defineProperty API];
	 * @param  {[Object or Function]} target  [the target we want to build]
	 * @param  {[Object]} members [members for this target]
	 * @return {[Object]}         [return the target]
	 */
	function mix (target, members, shallow) {
		var tag = '_';
		var tags = '__';
		// get keys for each;
		var keys = Object.keys(members);
		keys.forEach(function (key) {
			var value = {};
			var val = members[key];
			var name = key;
			value.configurable = key.substr(0, 1) !== tag;
			value.writable = key.substr(0, 2) !== tags;
			value.enumerable = key.substr(-2) !== tags;
			if (!value.configurable) {
				name = name.substr(1);
			};
			if (!value.writable) {
				name = name.substr(1);
			}
			if (!value.enumerable) {
				name = name.substr(0, name.length - 2);
			}
			if (U.isPlainObject(val)) {
				if (val.$get && val.$set) {
					value.get = val.$get;
					value.set = val.$set;
					// an get set can't with an writable 
					// #issue_0 
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
					delete value.writable;
				} else if (!shallow) {
					value.value = mix({}, val);
				} else {
					value.value = U.extend(true, {}, val);
				}
			} else {
				value.value = val;
			}
			Object.defineProperty(target, name, value);
		});
		if (!shallow) {
			mix(target, {
				"____$$members____": members
			}, "$$members");
		}
		return target;
	}
	function define(constructor, members) {
		function GlueClass() {
			return this.$init.apply(this, arguments);
		}
		if (!members) {
			members = constructor;
			constructor = null;
		}
		// got an members
		if (U.isPlainObject(members)) {
			// got an constructor use this constructor for init notice the init must
			if (U.isFunction(constructor)) {
				members.__$init__ = (function (phase) {
					return function $init() {
						phase.apply(this, arguments);
						return this;
					};
				}(constructor));
			} else {
				members.__$init__ = members.__$init__ || function () {
					return this;
				};
			}
			constructor = GlueClass;
		} else {
			ThrowError("$Class Error: members is not an plain object got {0}", members);
		}
		mix(constructor.prototype, members);
		return constructor;
	};
	function inherit(Supper, constructor, members) {
		var construct;
		if (!members) {
			members = constructor;
			constructor = null;
		}
		// this is an Dawn Class
		// @exmple
		//  A = C.define({a:1});
		//  C.inherit(new A, {});
		//  C.inherit(A, {});
		if (Supper.name === 'GlueClass') {
			Supper = new Supper;
			members = U.extend({}, Supper.__$$members__, members);
			construct = U.isFunction(constructor) ? function construct() {
				Supper.$init.apply(this, arguments);
				constructor.apply(this, arguments);
				return this;
			} : function construct() {
				Supper.$init.apply(this, arguments);
				return this;
			};
		} else {
			U.Error("Can't using an unknown Class {0} as Supper", Supper);
		}
		return define(construct, members);
	};
	return {
		define: define,
		mix: mix,
		inherit: inherit
	};
})(Util);
var NameSpace = (function (U, C) {
	function inherit(parent, name, prop, members) {
		var current = parent;
		var nameSpace = name.split(".");
		for(var i = 0, len = nameSpace.length; i < len; ++i) {
			name = nameSpace[i];
			if(!current[name]) {
				current[name] = {};
			}
			if(-~i === len) {
				if (prop) {
					current[name] = C.define(prop);
				}
				if (members) {
					if (U.isPlainObject(members)) {
						current[name] = C.mix(current[name], members);
					} else {
						current[name] = members;
					}
				}
			}
			current = current[name];
		};
		return current;
	};

	function define (name, prop, members) {
		return inherit(Global, name, prop, members);
	};

	function mix (Supper, name, prop, members) {
		
	};
	function extend (Supper, name, prop, members) {
		// body...
	};
	return {
		define: define,
		mix: mix,
		inherit: inherit
	};
})(Util, Class);

var Cache = Class.define({
	__$init__: function () {
		Class.mix(this, {
			__$$handleId__: "Cache"+ (+Util.now()),
			_$$cache__: {}
		}, "$init");
	},
	__$get__: function (evt) {
		return this.$provide(evt);
	},
	__$set__: function (evt, val) {
		return this.$provide(evt, val);
	},
	__$del__: function (evt, leave) {
		return this.$provide(evt, null, !!leave);
	},
	__$checkProvides__: function (handles, name, handle, leave) {
		switch (handle) {
			case null:
				if (!leave) {
					Util.forEach(handles, function (h,n) {
						handles[n]=null;
						delete handles[n];
					});
				} else {
					handles[this.$$handleId] = null;
					delete handles[this.$$handleId];
				}
				return this;
			break;
			case undefined:
				return Util.proxy(function () {
					var args = arguments;
					Util.forEach(handles, function (handle, name) {
						if (name !== this.$$handleId) {
							handle = this.$checkProvides(handle, name);
						}
						handle.apply(this, args);
					}, this);
				}, this);
			break;
			default:
				handles[this.$$handleId] = handle;
				return this;
			break;
		}
	},
	__$provide__: function (evt, handle, leave) {
		if (!evt || !Util.isString(evt)) {
			ThrowError("$Emitter Error: $$provide can't using an type with {0} for event", type(evt));
		}
		var nameSpace = evt.split('.');
		var handles = this.$$cache;
		while(nameSpace.length && (name = nameSpace.shift())) {
			handles = handles[name] = handles[name] || {};
		}
		return this.$checkProvides(handles, name, handle, leave);
	}
});

var Emitter = Class.inherit(Cache, {
	__$on__: function (evt, handle, binder) {
		var self = this;
		if (Util.isPlainObject(evt)) {
			Util.forEach(evt, function (handle, evt) {
				this.$on(evt, handle, binder);
			}, this);
		} else {
			this.$provide(evt, function EventHandler() {
				var args = [
					{
						event:"Emitter"
					}
				].concat(Util.slice(arguments));
				handle.apply(binder || self, args);
			});
		}
		return this;
	},
	__$off__: function (evt, leave) {
		return this.$del(evt, leave);
	},
	__$one__: function (evt, handle, binder) {
		this.$on(evt, function () {
			handle.apply(binder, arguments);
			this.$del(evt);
		}, this);
		return this;
	},
	/**
	 * [fire event]
	 * @method fire
	 * @param  {[type]} evt  [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	__$fire__: function (evt, data) {
		if (Util.isPlainObject(evt)) {
			UtilforEach(evt, function (data, evt) {
				this.$fire(evt, data);
			}, this);
		} else {
			var handle = this.$provide(evt);
			if (Util.isFunction(handle)) {
				handle(data);
			} else {
				Util.Error("$Emitter Error: handle is not a function, got {0}", handle);
			}
		}
	}
});
var Data = (function (U, C) {
	var data = new Cache;
	console.dir(data);
	return function (e, n, v) {
		
	}
})(Util, Class);
var Template = Class.define({

});
var Expression = Class.inherit(Template, {

});
var Scope = Class.inherit(Emitter, {
	__$init__: function () {
		Class.mix(this, {
			// no del no enum writable
			_$$id__: Util.guid(),
			// no del no enum writable
			_this__: this,
			// no del no enum writable
			_$$root__: this,
			// has destroyed ?
			_$$destroyed__: false,
			// the parent's scope
			_$$parent__: null,
			// the prev sibling's scope
			_$$prevSibling: null,
			// the next sibling's scope
			_$$nextSibling: null,
			// the first child scope
			_$$childHead: null,
			// the last child scope
			_$$childTail: null,
			// the phase for the tmp
			_$$phase__: null,
			// the depends queue
			_$$asyncQueue: []
		}, "$$init");
	},
	__$watch__: function (prop, handle) {
		var oldVal = this[prop];
		var newVal = oldVal;
		var members = {};
		members[prop] = {
			$get: function () {
				return newVal;
			},
			$set: function (val) {
				oldVal = newVal;
				newVal = val;
				if (Util.isDiff(oldVal, val)) {
					handle(newVal);
				}
			}
		};
		if (delete this[prop]) {
			Util.mix(this, members, "$$watch");
		} else {
			ThrowError("$$watch Error: can't watch an {configurable: false} value");
		}
		return this;
	},
	__$unwatch__: function (prop) {
		var val = this[prop];
		delete this[prop];
		this[prop] = val;
		return this;
	},
	__$new__: function (isolate) {
		// not inherit from the top scope 
		// also in directive include repeat 
		var Child,
			child;

		if (isolate) {
			child = new Scope();
			child.$$root = this.$$root;
			// ensure that there is just one async queue per $rootScope and it's children
			child.$$asyncQueue = this.$$asyncQueue;
		} else {
			Child = function() {}; 
			// should be anonymous; This is so that when the minifier munges
			// the name it does not become random set of chars. These will then show up as class
			// name in the debugger.
			Child.prototype = this;
			child = new Child();
			child.$$id = Util.guid();
		}
		child['this'] = child;
		child.$$parent = this;
		child.$$nextSibling = child.$$childHead = child.$$childTail = null;
		child.$$prevSibling = this.$$childTail;
		if (this.$$childHead) {
			this.$$childTail.$$nextSibling = child;
			this.$$childTail = child;
		} else {
			this.$$childHead = this.$$childTail = child;
		}
		return child;
	},
	__$eval__: function () {

	},
	__$digest__: function () {

	}
});



/**
 * [duplicate string]
 * @param  {[Number]} size [length need to return]
 * @param  {[String]} str  [duplicate string exp default is '0']
 * @return {[String]}      [the duplicate string]
 */
function duplicate (size, str) {
	return Array(++size < 0 ? 0 : size).join(str||'0');
}
/**
 * [fixLengthWithDuplicate description]
 * @param  {[String]} source [description]
 * @param  {[Number]} len    [description]
 * @param  {[String]} str    [description]
 * @return {[String]}        [description]
 */
function fixLengthWithDuplicate (source, len, str) {
	return duplicate(len - source.length, str) + source;
}




//TEST 
NameSpace.define("Dawn", {
$b:3
}, {
$a:1
});

scope = new Scope;
scope.$on("click.show", function (e) {
	console.log(e,'show fired');
});
scope.$on("click.hide", function (e) {
    console.log(e, "hide fired");
});

scope.$on('click.show.menu', function (e) {
	console.log(e, "show menu fired");
});
scope.$off("click.show");
scope.$fire("click.hide");
scope.$fire("click");
scope.$fire("click.show");
console.log(scope);