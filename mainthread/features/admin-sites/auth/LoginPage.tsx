"use client"
import { createClient } from '@/libs/supabase/createBrowserClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {Loader2} from 'lucide-react'

// testing

// component
import MainThreadLogo from '@/components/MainThreadLogo';
import PopUpMessage from '@/components/PopUpMessage';

// api
import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';


// Impor createBrowserClient langsung dari @supabase/ssr untuk komponen klien
export default function Login_Page() {
    const router = useRouter();

    // state
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [error, setError] = useState<string | null>(null); // error message
    const [loading, setLoading] = useState<boolean>(false);

    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState({
        title: '',
        message: '',
        type: 'success',
        duration: 3000,
        onClose: () => { setShowMessage(false) }
    });



    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowMessage(false);

        try {

            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage({
                    title: 'Login Failed',
                    message: 'Make sure your email and password set correctly',
                    type: 'failed',
                    duration: 3000,
                    onClose: () => { setShowMessage(false) }
                })
                setShowMessage(true);
            }

            if (data.user) {
                router.push(`/admin/${data.user.id}/dashboard`);
            }
        } catch (error) {
            setMessage({ title: 'Error', message: 'Invalid email or password', type: 'error', duration: 3000, onClose: () => { setMessage({ title: '', message: '', type: 'success', duration: 3000, onClose: () => { } }) } });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // get email
        setShowMessage(false);
        api.post(`/api/public/forgot-password/${email}`)
            .then((response) => {
                setMessage({
                    title: 'Reset password form sent',
                    message: 'Check your email for the reset password form',
                    type: 'success',
                    duration: 3000,
                    onClose: () => { setShowMessage(false) }
                })
                setShowMessage(true);
            })
            .catch((error) => {
                setMessage({
                    title: 'Error',
                    message: 'Invalid email or password',
                    type: 'error',
                    duration: 3000,
                    onClose: () => { setShowMessage(false) }
                })
                setShowMessage(true);
            })

    };

    return (
        <div className="min-h-screen bg-gray-100  font-mono">
            {showMessage && <PopUpMessage title={message.title} message={message.message} type={message.type} duration={message.duration} onClose={message.onClose} />}
            <div className="container mx-auto flex flex-col md:flex-row md:h-screen md:items-center">
                {/* Left Section / Header */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-600/80 ">
                        Ready to release article for <MainThreadLogo className='text-5xl!' />?
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 ">
                        Login to continue.
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
                                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <button onClick={handleForgotPassword} type="button" className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400">Forgot Password?</button>
                            </div>

                            {error && <p className="text-blue-500 text-center mt-6">{error}</p>}

                            <button type="submit" disabled={loading} className="w-full mt-6 border-2 border-transparent bg-blue-600 rounded-lg py-3 cursor-pointer text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center">{!loading? "Login" : <Loader2 className='animate-spin'></Loader2>}</button>
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