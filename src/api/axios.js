import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ecommerce-website-backend-1-u1zz.onrender.com/api',
    withCredentials: true // Important for cookies
});

export default instance;
