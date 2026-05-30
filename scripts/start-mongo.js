const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

const DEFAULT_PORT = parseInt(process.env.MONGO_PORT || '27017', 10);
const DEFAULT_DB_PATH = process.env.MONGO_DB_PATH || path.join('C:', 'data', 'db');
const DEFAULT_BIND_IP = process.env.MONGO_BIND_IP || '127.0.0.1';

const isPortOpen = (port, host = '127.0.0.1') => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    socket.setTimeout(500);
    socket.once('connect', () => {
      done = true;
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.once('timeout', () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.connect(port, host);
  });
};

const findMongod = () => {
  if (process.env.MONGOD_PATH) {
    return path.resolve(process.env.MONGOD_PATH);
  }

  const programFiles = [process.env['PROGRAMFILES'], process.env['PROGRAMFILES(X86)']].filter(Boolean);
  for (const baseDir of programFiles) {
    const serverRoot = path.join(baseDir, 'MongoDB', 'Server');
    if (!fs.existsSync(serverRoot)) continue;
    const versions = fs.readdirSync(serverRoot).filter((name) => /^\d+(\.\d+)*$/.test(name));
    versions.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })).reverse();
    for (const version of versions) {
      const candidate = path.join(serverRoot, version, 'bin', 'mongod.exe');
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return null;
};

const waitForPort = async (timeoutMs = 10000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortOpen(DEFAULT_PORT)) return true;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return false;
};

const startMongo = async () => {
  if (await isPortOpen(DEFAULT_PORT)) {
    console.log(`MongoDB is already running on port ${DEFAULT_PORT}.`);
    return true;
  }

  const mongodPath = findMongod();
  if (!mongodPath) {
    console.error('Could not find mongod.exe. Set MONGOD_PATH in your environment or install MongoDB.');
    return false;
  }

  if (!fs.existsSync(DEFAULT_DB_PATH)) {
    fs.mkdirSync(DEFAULT_DB_PATH, { recursive: true });
  }

  const args = ['--dbpath', DEFAULT_DB_PATH, '--bind_ip', DEFAULT_BIND_IP];
  if (process.env.MONGO_LOG_PATH) {
    args.push('--logpath', process.env.MONGO_LOG_PATH);
  }

  console.log(`Starting MongoDB from ${mongodPath} with dbpath ${DEFAULT_DB_PATH}`);
  const child = spawn(mongodPath, args, {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  const started = await waitForPort(10000);
  if (!started) {
    console.error('MongoDB did not start within 10 seconds.');
    return false;
  }

  console.log(`MongoDB started successfully on port ${DEFAULT_PORT}.`);
  return true;
};

if (require.main === module) {
  startMongo().then((started) => {
    process.exit(started ? 0 : 1);
  });
} else {
  module.exports = { startMongo };
}
