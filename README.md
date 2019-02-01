# jsZabbix #

**jsZabbix** is a Javascript module for working with the [Zabbix API](https://www.zabbix.com/documentation/3.0/manual/api/reference) inspired
by [PyZabbix](https://github.com/lukecyca/pyzabbix).

## Requirements
* Tested against Zabbix 1.8 through 4.0
* For Node.js you will need the [xmlhttprequest](https://www.npmjs.com/package/xmlhttprequest) library.

## Documentation ##
### Getting Started

Install jsZabbix using npm:

```bash
$ npm install jszabbix
```

You can now require and use jszabbix like so:

```js
let ZabbixAPI = require('jszabbix')

const ZABBIX_URL = process.env.ZABBIX_URL
const ZABBIX_USER = process.env.ZABBIX_USER
const ZABBIX_PASS = process.env.ZABBIX_PASS;

let zapi = new ZabbixAPI(ZABBIX_URL)

zapi.login(ZABBIX_USER, ZABBIX_PASS).then(async (data) => {
    console.log(await zapi.host.get())
})
```

Refer to the [Zabbix API Documentation](https://www.zabbix.com/documentation/3.0/manual/api/reference) and the [jsZabbix Examples](https://github.com/Sighmir/jsZabbix/tree/master/examples) for more information.

## License ##
```
jsZabbix - Zabbix API Javascript Library.
Copyright (C) 2019  Guilherme Caulada (Sighmir)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```