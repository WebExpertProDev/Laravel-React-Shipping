

export const environment = {
    production: false,
    hmr       : false,
    backendBaseUrl: 'http://local.test.com:8000',
    oAuthClientID: 2,
    oAuthClientSecret: 'lkWAV8lgCd5k2FoO6MKl4pU5jzvzD3615HpTmKrh'
};

export const headerWithToken = (token) => {
    return {
        headers: {
            'Content-Type': 'application/vnd.api.v1+json',
            'Authorization' : `Bearer ${token}`
        }
    }
};