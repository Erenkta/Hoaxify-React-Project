import axios from 'axios';

export const signup = body => {
  return axios.post('/api/1.0/users', body);
};

export const login = creds => {
  return axios.post('/api/1.0/auth', {}, { auth: creds });
};

export const getUsers = (page = 0, size = 3) => {
  return axios.get(`/api/1.0/users?currentPage=${page}&pageSize=${size}`) // bir body belirtmeye gerek yok
}

export const changeLanguage = language => {
  axios.defaults.headers['accept-language'] = language;
};

export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
  if (isLoggedIn) {
    const authorizationHeaderValue = `Basic ${btoa(username + ':' + password)}` //Base 64 haline çevirdik
    axios.defaults.headers['Authorization'] = authorizationHeaderValue
  } else {
    delete axios.defaults.headers['Authorization']
  }

}
