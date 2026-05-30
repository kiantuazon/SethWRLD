const dns = require('dns');
const { Resolver } = require('dns').promises;

console.log('Testing DNS resolution...\n');

// Test 1: Simple hostname
dns.lookup('kian.4cikomy.mongodb.net', (err, address, family) => {
  console.log('dns.lookup kian.4cikomy.mongodb.net:', err ? 'FAILED: ' + err.code : 'OK - ' + address);
});

// Test 2: SRV record
dns.resolveSrv('_mongodb._tcp.kian.4cikomy.mongodb.net', (err, addresses) => {
  console.log('dns.resolveSrv:', err ? 'FAILED: ' + err.code : 'OK - ' + addresses.length + ' records');
});

// Test 3: Test with custom resolver pointing to Google DNS
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '2001:4860:4860::8888']);

resolver.resolveSrv('_mongodb._tcp.kian.4cikomy.mongodb.net', (err, addresses) => {
  console.log('Custom resolver with Google DNS:', err ? 'FAILED: ' + err.code : 'OK - ' + addresses.length + ' records');
  if (addresses) {
    addresses.forEach(addr => console.log('  -', addr.name + ':' + addr.port));
  }
});
