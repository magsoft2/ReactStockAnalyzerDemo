

class LogServiceClass {

    constructor() {
    }


    log = (...args) => {
        console.log(args);
    };

    error = (args) => {
        console.error(args);
    };

    
}

export const LogService = new LogServiceClass();