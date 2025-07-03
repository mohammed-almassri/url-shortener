import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const [sUrl, setSUrl] = useState('');
    // const [alias, setAlias] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const { auth } = usePage<SharedData>().props;

    async function createSUrl() {
        const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        const res = await fetch('/api/surls', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf ?? '',
            },
            body: JSON.stringify({
                original_url: sUrl,
                // alias: alias || undefined,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
            const shortUrl = `${appUrl}/${data.data.short_code}`;
            setResult(shortUrl);
            setSUrl('');
            // setAlias('');
            setError('');
        } else {
            const errorData = await res.json();
            setError(errorData.message || 'An error occurred while shortening the URL.');
        }
    }

    function onCopy() {
        if (!result) return alert('No shortened URL available.');
        navigator.clipboard.writeText(result).then(() => {
            alert('Copied to clipboard!');
        });
    }

    return (
        <>
            <Head title="Home" />
            {/* Navigation */}
            <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                    <img src="/logo-outline-dark.png" alt="HAL8 Logo" className="mr-2 inline-block h-10" />
                    HAL8
                </div>
                <div className="space-x-4">
                    <Link href="#" className="text-gray-600 hover:text-blue-600">
                        Features
                    </Link>
                    <Link href="#" className="text-gray-600 hover:text-blue-600">
                        Pricing
                    </Link>
                    <Link href="#" className="text-gray-600 hover:text-blue-600">
                        API Docs
                    </Link>
                    {auth.user ? (
                        <Link href={route('dashboard')} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-gray-600 hover:text-blue-600">
                                Login
                            </Link>
                            <Link href={route('register')} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Shorten URLs. Share anywhere. Track everything.</h1>
                <p className="mb-6 text-gray-600">Shorten long links, generate QR codes and track link analytics</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createSUrl();
                    }}
                    className="flex w-full max-w-2xl flex-col gap-3"
                >
                    <input
                        type="text"
                        placeholder="Paste your long URL here"
                        value={sUrl}
                        onChange={(e) => setSUrl(e.target.value)}
                        required
                        className="rounded border border-gray-300 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                        {/* <input disabled value="short.ly" className="w-1/3 rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600" /> */}
                        {/* <input
                            type="text"
                            placeholder="Custom alias (optional)"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-2/3 rounded border border-gray-300 px-3 py-2"
                        /> */}
                    </div>
                    <button type="submit" className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Shorten URL
                    </button>
                </form>

                {result && (
                    <div className="mt-6 flex items-center justify-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 shadow-sm">
                        <span className="font-semibold text-blue-700">{result}</span>
                        <button onClick={onCopy} title="Copy to clipboard" className="text-gray-600 hover:text-gray-900">
                            📋
                        </button>
                        <span className="text-sm text-gray-400">+ QR + Analytics</span>
                    </div>
                )}

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </section>

            {/* Feature Highlights */}
            <section className="grid grid-cols-2 gap-6 border-t bg-white px-6 py-10 text-center sm:grid-cols-4">
                <div>
                    <div className="mb-1 text-2xl">📈</div>
                    <p className="font-medium text-gray-700">Link analytics</p>
                </div>
                <div>
                    <div className="mb-1 text-2xl">🔗</div>
                    <p className="font-medium text-gray-700">Custom aliases</p>
                </div>
                <div>
                    <div className="mb-1 text-2xl">⏳</div>
                    <p className="font-medium text-gray-700">Expiry controls</p>
                </div>
                <div>
                    <div className="mb-1 text-2xl">💻</div>
                    <p className="font-medium text-gray-700">API access</p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-50 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Sign up to manage and track all your links</h2>
                <Link href={route('register')} className="mt-4 inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                    Get Started Free
                </Link>
            </section>

            <footer className="border-t bg-white px-6 py-6 text-center text-sm text-gray-500">
                <div>&copy; {new Date().getFullYear()} HAL8. All rights reserved.</div>
                <div className="mt-2 space-x-4">
                    <Link href="#" className="hover:text-blue-600">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="hover:text-blue-600">
                        Terms of Service
                    </Link>
                    <Link href="#" className="hover:text-blue-600">
                        Contact
                    </Link>
                </div>
            </footer>
        </>
    );
}
