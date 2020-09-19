import { Setting, PageItem } from '../../../shared';
import config from '../config.json';

interface Token {
    access_token: string;
    refresh_token: string;
    expires: number;
    expires_in?: number;
}

class ApiClient {
  token: Token | null;
  settings: Map<string, string | undefined> | null;
  pages: PageItem[] | null;
  optionsCallBack?: (options: Map<string, string | undefined>) => void;
  pagesCallBack?: (pages: PageItem[]) => void;

  constructor() {
    let token = localStorage.getItem('ApiClient.access_token');

    if (token !== null) {
      this.token = {
        access_token : token,
        refresh_token : localStorage.getItem('ApiClient.refresh_token') ?? '',
        expires : Number(localStorage.getItem('ApiClient.expires'))
      };
    }
    else {
      this.token = null;
    }

    this.settings = null;
    this.pages = null;
  }
  async login(username: string, password: string) {

    let options = {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: `grant_type=password&client_id=${config.clientId}&client_secret=${config.clientSecret}&username=${username}&password=${password}`
    };

    const user = await this.fetch(config.tokenUrl, options);
    return this.setTokens(user);
  }
  async refresh() {
    let refresh_token = null;

    if (this.token !== null)
      refresh_token = this.token.refresh_token;

    let options = {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&client_id=${config.clientId}&client_secret=${config.clientSecret}&refresh_token=${refresh_token}`
    };

    const user = await this.fetch(config.tokenUrl, options);
    return this.setTokens(user);
  }
  get isLoggedIn() {
    return this.token !== null;
  }
  setTokens(token: Token | null) {
    this.token = token;

    if (this.token === null)
    {
      localStorage.removeItem('ApiClient.access_token');
      localStorage.removeItem('ApiClient.refresh_token');
      localStorage.removeItem('ApiClient.expires');
    }
    else
    {
      this.token.expires = (Number(this.token.expires_in) * 1000) + new Date().getTime(); //getTime in is milliseconds, expires_in is in s);

      localStorage.setItem('ApiClient.access_token', this.token.access_token);
      localStorage.setItem('ApiClient.refresh_token', this.token.refresh_token);
      localStorage.setItem('ApiClient.expires', this.token.expires.toString())
    }
  }
  logoff() {
    var self = this;

    return new Promise(function(resolve) {
      self.setTokens(null);
      resolve();
    });
  }
  fetch(url : string, options?: RequestInit)
  {
    return fetch(url, options)
        .then(response => {
          if (response.status === 401) { //Unauthorized
            return response.text().then(result => ({ result: {error: result + "."}, response }))
          }
          else {
            return response.json().then(result => ({ result, response }))
          }
        })
          .then(({ result, response }) => {
            if (response.ok) {
              return Promise.resolve(result);
            }
            else {
              return Promise.reject(result);
            }
          }
        );
  }
  async request (type: string, method: string, id?: string, body? :string) {

    //Check expiry
    if (this.token !== null && new Date().getTime() > this.token.expires)
    {
      await this.refresh();
    }

    let url = config.baseUrl + '/' + type;

    if (id !== undefined)
      url += '/' + id;

    if (this.token !== null)
    {
      return this.fetch(url, {
        method: method,
        headers: {
          Authorization: 'Bearer ' + this.token.access_token,
          'Content-Type':'application/json'
        },
        body: body
      });
    }
    else {
      return this.fetch(url, {
        method: method,
        headers: {
          'Content-Type':'application/json'
        },
        body: body
      });
    }
  }
  get(type: string, id?: string) {
    return this.request(type, 'GET', id);
  }
  put(type: string, body: any) {
    return this.request(type, 'PUT', body._id, JSON.stringify(body));
  }
  post(type: string, body: any) {
    return this.request(type, 'POST', undefined, JSON.stringify(body));
  }
  delete(type: string, id: string) {
    return this.request(type, 'DELETE', id);
  }
  refreshOptions() {
    this.get('settings').then( (settings: Setting[]) => {
      this.settings = new Map();

      for(let i = 0; i < settings.length; i++)
      {
          this.settings.set(settings[i].name, settings[i].value);
      }

      if (this.optionsCallBack !== undefined)
        this.optionsCallBack(this.settings);
    })
    .catch(msg => {
      console.log(msg);
      this.settings = new Map();
    });
  }
  setOptionsCallBack(callBack: (options: Map<string, string | undefined>) => void) {
    this.optionsCallBack = callBack;

    if (this.settings!== null)
      callBack(this.settings);
    else
      this.refreshOptions();
  }
  refreshPages() {
    this.get('pages/index').then(pages => {
      this.pages = pages;

      if (this.pagesCallBack !== undefined && this.pages !== null)
        this.pagesCallBack(this.pages);
    })
    .catch(msg => {
      console.log(msg);
      this.pages = [];
    });
  }
  setPagesCallBack(callBack: (pages: PageItem[]) => void) {
    this.pagesCallBack = callBack;

    if (this.pages!= null)
      callBack(this.pages);
    else
      this.refreshPages();
  }
}

export default new ApiClient();
