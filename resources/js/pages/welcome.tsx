import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const [sUrl, setSUrl] = useState('');
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
            }),
        });

        if (res.ok) {
            const data = await res.json();
            const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
            const shortUrl = `${appUrl}/${data.data.short_code}`;
            setResult(shortUrl);
            setSUrl('');
        } else {
            console.error('Failed to shorten URL');
            const errorData = await res.json();
            setError(errorData.message || 'An error occurred while shortening the URL.');
        }
    }

    function onCopy() {
        if (result) {
            navigator.clipboard
                .writeText(result)
                .then(() => {
                    alert('Shortened URL copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy the shortened URL.');
                });
        } else {
            alert('No shortened URL available to copy.');
        }
    }

    return (
        <>
            <Head title="Home" />

            <nav className="flex justify-end bg-white p-4 shadow">
                {auth.user ? (
                    <Link href={route('dashboard')} className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href={route('login')} className="mr-4 rounded px-4 py-2 text-blue-600 transition hover:bg-blue-100">
                            Login
                        </Link>
                        <Link href={route('register')} className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                            Register
                        </Link>
                    </>
                )}
            </nav>

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
                <div className="mb-4 w-full max-w-md rounded bg-white px-8 pt-6 pb-8 shadow-md">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Welcome to the URL Shortener</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createSUrl();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Paste your long URL here..."
                            value={sUrl}
                            onChange={(e) => setSUrl(e.target.value)}
                            required
                            className="rounded border border-gray-300 px-3 py-2 text-gray-800 transition duration-200 placeholder:text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        <button type="submit" className="rounded bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700">
                            Shorten URL
                        </button>
                    </form>
                    {result && (
                        <p className="mt-4 break-all text-green-600">
                            Shortened URL:{' '}
                            <a href={result} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                                {result}
                            </a>
                            <button onClick={onCopy} className="ml-2 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
                                    <rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
                                </svg>
                            </button>
                        </p>
                    )}
                    {error && <p className="mt-4 text-red-600">Error: {error}</p>}
                </div>
            </div>
        </>
    );
}
