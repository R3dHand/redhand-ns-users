// const mariadb = require('mariadb');
import mariadb from 'mariadb';

export async function get() {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'redhand'
    });

    try {
        const res = await conn.query('SELECT * FROM users.users');
        console.log('users-repository.js' + res);
        return res;
    } finally {
        conn.end();
    }
}
