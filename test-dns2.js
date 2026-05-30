const { Resolver } = require('dns').promises;
const dns = require('dns');

async function testDNS() {
  console.log('Test 1: Default system DNS');
  try {
    const resolver = new Resolver();
    const srv = await resolver.resolveSrv('_mongodb._tcp.kian.4cikomy.mongodb.net');
    console.log('✅ SUCCESS! Found', srv.length, 'SRV records');
    srv.forEach(s => console.log('  -', s.name + ':' + s.port));
  } catch (err) {
    console.log('❌ FAILED:', err.code, err.message);
  }

  console.log('\nTest 2: Explicit Google DNS (8.8.8.8, 8.8.4.4)');
  try {
    const resolver = new Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4']);
    const srv = await resolver.resolveSrv('_mongodb._tcp.kian.4cikomy.mongodb.net');
    console.log('✅ SUCCESS! Found', srv.length, 'SRV records');
    srv.forEach(s => console.log('  -', s.name + ':' + s.port));
  } catch (err) {
    console.log('❌ FAILED:', err.code, err.message);
  }

  console.log('\nTest 3: IPv6 Google DNS (2001:4860:4860::8888, 2001:4860:4860::8844)');
  try {
    const resolver = new Resolver();
    resolver.setServers(['2001:4860:4860::8888', '2001:4860:4860::8844']);
    const srv = await resolver.resolveSrv('_mongodb._tcp.kian.4cikomy.mongodb.net');
    console.log('✅ SUCCESS! Found', srv.length, 'SRV records');
    srv.forEach(s => console.log('  -', s.name + ':' + s.port));
  } catch (err) {
    console.log('❌ FAILED:', err.code, err.message);
  }
}

testDNS();
