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
const responseSuccessHandler = response => {
  return {status: response.status, message: response?.data?.message, data: response?.data}
};

const responseErrorHandler = error => {
  if (error == 'Error: Network Error') {
    return {message: 'Could not connect to server, please try again later'}
  } 
  return {message: error.response?.data?.message, status: error.response?.status}

}

HTTP.interceptors.response.use(
  response => responseSuccessHandler(response),
  error => responseErrorHandler(error)
);

export const signIn = (data) => HTTP.post('/signin', data)
export const register = (data) => HTTP.post('/register', data)
export const getChannelData = (id) => HTTP.get(`/channel`, {params: {id}})
export const createDM = (data, config) => HTTP.post('/channel', data, config)
export const deleteDM = (id, config) => HTTP.delete(`/channel/${id}`, config)
export const editChannel = (id, data, config) => HTTP.patch(`channel/${id}`, data, config)
export const sendMessage = (id, ...config) => HTTP.post(`/channel/${id}/message`, ...config)
export const getMessage = (id, config) => HTTP.get(`/channel/${id}/message`, config)
export const getUser = (id) => HTTP.get(`/user/${id}`)
export const getMe = () => HTTP.get('/@me')
export const sendFriendRequestTo = (...config) => HTTP.put(`/@me/relationship`, ...config)
export const deleteRelationship = (id) => HTTP.delete(`/@me/relationship/${id}`)
export const seenChannel = (id) => HTTP.put(`/channel/${id}/seen`)
export const updateUserInfo = (data, config) => HTTP.patch('/@me', data, config)
export const updateAvatar = (data, config) => HTTP.patch('/@me/avatar', data, config)
export const createCall = (id, data, config) => HTTP.post(`/channel/${id}/call`, data, config)