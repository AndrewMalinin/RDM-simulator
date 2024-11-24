export function serializeURLParams(paramsObject: { [key: string]: string | number | boolean }) {
    if (paramsObject === undefined || Object.keys(paramsObject).length === 0) return '';

    return Object.keys(paramsObject)
        .reduce((result, paramName) => {
            return result + `&${paramName}=${String(paramsObject[paramName])}`;
        }, '')
        .slice(1);
}

export function isValidIP(hostName: string, portRequired = false) {
    function checkIP(ip: string) {
        if (ip.toLowerCase() === 'localhost') return true;

        const ip_regexp =
            /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/gm;
        return ip_regexp.test(ip);
    }

    function checkPort(portString: string) {
        const port_regexp =
            /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gm;
        return port_regexp.test(portString);
    }

    // Если указан порт
    if (hostName.includes(':')) {
        const [ip, port] = hostName.split(':');
        if (ip && port) {
            return checkIP(ip) && checkPort(port);
        }
        return false;
    } else if (portRequired) {
        return false;
    } else {
        return checkIP(hostName);
    }
}

// export function getIpFromCurrentUrl() {
//    var regexp = /src=([^&]+)/i;
//    var getValue = '';
//    if (!!regexp.exec(document.location.search)) getValue = regexp.exec(document.location.search)[1];
//    return getValue;
// }

export function getParamsFromURL(): { [key: string]: string } {
    const queryString = window.location.search;
    const params: { [key: string]: string } = {};
    if (queryString.length === 0) return {};
    const keyValuePairs = queryString.slice(1).split('&');

    keyValuePairs.forEach((keyValuePair) => {
        params[keyValuePair.split('=')[0]] = keyValuePair.split('=')[1];
    });

    return params;
}
