async function helper(method, resource, body, init = {}, type = 'json') {
  const url = new URL(resource, this.base_url);

  init.method = method;
  if (!init.headers) init.headers = {};

  if (body) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  if (this.hook) await this.hook(url, init);

  const response = await fetch(url, init);
  const result = await response[type]();
  if (!response.ok) throw result;
  return result;
}

class FFetch {
  constructor(base_url, hook) {
    this.base_url = base_url;
    this.hook = hook;
  }

  query(url, params) {
    if (!params) return url;
    return url + '?' + new URLSearchParams(params);
  }

  get(resource, params, init) {
    return helper.call(this, 'GET', this.query(resource, params), undefined, init);
  }

  post(resource, body, init) {
    return helper.call(this, 'POST', resource, body, init);
  }

  put(resource, body, init) {
    return helper.call(this, 'PUT', resource, body, init);
  }
}

export default FFetch;