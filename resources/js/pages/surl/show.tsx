import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SUrl } from '@/types/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ShowSUrl({ id }: { id: string }) {
    const [surl] = useState<SUrl | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">Short URL Details</h1>
                {id}
                {surl ? (
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <p>
                            <strong>ID:</strong> {surl.id}
                        </p>
                        <p>
                            <strong>Original URL:</strong> {surl.original_url}
                        </p>
                        <p>
                            <strong>Short URL:</strong> {surl.short_url}
                        </p>
                        <p>
                            <strong>Click Count:</strong> {surl.click_count}
                        </p>
                        <p>
                            <strong>Created At:</strong> {new Date(surl.created_at).toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <div className="text-gray-500">Loading...</div>
                )}
            </div>
        </AppLayout>
    );
}
