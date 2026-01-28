import axios from 'axios';

// another libs

// auth store

const apiURL = process.env.NEXT_PUBLIC_SERVER_API_URL;

const axiosInterceptor = axios.create({
    baseURL: apiURL,
    // withCredentials: true // setup cors policies if need to send cookies
})

axiosInterceptor.interceptors.request.use(async (config) => {
    // check if the current session is a valid one,
    // if valid, insert authorization header to the request
    // if not, update the session and add new token to authorization header
    // if (!useAuthStore.getState().session?.access_token) await useAuthStore.getState().fetchSession(); // fetch sessio jika tidak ada token aktif
    // get access token from supabase session

    // config.headers.withCredentials = true; // insert access token from session store for request
    return config;
})


export default axiosInterceptor;