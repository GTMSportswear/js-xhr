export var RequestAcceptType;
(function (RequestAcceptType) {
    RequestAcceptType[RequestAcceptType["any"] = 0] = "any";
    RequestAcceptType[RequestAcceptType["json"] = 1] = "json";
    RequestAcceptType[RequestAcceptType["plainText"] = 2] = "plainText";
    RequestAcceptType[RequestAcceptType["xml"] = 3] = "xml";
    RequestAcceptType[RequestAcceptType["html"] = 4] = "html";
    RequestAcceptType[RequestAcceptType["xhtml"] = 5] = "xhtml";
})(RequestAcceptType || (RequestAcceptType = {}));
export const ajax = (req) => {
    return new Promise((success, error) => {
        const httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            error('Browser does not support modern ajax calls.');
            return;
        }
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status >= 200 && httpRequest.status < 300)
                    success(httpRequest.responseText);
                else
                    error('There was a problem with the request: ' + httpRequest.responseText);
            }
        };
        httpRequest.open(req.type, req.url);
        let data = req.data;
        if (!FormData.prototype.isPrototypeOf(req.data)) {
            data = convertToEncodedForm(req.data);
            setContentTypeHeader(httpRequest, req.type);
        }
        setAcceptHeader(httpRequest, req.acceptType);
        setHeaders(httpRequest, req.headers);
        httpRequest.send(data);
    });
    function setContentTypeHeader(httpRequest, method) {
        let type = 'text/plain';
        if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')
            type = 'application/x-www-form-urlencoded';
        httpRequest.setRequestHeader('Content-type', type);
    }
    function setAcceptHeader(httpRequest, acceptType) {
        let acceptHeaderText = '*/*';
        switch (acceptType) {
            case RequestAcceptType.json:
                acceptHeaderText = 'application/json';
                break;
            case RequestAcceptType.plainText:
                acceptHeaderText = 'text/plain';
                break;
            case RequestAcceptType.xml:
                acceptHeaderText = 'application/xml';
                break;
            case RequestAcceptType.html:
                acceptHeaderText = 'text/html';
                break;
            case RequestAcceptType.xhtml:
                acceptHeaderText = 'application/xhtml+xml';
                break;
        }
        httpRequest.setRequestHeader('Accept', acceptHeaderText);
    }
    function setHeaders(httpRequest, headers) {
        if (undefined === req.headers || null === req.headers)
            return;
        Object.keys(headers).forEach(key => {
            httpRequest.setRequestHeader(key, headers[key]);
        });
    }
    function convertToEncodedForm(data) {
        if (undefined === data || null === data)
            return '';
        const strArr = [];
        Object.keys(data).forEach(key => {
            strArr.push(`${key}=${encodeURIComponent(data[key])}`);
        });
        return strArr.join('&');
    }
};
//# sourceMappingURL=ajax.js.map