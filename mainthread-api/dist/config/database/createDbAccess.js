"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createDatabaseAccess;
const supabase_js_1 = require("@supabase/supabase-js");
async function createDatabaseAccess() {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SECRET_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL or Service Role Key is missing from environment variables.');
        }
        return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    catch (error) {
        console.error("Error creating Supabase admin instance:", error.message);
        throw error; // Lemparkan kembali error agar bisa ditangkap oleh pemanggil
    }
}
// this code came from supabase docs
