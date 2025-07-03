import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChartArea, Clock, Laptop, Link2 } from 'lucide-react';
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
        <div className="flex min-h-screen flex-col">
            <Head title="Home" />
            {/* Navigation */}
            <nav className="flex items-center justify-between bg-white px-6 py-4">
                <div className="text-xl font-bold text-black">
                    <img src="/logo-outline-dark.png" alt="HAL8 Logo" className="mr-2 inline-block h-10" />
                    HAL8
                </div>
                <div className="space-x-4">
                    <Link href="#" className="text-black hover:text-black">
                        Features
                    </Link>
                    <Link href="#" className="text-black hover:text-black">
                        Pricing
                    </Link>
                    <Link href="#" className="text-black hover:text-black">
                        API Docs
                    </Link>
                    {auth.user ? (
                        <Link href={route('dashboard')} className="rounded px-4 py-2 text-white">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-black hover:text-black">
                                Login
                            </Link>
                            <Link href={route('register')} className="rounded bg-black px-4 py-2 text-white hover:bg-black">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="flex min-h-[50vh] flex-col gap-6 bg-gray-100 px-6 md:flex-row">
                {/* Hero Section */}
                <section className="flex flex-1 flex-col items-start justify-center px-4 py-16 text-start">
                    <h1 className="mb-2 text-3xl font-bold text-black">Shorten URLs. Share anywhere. Track everything.</h1>
                    <p className="mb-6 text-black">Shorten long links, generate QR codes and track link analytics</p>
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
                            className="rounded border border-black px-4 py-2 text-black focus:ring-2 focus:ring-black"
                        />
                        <div className="flex gap-2">
                            {/* <input disabled value="short.ly" className="w-1/3 rounded border border-black bg-black px-3 py-2 text-black" /> */}
                            {/* <input
                            type="text"
                            placeholder="Custom alias (optional)"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-2/3 rounded border border-black px-3 py-2"
                        /> */}
                        </div>
                        <button type="submit" className="mt-2 rounded bg-black px-4 py-2 text-white hover:bg-gray-800">
                            Shorten URL
                        </button>
                    </form>

                    {result && (
                        <div className="mt-6 flex items-center justify-center gap-3 rounded border border-black bg-white px-4 py-2 shadow-sm">
                            <span className="font-semibold text-black">{result}</span>
                            <button onClick={onCopy} title="Copy to clipboard" className="text-black hover:text-black">
                                📋
                            </button>
                            <span className="text-sm text-black">+ QR + Analytics</span>
                        </div>
                    )}

                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </section>
                {/* Feature Highlights */}
                <section className="flex-1 bg-white px-6">
                    <ul className="flex h-full flex-col justify-center gap-6">
                        <li className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-3xl">
                                <ChartArea className="inline-block" size={50} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-black">Link analytics</p>
                                <span className="text-sm text-gray-600">
                                    Track clicks, referrers, locations, and device types for every short link.
                                </span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-3xl">
                                <Link2 className="inline-block" size={50} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-black">Custom aliases</p>
                                <span className="text-sm text-gray-600">Create memorable, branded short links with your own custom alias.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-3xl">
                                <Clock className="inline-block" size={50} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-black">Expiry controls</p>
                                <span className="text-sm text-gray-600">Set expiration dates or limits for your links to control access.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="flex-shrink-0 text-3xl">
                                <Laptop className="inline-block" size={50} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-black">API access</p>
                                <span className="text-sm text-gray-600">
                                    Integrate link shortening and analytics into your own apps with our API.
                                </span>
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Call to Action */}
            </div>
            <section className="t flex flex-grow flex-col items-center justify-center bg-gray-100 py-12 text-center">
                <h2 className="text-2xl font-semibold text-black">Sign up to manage and track all your links</h2>
                <Link href={route('register')} className="mt-4 inline-block rounded bg-black px-6 py-3 text-white hover:bg-black">
                    Get Started Free
                </Link>
            </section>
            <footer className="border-t bg-white px-6 py-6 text-center text-sm text-black">
                <div>&copy; {new Date().getFullYear()} HAL8. All rights reserved.</div>
                <div className="mt-2 space-x-4">
                    <Link href="#" className="hover:text-black">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="hover:text-black">
                        Terms of Service
                    </Link>
                    <Link href="#" className="hover:text-black">
                        Contact
                    </Link>
                </div>
            </footer>
        </div>
    );
}
