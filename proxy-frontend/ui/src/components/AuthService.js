import decode from "jwt-decode";
export default class AuthService {
  constructor(domain) {
    this.domain = domain || "/api";
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.url = this.getUrl.bind(this);
  }

  login(username, password) {
    // Get a token
    return this.fetch(`${this.domain}/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((res) => {
      this.setUrl(res.url);
      this.setToken(res.token);
      return Promise.resolve(res);
    });
  }

  logout(username) {
    return this.fetch(`${this.domain}/logout`, {
      method: "POST",
      body: JSON.stringify({
        username,
      }),
    }).then((res) => {
      // Clear user token and profile data from localStorage
      localStorage.removeItem("id_token");
      localStorage.removeItem("url");
    });
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }
  setUrl(url) {
    localStorage.setItem("url", url);
  }
  getUrl() {
    return localStorage.getItem("url");
  }
  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  getProfile() {
    return decode(this.getToken());
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this._checkStatus)
      .then((response) => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
