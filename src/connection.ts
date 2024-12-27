import dotenv from 'dotenv';
dotenv.config();

// Import and require Pool (node-postgres)
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});

const connectToDB = async() => {
    try{
        await pool.connect();
        console.log("Connected to the database.");
    }catch(error){
        console.error(`Error connectiong to the database: ${error}`);
        process.exit(1);
    }
};

export { pool, connectToDB };