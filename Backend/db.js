require('dotenv').config()
const { Pool } = require("pg");

const pool = new Pool({
    connectionString:process.env.DATABASE_URL
});


module.exports=pool


// postgresql://postgres:guru@db.mlnjadqkzznoqqbtsccu.supabase.co:5432/postgres