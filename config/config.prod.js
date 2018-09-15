import mainConfig from './config.common';

const CONFIG = {
    ...mainConfig.default,
    test: "test prod",
    showDevFeatures: false,
    baseApiUrl: 'www.ru'
};

export default CONFIG;