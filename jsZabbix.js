function isNode() {
    return typeof module !== 'undefined' && module.exports
}

class ExtendableProxy {
    constructor(getset={}) {
        return new Proxy(this, getset);
    }
}

class ZabbixAPI extends ExtendableProxy {
    constructor(url) {
        super({
            get: function (parent, name1) {
                if (parent[name1] != null) return parent[name1]
                return new Proxy({}, {
                    get: function (proxy, name2) {
                        return parent.method(`${name1}.${name2}`)
                    }
                })
            }
        })
        this.url = url + '/api_jsonrpc.php'
        this.auth = false
    }

    send(data) {
        var self = this
        return new Promise(function (resolve, reject) {
            var request = false
            if (isNode()) {
                request = require('xmlhttprequest').XMLHttpRequest
            } else {
                request = XMLHttpRequest
            }
            if (request) {
                var http_request = new request()
                http_request.open('POST', self.url, true)
                http_request.setRequestHeader('Content-Type', 'application/json-rpc')
                http_request.send(JSON.stringify(data));
                http_request.onreadystatechange = function () {
                    if (http_request.readyState == 4) {
                        if (http_request.status == 200) {
                            resolve(JSON.parse(http_request.responseText))
                        } else {
                            reject('There was a problem with the request. Status code is ' + http_request.status)
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
        return function (params={}) {
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
        return new Promise(function (resolve, reject) { 
            self.method('user.login')({
                user: user,
                password: password 
            }).then(function (data) {
                if (data.error) {
                    reject(data)
                } else if (data.result) {
                    self.auth = data.result
                    resolve(data)
                }
            })
        })
    }
}

if (isNode()) {
    module.exports = ZabbixAPI
}