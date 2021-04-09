const fetch = require('node-fetch')
const endpoints = require('./endpoint');
let urlencoded = new URLSearchParams();

const authOptions = (body, type = 'application/json') => {
    return {
        retry: 5,
        pause: 5000,
        method: 'POST',
        headers: {
            'x-client-version': 'ReactNative/JsCore/7.7.0/FirebaseCore-web',
            'content-type': type,
            accept: '*/*',
            'accept-encoding': 'gzip',
            'user-agent': 'okhttp/3.12.1'
        },
        body: body
    }
}

const login = (email, password) => new Promise((resolve, reject) =>
    fetch(endpoints.createAuthUri(), authOptions(`{"identifier":"${email}","continueUri":"http://localhost"}`))
    .then((response) => response.json())
    .then((response) => {
        if (response) return fetch(endpoints.verifyPassword(), authOptions(`{"email":"${email}","password":"${password}","returnSecureToken":true}`))
    })
    .then(response => response.json())
    .then(response => {
        if (response) return resolve(response)
    })
    .catch((err) => reject(err))
);

const getAccInfo = (auth) => new Promise((resolve, reject) =>
    fetch(endpoints.getAccountInfo(), authOptions(`{"idToken": "${auth}"}`))
    .then((response) => response.json())
    .then((response) => {
        if (response) return resolve(response) 
    })
    .catch((err) => reject(err))
);


const refreshToken = (refreshToken) => new Promise((resolve, reject) => {
    
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("refresh_token", refreshToken);
    return fetch(endpoints.refreshToken(), authOptions(urlencoded, 'application/x-www-form-urlencoded'))
        .then((response) => response.json())
        .then((response) => {
            if (response) return resolve(response)
        })
        .catch((err) => reject(err))
});

const portalOptions = (auth, body) => {
    return {
        retry: 5,
        pause: 5000,
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          'accept-encoding': 'gzip',
          'user-agent': 'okhttp/3.12.1',
          Authorization: `Bearer ${auth}`
        },
        body: body
      }
}

const getUser = (auth) => new Promise((resolve, reject) =>
    fetch(endpoints.basePackagePortal(), portalOptions(auth, '{"query":"{\n  users {\n    id\n    first_name\n    last_name\n    wallet_address\n  }\n}\n"}'))
    .then((response) => response.json())
    .then((response) => {
        if (response.hasOwnProperty('data')) return resolve(response.data.users[0])
    })
    .catch((err) => reject(err))
);

const getTN = (auth) => new Promise((resolve, reject) =>
    fetch(endpoints.basePackagePortal(), portalOptions(auth, '{"query":"{\n  scans {\n    batch_uuid\n    created_at\n    id\n    tracking_number\n    tracking_numbers {\n      result\n    }\n  }\n}\n"}'))
    .then((response) => response.json())
    .then((response) => {
        if (response.hasOwnProperty('data') && response.data.scans.length >= 1) return resolve(response.data.scans)
    })
    .catch((err) => reject(err))
);

const getTrx = (wallet) => new Promise((resolve, reject) =>
    fetch(endpoints.transactions(wallet), {
        headers: {
            accept: '*/*',
            "Origin": "https://viewblock.io",
            "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
        }
    })
    .then((response) => response.json())
    .then((response) => {
        if (response.hasOwnProperty("docs") && response.hasOwnProperty("tokens")) resolve(response)
    })
    .catch((err) => reject(err))
);

// (async () => {
// })()

module.exports = {
    getAccInfo: getAccInfo,
    login: login,
    refreshToken: refreshToken,
    getUser: getUser,
    getTN: getTN,
    getTrx: getTrx,
}