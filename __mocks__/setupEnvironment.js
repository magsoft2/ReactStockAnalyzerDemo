// setup test environment for jest and jsdom to 
// allow code like window.location.href = '/'
 
// # setupEnvironment.js
const JSDOMEnvironment = require('jest-environment-jsdom');
 
module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
   constructor(config) {
      super(config);
 
      this.global.jsdom = this.dom;
      this.originalEnv = Object.assign({}, process.env);
      process.env.SUPPRESS_NO_CONFIG_WARNING = true;
   }
 
   teardown() {
      this.global.jsdom = null;
      process.env = this.originalEnv;
 
      return super.teardown();
   }
};