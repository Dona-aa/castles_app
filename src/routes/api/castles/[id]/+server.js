import pool from '$lib/server/database.js'; 

export async function GET({params}) {
    const id = params.id;
    const [rows] = await pool.query('SELECT * FROM castles WHERE id = ?', [id]);

    if (rows.length === 0) {
        return Response.json({message: "Castle not found"}, {status: 404});
    }

    return Response.json(rows[0]);
}


export async function DELETE({params}) {
    const id = params.id;
    const [result] = await pool.query('DELETE FROM castles WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
        return Response.json({message: "Castle not found"}, {status: 404});
    }

    return Response.json({message: "Castle deleted successfully"});

}

export async function PUT({ request, params }) {
    const id = params.id;
    const { name, location, description, startdate, starttime } = await request.json();
    const [result] = await pool.query('UPDATE castles SET name = ?, location = ?, description = ? WHERE id = ?', [name, location, description, id]);
    
    if (result.affectedRows === 0) {
        return Response.json({message: "Castle not found"}, {status: 404});
    }

    return Response.json({message: "Castle updated successfully"});
}