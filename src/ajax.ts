export interface AjaxRequest {
  url: string;
  type: string;
  data?: {};
  headers?: {};
  complete?: Function;
}

/**
 * Makes a vanilla js ajax request and returns a promise.
 * @param req The request parameters.
 */
export function ajax(req: AjaxRequest): Promise<any> {
  return new Promise<any> ((success, error) => {
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      error('Browser does not support modern ajax calls.');
      return;
    }
    
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (undefined !== req.complete && null !== req.complete)
          req.complete();
        
        if (httpRequest.status >= 200 && httpRequest.status < 300)
          success(httpRequest.responseText);
        else
          error('There was a problem with the request: ' + httpRequest.responseText);
      }
    };

    httpRequest.open(req.type, req.url);

    setContentTypeHeader(httpRequest, req.type);
    setHeaders(httpRequest, req.headers);

    httpRequest.send(convertToEncodedForm(req.data));
  });

  function setContentTypeHeader(httpRequest: XMLHttpRequest, method: string): void {
    let type = 'text/plain';

    if (method.toLowerCase() === 'post')
      type = 'application/x-www-form-urlencoded';

    httpRequest.setRequestHeader('Content-type', type);
  }

  function setHeaders(httpRequest: XMLHttpRequest, headers: {}): void {
    if (undefined === req.headers || null === req.headers) return;

    Object.keys(headers).forEach(key => {
      httpRequest.setRequestHeader(key, headers[key]);
    });
  }

  function convertToEncodedForm(data: {}): string {
    if (undefined === data || null === data) return '';
    const strArr = [];

    Object.keys(data).forEach(key => {
      strArr.push(`${key}=${encodeURIComponent(data[key])}`);
    });

    return strArr.join('&');
  }
}
