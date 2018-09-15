import axios from "axios";
import CONFIG from 'config';

const BASE_URL = CONFIG.baseApiUrl;


const abort = (requestID) => {
    return axios.abort(requestID);
};

// @TODO Передавать язык в запросах
export const tuiApiInstance = (config = {}) => {
    const token = window.localStorage.getItem('token');

    if(!token){
        // alert('Обновите страницу');
        // window.location.reload();
        // what should we do???
    }


    config = {
        baseURL: config.baseURL || BASE_URL,
        headers:{
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
        },
        transformResponse: apiTransformResponse,
        ...config,
    };

    if (config.cors)
        // Request header field X-Requested-With is not allowed by Access-Control-Allow-Headers in preflight response.
        delete config.headers["X-Requested-With"];

    let apiInstance = axios.create(config);

    apiInstance.interceptors.response.use((res) => {
        return res;
    }, (err) => {
        if([401,403].includes(err.response.status)){
            console.error('401 or 403 error happened');
        }
        return err;
    });


    return apiInstance;
};
