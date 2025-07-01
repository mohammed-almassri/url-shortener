import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const [sUrl, setSUrl] = useState('https://example.com/long-url');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    async function createSUrl() {
        const res = await fetch('/api/surls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ original_url: sUrl }),
        });

        if (res.ok) {
            const data = await res.json();
            setResult(data.short_url);
            setSUrl('');
        } else {
            console.error('Failed to shorten URL');
            const errorData = await res.json();
            setError(errorData.message || 'An error occurred while shortening the URL.');
        }
    }

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium">URL Shortener</h1>
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">Easily shorten your long URLs and share them with others.</p>
                            {/* URL Shortener Form */}
                            <form
                                className="mb-4 flex flex-col gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    createSUrl();
                                }}
                            >
                                <input
                                    type="url"
                                    placeholder="Paste your long URL here..."
                                    className="rounded border border-[#e3e3e0] px-3 py-2 text-sm dark:border-[#3E3E3A] dark:bg-[#232320] dark:text-[#EDEDEC]"
                                    required
                                    value={sUrl}
                                    onChange={(e) => setSUrl(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="rounded bg-[#f53003] px-4 py-2 font-medium text-white transition-colors hover:bg-[#d42a00] dark:bg-[#FF4433] dark:hover:bg-[#d42a00]"
                                >
                                    Shorten URL
                                </button>
                            </form>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
                            {result && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{result}</p>
                                </div>
                            )}
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
