isNode = () => {
    return typeof module !== 'undefined' && module.exports
}

ExtendableProxy = class {
    constructor(getset = {}) {
        return new Proxy(this, getset);
    }
}

class ZabbixAPI extends ExtendableProxy {
    constructor(url) {
        super({
            get: (parent, name1) => {
                if (parent[name1] != null) return parent[name1]
                return new Proxy({}, {
                    get: (proxy, name2) => {
                        return parent.method(`${name1}.${name2}`)
                    }
                })
            }
        })
        this.url = url + '/api_jsonrpc.php'
        this.auth = false
        this.headers = {
            'Content-Type': 'application/json-rpc'
        }
    }

    send(data) {
        var self = this
        return new Promise((resolve, reject) => {
            var request = false
            if (isNode()) {
                request = require('xmlhttprequest').XMLHttpRequest
            } else {
                request = XMLHttpRequest
            }
            if (request) {
                var http_request = new request()
                http_request.open('POST', self.url, true)
                for (var h in self.headers) {
                    http_request.setRequestHeader(h, self.headers[h])
                }
                http_request.send(JSON.stringify(data))
                http_request.onreadystatechange = () => {
                    if (http_request.readyState == 4) {
                        if (Number(http_request.status.toString()[0]) == 2) {
                            resolve(JSON.parse(http_request.responseText))
                        } else {
                            reject(http_request.responseText)
                        }
                    }
                }
            } else {
                reject('There was a problem importing the XMLHttpRequest class.')
            }
        })
    }

    method(method) {
        var self = this
        return (params={}) => {
            var data = {
                id: 1,
                jsonrpc: '2.0',
                method: method,
                params: params
            }
            if (self.auth) data.auth = self.auth
            return self.send(data)
        }
    }

    login(user, password) {
        var self = this
        if (self.auth) return self.auth
        return new Promise((resolve, reject) => {
            self.method('user.login')({
                user: user,
                password: password
            }).then((data) => {
                if (data.error) {
                    reject(data)
                } else if (data.result) {
                    self.auth = data.result
                    resolve(data)
                }
            }).catch((data) => {
                reject(data)
            })
        })
    }

    setRequestHeader(header, value) {
        self.headers[header] = value
    }
}

if (isNode()) {
    module.exports = ZabbixAPI
}