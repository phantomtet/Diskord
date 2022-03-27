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
  return {status: response.status, a: '12'}
};

const responseErrorHandler = error => {
  // eslint-disable-next-line eqeqeq
  if (error == 'Error: Network Error') {
    return {message: 'Could not connect to server, please try again later'}
  } else {
    if (error.response?.status === 401 || error.response?.status === 403 ) {
      return {message: error.response?.data.message}
    } else if (error.response?.status === 422) {
      return {message: Object.values(error.response.data)[0][0] }
    }
    else {
      // return Promise.reject(error)
      return {message: error.response?.data?.message, status: error.response?.status}
    }
  }
}

HTTP.interceptors.response.use(
  response => response,
  error => responseErrorHandler(error)
);

export const signIn = (data) => HTTP.post('/signin', data)
export const register = (data) => HTTP.post('/register', data)
export const getChannelData = (id) => HTTP.get(`/channel`, {params: {id}})
export const sendMessage = (id, ...config) => HTTP.post(`/channel/${id}/message`, ...config)
export const getMessage = (id, config) => HTTP.get(`/channel/${id}/message`, config)
export const getUser = (id) => HTTP.get(`/user/${id}`)
export const getMe = () => HTTP.get('/@me')
export const sendFriendRequestTo = (id, ...config) => HTTP.put(`/@me/relationship/${id}`, ...config)
export const deleteRelationship = (id) => HTTP.delete(`/@me/relationship/${id}`)