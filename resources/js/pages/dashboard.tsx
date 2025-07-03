import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { SUrl } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function UrlsTable() {
    const [urls, setUrls] = useState<SUrl[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/surls')
            .then((res) => res.json())
            .then((data) => {
                setUrls(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Original URL</th>
                    <th className="px-4 py-2 text-left">Short URL</th>
                    <th className="px-4 py-2 text-left">Click Count</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                </tr>
            </thead>
            <tbody>
                {urls.map((url) => (
                    <tr key={url.id}>
                        <td className="px-4 py-2">
                            <Link href={`/urls/${url.id}`} className="text-blue-600 hover:underline">
                                View Details
                            </Link>
                        </td>
                        <td className="px-4 py-2">{url.original_url}</td>
                        <td className="px-4 py-2">{url.short_url}</td>
                        <td className="px-4 py-2">{url.click_count}</td>

                        <td className="px-4 py-2">{url.created_at}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <UrlsTable />
                </div>
            </div>
        </AppLayout>
    );
}
