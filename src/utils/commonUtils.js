
//deep clone array and objects
export const copyObj = ( o ) => {
    let output, v, key;
    output = Array.isArray( o ) ? [] : {};
    for ( key in o ) {
        v = o[ key ];
        output[ key ] = ( typeof v === 'object' && v !== null ) ?
            copyObj( v ) : ( typeof v === 'object' && v === null ) ? null : v;
    }
    return output;
};

export const convertToBooleanVal = ( val ) => {
    if ( ![ 'true', 'false' ].includes( val ) )
        return val;

    let boolVal;
    boolVal = val === 'true';
    return boolVal;
};

export const immutableSplice = ( arr, start, deleteCount, ...items ) => {
    return [ ...arr.slice( 0, start ), ...items, ...arr.slice( start + deleteCount ) ];
};

export const immutablePush = ( arr, newEntry ) => [ ...arr, newEntry ];

export const removeOrPushInArr = ( arr, value ) => {
    !arr.includes( value ) ?
        arr.push( value ) :
        arr.splice( arr.indexOf( value ), 1 );
};

export const getCookie = ( name ) => {
    let matches = document.cookie.match( new RegExp(
        '(?:^|; )' + name.replace( /([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1' ) + '=([^;]*)'
    ) );
    return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
};

export const getHashCode = function ( text ) {
    var hash = 0, i, char;
    if ( text.length == 0 ) return hash;
    var l = text.length;
    for ( i = 0; i < l; i++ ) {
        char = text.charCodeAt( i );
        hash = ( ( hash << 5 ) - hash ) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const getRandomLetters = ( numOfLetters ) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for ( var i = 0; i < numOfLetters; i++ )
        text += possible.charAt( Math.floor( Math.random() * possible.length ) );

    return text;
};

export const getRandomDigits = function ( numOfDigits ) {
    return Math.floor( Math.pow( 10, numOfDigits - 1 ) + Math.random() * ( Math.pow( 10, numOfDigits ) - Math.pow( 10, numOfDigits - 1 ) - 1 ) );
};