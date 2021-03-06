import {_} from 'lodash';


export const fromRoot = ( path, selector ) => ( state, ...args ) => path ? selector( _.get( state, path ), ...args ) : selector(state);

export const globalizeSelectors = ( selectors, path ) => {
    return Object.keys( selectors ).reduce( ( final, key ) => {
        final[ key ] = fromRoot( path, selectors[ key ] );
        return final;
    }, {} );
};