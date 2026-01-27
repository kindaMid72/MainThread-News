"use strict";
// supabase for client
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUserInstance;
// Impor `createBrowserClient` dari `@supabase/ssr` untuk client-side di Next.js App Router.
// Ini akan memastikan sesi dikelola melalui cookies.
const supabase_js_1 = require("@supabase/supabase-js");
async function createUserInstance(authorization) {
    return (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: authorization
            }
        }
    });
}
