import pool from '$lib/server/database.js';

export async function load({params}){

    let castleId = params.id;
    const [rows] = await pool.execute("SELECT * FROM castles WHERE id = ?", [castleId]);

    if (rows.length === 0) {
        return {
            status: 404,
            error: new Error('Castle not found')
        };
    }

    return {
        castle: rows[0]
    };
}