import axios from 'axios'

const HTTP = axios.create({
    transformRequest: [
        function (data, headers) {
          headers['Content-Type'] = 'application/json';
          if (data instanceof FormData) {
            return data;
          }
          return JSON.stringify(data);
        },
      ],
})
HTTP.interceptors.request.use(config => {
    config.baseURL = process.env.REACT_APP_URL_API
    config.headers = {
        'Authorization': localStorage.getItem('diskordToken'),
    }
    return config;
  },
  error => { Promise.reject(error) }
)

export const signIn = (data) => HTTP.post('/signin', data)
export const register = (data) => HTTP.post('/register', data)
export const getChannelData = (id) => HTTP.get(`/channel`, {params: {id}})
export const sendMessage = (id, ...config) => HTTP.post(`/channel/${id}/message`, ...config)
export const getMessage = (id, config) => HTTP.get(`/channel/${id}/message`, config)
export const getUser = (id) => HTTP.get(`/user/${id}`)