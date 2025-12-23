"use client"
import { createClient } from '@/libs/supabase/createBrowserClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// testing


// Impor createBrowserClient langsung dari @supabase/ssr untuk komponen klien
export default function Login_Page() {
    const router = useRouter();

    // state
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [error, setError] = useState<string | null>(null); // error message
    const [loading, setLoading] = useState<boolean>(false);


    // check if user already login in
    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getSession();
            if (data.session) {
                router.push(`/admin/${data.session.user.id}/dashboard`);
            }
        };
        //checkUser();
        //testSignin(); // dont call this ever again
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data.user) {
                router.push(`/admin/${data.user.id}/dashboard`);
            }
        } catch (error) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100  font-mono">
            <div className="container mx-auto flex flex-col md:flex-row md:h-screen md:items-center">
                {/* Left Section / Header */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-600/80 ">
                        Siap merilis article harian <span className='text-blue-900'>Main</span><span className='text-red-600'>Thread</span>?
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 ">
                        Log-in ke akunmu untuk melanjutkan.
                    </p>
                </div>

                {/* Right Section / Form */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.1)] rounded-xl p-8">
                        <form onSubmit={(e) => { handleLogin(e) }} className="w-full flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" className="w-full p-3 bg-gray-50  text-gray-900  border border-gray-300  rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-300  rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" required />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <button type="button" className="font-medium text-red-600 hover:underline dark:text-red-400">Forgot Password?</button>
                            </div>

                            {error && <p className="text-red-500 text-center mt-6">{error}</p>}

                            <button type="submit" className="w-full mt-6 border-2 border-transparent bg-red-600 rounded-lg py-3 cursor-pointer text-white font-bold hover:bg-red-700 transition-colors">Log In</button>
                        </form>
                        {/* <div className="text-center mt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Ga punya akun?  <Link href="/sign_in" className="text-red-600 hover:underline font-bold">sign-up disini</Link> dulu yah!</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}