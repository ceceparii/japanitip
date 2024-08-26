import axios from "axios";

const axiosIntelence = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
    withCredentials: true,
});

axiosIntelence.interceptors.request.use(
    function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;

        return config;
    },
    function (error) {
        console.error(error.message);
        return error
    }
);

axiosIntelence.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (error.respone?.status === 401) {
            console.log('Authorizationd failed')
            const  data = await axiosIntelence.get('/api/auth/token')
            if(data.accessToken) {
                localStorage.setItem('auth', data.accessToken)
                window.location.reload()
            }
        }
        return error.response;
    }
);

export default axiosIntelence;
