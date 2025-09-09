import mariadb from 'mariadb';

export async function get(sub) {
    console.log('preferences/get');

    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'redhand'
    });

    try {
        // preferences exist
        let res = await conn.query(`SELECT Theme FROM users.preferences where UserId = '${sub}' LIMIT 1`);

        if (res.length == 0) {
            // insert default preferences
            const insertPreferences = await conn.query(`INSERT INTO users.preferences (UserId, Theme) VALUES ('${sub}', 'light')`);

            // query inserted results
            res = await conn.query(`SELECT Theme FROM users.preferences where UserId = '${sub}' LIMIT 1`);
        }
        if (res.length > 0) {
            return res[0];
        }
        return res;
    } finally {
        conn.end();
    }
}

export async function patch(sub, preferences) {
    console.log('preferences/update');

    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'redhand'
    });
    try {
        let patchResponse = await conn.query(
            `UPDATE users.preferences SET theme=? where UserId=?`,
            [preferences.theme, sub]
        );
        
        if (patchResponse.affectedRows > 0) {
            let [updatedRow] = await conn.query(
                `SELECT theme FROM users.preferences WHERE UserId=?`,
                [sub]
            );

            return updatedRow;
        } else {
            return "No rows updated";
        }
    } finally {
        conn.end();
    }
}


