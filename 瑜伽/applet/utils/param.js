/**
 * Created by shining on 2017/7/3.
 */
var getProto = Object.getPrototypeOf;
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var fnToString = hasOwn.toString;
var ObjectFunctionString = fnToString.call( Object );

var rbracket = /\[\]$/;


function typeData( obj ) {
  if ( obj == null ) {
    return obj + "";
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === "object" || typeof obj === "function" ?
      class2type[ toString.call( obj ) ] || "object" :
      typeof obj;
}

function isArrayLike( obj ) {

  // Support: real iOS 8.2 only (not reproducible in simulator)
  // `in` check used to prevent JIT error (gh-2145)
  // hasOwn isn't used here due to false negatives
  // regarding Nodelist length in IE
  var length = !!obj && "length" in obj && obj.length,
      type = typeData( obj );

  if ( type === "function" || isWindow( obj ) ) {
    return false;
  }

  return type === "array" || length === 0 ||
      typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

function isWindow( obj ) {
  return obj != null && obj === obj.window;
}

function each( obj, callback ) {
  var length, i = 0;

  if ( isArrayLike( obj ) ) {
    length = obj.length;
    for ( ; i < length; i++ ) {
      if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
        break;
      }
    }
  } else {
    for ( i in obj ) {
      if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
        break;
      }
    }
  }

  return obj;
}


function buildParams( prefix, obj, traditional, add ) {
  var name;

  if ( Array.isArray( obj ) ) {

    // Serialize array item.
    each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {

        // Treat each array item as a scalar.
        add( prefix, v );

      } else {

        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
            prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
            v,
            traditional,
            add
        );
      }
    } );

  } else if ( !traditional && typeData( obj ) === "object" ) {

    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {

    // Serialize scalar item.
    add( prefix, obj );
  }
}

function isFunction(obj) {
  return typeData( obj ) === "function"
}

function isPlainObject(obj) {
  var proto, Ctor;

  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    return false;
  }

  proto = getProto( obj );

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if ( !proto ) {
    return true;
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
  return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
}

function param(a, traditional) {
  var prefix,
      s = [],
      add = function( key, valueOrFunction ) {

        // If value is a function, invoke it and use its return value
        var value = isFunction( valueOrFunction ) ?
            valueOrFunction() :
            valueOrFunction;

        s[ s.length ] = encodeURIComponent( key ) + "=" +
            encodeURIComponent( value == null ? "" : value );
      };

  // If an array was passed in, assume that it is an array of form elements.
  if ( Array.isArray( a ) || ( a && !isPlainObject( a ) ) ) {

    // Serialize the form elements
    each( a, function() {
      add( this.name, this.value );
    } );

  } else {

    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" );
}

export {
  param
}