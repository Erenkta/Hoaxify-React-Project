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

export const getUserByUsername = username => {
  return axios.get(`/api/1.0/users/${username}`)
}

export const updateUser = (username, body) => {
  return axios.put(`/api/1.0/users/${username}`, body)
}

export const postHoax = hoax => {
  return axios.post('/api/1.0/hoaxes', hoax)
}

export const getHoaxes = (username, currentPage = 0) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/?currentPage=${currentPage}` : `/api/1.0/hoaxes/?currentPage=${currentPage}`
  return axios.get(path)
}
export const getOldHoaxes = (id, username) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/${id}` : `/api/1.0/hoaxes/${id}`
  return axios.get(path)
}
export const getNewHoaxes = (id, username) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/${id}?direction=after` : `/api/1.0/hoaxes/${id}?direction=after`
  return axios.get(path)
}


export const getNewHoaxCount = (id, username) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/${id}?count=true` : `/api/1.0/hoaxes/${id}?count=true`
  return axios.get(path);
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
