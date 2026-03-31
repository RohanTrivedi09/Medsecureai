import { spawn } from 'child_process';
import http from 'http';

const server = spawn('node', ['server.js'], { cwd: '/Users/rohantrivedi/Downloads/Project', stdio: ['pipe', 'pipe', 'pipe'] });
let serverOutput = '';
server.stdout.on('data', d => { serverOutput += d.toString(); process.stdout.write('[SERVER] ' + d); });
server.stderr.on('data', d => { process.stderr.write('[SERVER ERR] ' + d); });

await new Promise(r => setTimeout(r, 1500));

// Minimal raw HTTP request for debugging — no CORS
function rawReq(method, path, body = null, cookie = '', origin = '') {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const headers = {};
        if (data) { headers['Content-Type'] = 'application/json'; headers['Content-Length'] = Buffer.byteLength(data); }
        if (cookie) headers['Cookie'] = cookie;
        if (origin) headers['Origin'] = origin;
        
        const r = http.request({ hostname: 'localhost', port: 5001, path, method, headers }, res => {
            let buf = '';
            res.on('data', c => buf += c);
            res.on('end', () => {
                console.log(`${method} ${path}: status=${res.statusCode}, body=${buf.substring(0, 200)}`);
                try { resolve({ status: res.statusCode, body: JSON.parse(buf), headers: res.headers }); }
                catch { resolve({ status: res.statusCode, body: buf, headers: res.headers }); }
            });
        });
        r.on('error', e => { console.log(`Error: ${e.message}`); reject(e); });
        if (data) r.write(data);
        r.end();
    });
}

console.log('\n=== Debug Test ===\n');
console.log('Testing login WITHOUT origin:');
await rawReq('POST', '/api/auth/login', { username: 'dr.smith', password: 'doctor123' });

console.log('\nTesting login WITH origin:');
await rawReq('POST', '/api/auth/login', { username: 'dr.smith', password: 'doctor123' }, '', 'http://localhost:3000');

console.log('\nDone.');
server.kill();
