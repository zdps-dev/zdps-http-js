/*
  ZDPS HTTP

  Sometimes you have to JavaScript.
  Sometimes you have to do HTTP stuff.
  You don't want to deal with NPM install.
  You just want to "node mysolution.mjs" and get on with life.
*/
import { request } from 'https';

export function jsonPathGet(path, obj) {
  const keys = path.split(/\.|\[|\]/g).filter(Boolean);
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return undefined;
    }

    if (key === '$') {
        continue;
    }

    if (key.match(/^\d+$/)) {
      const index = parseInt(key, 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result;
}

export async function makeHttpGet(url) {
    const u = new URL(url);
    u.method = "get";
    return makeHttpPro(u);
}

export async function makeHttpPost(url, data) {
    const u = new URL(url);
    u.method = "post";
    return makeHttpPro(u, JSON.stringify(data));
}

export async function makeHttpPro(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData,
          dataJson: JSON.parse(responseData)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

export function getCaptures(resp, captures) {
  let captured = {};
  for (const [capture, namekey] of captures) {
    captured[namekey] = jsonPathGet(capture, resp);
  }
  return captured;
}