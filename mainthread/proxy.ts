// src/utils/supabase/middleware.js
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function proxy(request: any) {
    // 1. Buat response awal
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        // 2. Cek apakah Env Var ada (untuk debugging)
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL! || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) {
            console.error("Supabase Env Vars missing!");
            return supabaseResponse; // Biarkan lolos jika config error, agar tidak 404/500
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet: any) {
                        cookiesToSet.forEach(({ name, value, options }: any) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }: any) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // 3. Ambil user dengan aman
        const {
            data: { user },
            error // Ambil error juga
        } = await supabase.auth.getUser()

        if (error) {
            // Jika ada error auth (misal token expired), anggap user null
            // console.error("Auth error:", error.message); 
        }

        // --- LOGIKA PROTEKSI RUTE ---
        const publicRoutes = [
            '/',
            '/login',
            '/articles',
            '/home',
            '/about',
        ];

        const protectedRoutes = [
            '/admin',
        ];

        // Cek apakah URL diawali dengan publicRoutes
        const isProtectedRoute = protectedRoutes.some(path =>
            request.nextUrl.pathname === path ||
            (path !== '/' && request.nextUrl.pathname.startsWith(path))
        );

        // Jika user TIDAK login dan BUKAN rute publik -> Redirect ke Login
        if (!user && isProtectedRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Jika user SUDAH login dan mencoba akses login/register -> Redirect ke Dashboard (Opsional)
        if (user && (request.nextUrl.pathname === '/login')) {
            const url = request.nextUrl.clone()
            url.pathname = `/admin/${user.id}/dashboard` // Redirect ke halaman user
            return NextResponse.redirect(url)
        }

    } catch (err) {
        console.error("Middleware Error:", err);
        // Jika terjadi error fatal di middleware, biarkan request lewat agar tidak 500/404
        return NextResponse.next({ request });
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}