import { spawn } from 'child_process';
import http from 'http';

// Start server as child process
const server = spawn('node', ['server.js'], { cwd: '/Users/rohantrivedi/Downloads/Project', stdio: ['pipe', 'pipe', 'pipe'] });
server.stdout.on('data', d => process.stdout.write('[SERVER] ' + d));
server.stderr.on('data', d => process.stderr.write('[SERVER ERR] ' + d));

// Wait for server to start
await new Promise(r => setTimeout(r, 1500));

function req(method, path, body = null, cookie = '') {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost', port: 5001, path, method,
            headers: {
                'Origin': 'http://localhost:3000',
                ...(cookie ? { Cookie: cookie } : {}),
                ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };
        const r = http.request(options, res => {
            let buf = '';
            res.on('data', c => buf += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(buf), headers: res.headers }); }
                catch { resolve({ status: res.statusCode, body: buf, headers: res.headers }); }
            });
        });
        r.on('error', reject);
        if (data) r.write(data);
        r.end();
    });
}

let pass = 0, fail = 0;
function check(label, got, expected) {
    const ok = String(got) === String(expected);
    console.log(`  ${ok ? '✓' : '✗'} ${label}: ${got}${ok ? '' : ` (expected: ${expected})`}`);
    ok ? pass++ : fail++;
}

console.log('\n=== MedSecureAI API Smoke Tests ===\n');

// 1. Doctor login
const login = await req('POST', '/api/auth/login', { username: 'dr.smith', password: 'doctor123' });
const cookie = login.headers['set-cookie']?.[0]?.split(';')[0] || '';
check('Doctor login', login.status, 200);
check('Doctor role', login.body.data?.role, 'doctor');
check('Doctor username', login.body.data?.username, 'dr.smith');

// 2. Bad password
const bad = await req('POST', '/api/auth/login', { username: 'dr.smith', password: 'wrong' });
check('Bad password rejected', bad.status, 401);

// 3. GET /api/auth/me
const me = await req('GET', '/api/auth/me', null, cookie);
check('GET /me', me.status, 200);

// 4. Patients list (15)
const pts = await req('GET', '/api/patients', null, cookie);
check('GET /patients count=55', pts.body.data?.length, 55);

// 5. Patient search
const search = await req('GET', '/api/patients?search=Ramesh', null, cookie);
check('Search Ramesh returns 1', search.body.data?.length, 1);

// 6. Sensitivity filter
const highFilter = await req('GET', '/api/patients?sensitivityLevel=High', null, cookie);
const highCount = highFilter.body.data?.length;
check('High sensitivity filter (>0)', highCount > 0, true);

// 7. AI Decision Engine
const access = await req('POST', '/api/patients/access/P-1001', { reason: 'Diagnosis' }, cookie);
check('AI decision status', access.status, 200);
check('AI decision field exists', ['Granted','Flagged','Restricted'].includes(access.body.data?.decision), true);
check('Confidence score range', access.body.data?.confidenceScore >= 40 && access.body.data?.confidenceScore <= 99, true);

// 8. Admin login
const adminL = await req('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
const ac = adminL.headers['set-cookie']?.[0]?.split(';')[0] || '';
check('Admin login', adminL.status, 200);
check('Admin role', adminL.body.data?.role, 'admin');

// 9. Admin users list
const users = await req('GET', '/api/admin/users', null, ac);
check('Admin users count=8', users.body.data?.length, 8);
check('No passwordHash in response', users.body.data?.[0]?.passwordHash, undefined);

// 10. Doctor → admin route blocked
const forbid = await req('GET', '/api/admin/users', null, cookie);
check('Role guard (403)', forbid.status, 403);

// 11. Audit logs (admin)
const auditLogs = await req('GET', '/api/audit/logs', null, ac);
check('Audit logs success', auditLogs.status, 200);

// 12. Audit stats
const stats = await req('GET', '/api/audit/stats', null, ac);
check('Audit stats success', stats.status, 200);

// 13. Notifications
const notifs = await req('GET', '/api/notifications', null, cookie);
check('Notifications success', notifs.status, 200);

// 14. Mark notif read-all
const markAll = await req('PATCH', '/api/notifications/read-all', null, cookie);
check('Mark all read', markAll.status, 200);

// 15. Activity feed
const feed = await req('GET', '/api/admin/activity-feed', null, ac);
check('Activity feed success', feed.status, 200);
check('Activity feed has data', Array.isArray(feed.body.data), true);

// 16. Logout
const logout = await req('POST', '/api/auth/logout', {}, cookie);
check('Logout', logout.status, 200);

console.log(`\n=== ${pass}/${pass+fail} tests passed ===\n`);

server.kill();
process.exit(fail > 0 ? 1 : 0);
