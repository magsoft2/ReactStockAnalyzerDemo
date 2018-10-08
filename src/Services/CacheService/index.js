

class CacheServiceClass {

    cache = {}

    constructor() {
    }

    getOrAdd = function* (key, getter) {
        let obj = this.cache[key];
    
        if (obj) {

            return obj.value;
        } else {

            const value = yield* getter();

            this.cache[key] = {
                value,
                timeStamp: new Date()
            };
            
            return value;
        }
    }

    clearCache = () => {
        this.cache = {};
    }
    
}


export const CacheService = new CacheServiceClass();