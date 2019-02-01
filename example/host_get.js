let ZabbixAPI = require('..')

const ZABBIX_URL = process.env.ZABBIX_URL
const ZABBIX_USER = process.env.ZABBIX_USER
const ZABBIX_PASS = process.env.ZABBIX_PASS

let zapi = new ZabbixAPI(ZABBIX_URL)

zapi.login(ZABBIX_USER, ZABBIX_PASS).then(async (data) => {
    console.log(await zapi.host.get())
})