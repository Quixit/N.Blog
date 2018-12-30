import config from '../config.json';

class ApiClient {
  constructor() {
    let token = localStorage.getItem('ApiClient.access_token');

    if (token != null)
    {
      this.user = {
        access_token : token,
        refresh_token : localStorage.getItem('ApiClient.refresh_token'),
        expires : Number(localStorage.getItem('ApiClient.expires'))
      };
    }
    else {
      this.user = null;
    }
  }
  login(username, password) {

    let options = {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: `grant_type=password&client_id=${config.clientId}&client_secret=${config.clientSecret}&username=${username}&password=${password}`
    };

    return this.fetch(config.tokenUrl, options)
      .then(user => this.setTokens(user));
  }
  refresh() {
    let refresh_token = null;

    if (this.user != null)
      refresh_token = this.user.refresh_token;

    let options = {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&client_id=${config.clientId}&client_secret=${config.clientSecret}&refresh_token=${refresh_token}`
    };

    return this.fetch(config.tokenUrl, options)
      .then(user => this.setTokens(user));
  }
  get isLoggedIn() {
    return this.user != null;
  }
  setTokens(user) {
    this.user = user;

    if (user === null)
    {
      localStorage.removeItem('ApiClient.access_token');
      localStorage.removeItem('ApiClient.refresh_token');
      localStorage.removeItem('ApiClient.expires');
    }
    else
    {
      localStorage.setItem('ApiClient.access_token', this.user.access_token);
      localStorage.setItem('ApiClient.refresh_token', this.user.refresh_token);
      localStorage.setItem('ApiClient.expires', Number(this.user.expires_in) * 1000 + new Date().getTime()) //getTime in is milliseconds, expires_in is in s);
    }
  }
  logoff() {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.setTokens(null);
      resolve();
    });
  }
  fetch(url, options)
  {
    return fetch(url, options)
        .then(response => {
            if (response.ok) {
              return response.json().then(result => ({ result, response }))
            }
            else {
              return Promise.reject(response.text(), response);
            }
          }).then(({ result, response }) =>
            Promise.resolve(result)
        );
  }
  async request (type, method, id, body) {

    //Check expiry
    if (this.user != null && new Date().getTime() > this.user.expires)
    {
      await this.refresh();
    }

    let options = {
      method: method,
      headers: {
        'Content-Type':'application/json'
      },
      body: body
    };

    if (this.user != null)
    {
      options.headers.Authorization = 'Bearer ' + this.user.access_token;
    }

    let url = config.baseUrl + '/' + type;

    if (id != null)
      url += '/' + id;

    return this.fetch(url, options);
  }
  get(type, id) {
    return this.request(type, 'GET', id);
  }
  put(type, body) {
    return this.request(type, 'PUT', body._id, JSON.stringify(body));
  }
  post(type, body) {
    return this.request(type, 'POST', null, JSON.stringify(body));
  }
  delete(type, id) {
    return this.request(type, 'DELETE', id);
  }
}

export default new ApiClient();
