import pool from '$lib/server/database.js';

export async function load() {
    const [rows] =  await pool.execute('SELECT * FROM castles');

    return {
        pageTitle: "List of Castles",
        castles: rows
    };

}