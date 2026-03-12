import pool from '$lib/server/database.js'; 

export async function GET() {
    const [rows] = await pool.query('SELECT * FROM castles');
    return Response.json(rows);
}


export async function POST({ request }) {

    const{ name, location, description} = await request.json();

    const [result] = await pool.query('INSERT INTO castles (name, location, description) VALUES (?, ?, ?)', [name, location, description]);
    
    return Response.json({message: "Castle created successfully", status: 201});

}
