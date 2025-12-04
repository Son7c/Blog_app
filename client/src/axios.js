import axios from "axios";

const API=axios.create({
    baseURL:import.meta.env.VITE_API_URL||"http://localhost:8000/api/v1",
});

API.interceptors.request.use(
    (config)=>{
        try{
            const userStr=localStorage.getItem("user");
            if(userStr){
                const user=JSON.parse(userStr);
                if(user&&user.token){
                    config.headers.Authorization=`Bearer ${user.token}`;
                }
            }
        }catch(err){
            console.error("Error parsing user from localStorage",err);
            localStorage.removeItem("user");
        }
        return config;
    },
    (error)=>{
        console.error("Request interceptor error:",error);
        return Promise.reject(error);
    },
);

API.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response){
            console.error("API Error:",error.response.status,error.response.data);
            console.error(
                "Request was:",
                error.config.method.toUpperCase(),
                error.config.url,
            );
            if(error.response.status===401){
                localStorage.removeItem("user");
                if(window.location.pathname!=="/login"){
                    window.location.href="/login";
                }
            }
        }else if(error.request){
            console.error("Network Error:No response from server");
            console.error("Request was:",
                error.config?.method?.toUpperCase(),
                error.config?.url,
            );
        }else{
            console.error("Error:",error.message);
        }
        return Promise.reject(error);
    }
)

export default API;