const System = require("systemjs");
let modules = require("lively.modules");
let vm = lively.vm;
let {localInterface: system} = require("lively-system-interface/dist/lively-system-interface-only-local.js");
global.io = require("socket.io-client");
require("lively.2lively/dist/lively.2lively_client.js");

async function l2lConnect(url = `http://localhost:9011/lively-socket.io`, timeout = 20 * 1000) {
  let client = lively.l2l.L2LClient.ensure({
    url,
    namespace: "l2l",
    info: {type: "l2l from lively.next-node-client"}
  });
  if (timeout)
    await client.whenRegistered(timeout);
  console.log(`[l2l] connected to ${url}`);
  return client;
}

module.exports = {
  ...lively,
  System, system, l2lConnect
}
