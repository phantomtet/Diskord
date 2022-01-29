import axios from 'axios'

export const signIn = (data) => axios.post('http://localhost:9999/signin', data)