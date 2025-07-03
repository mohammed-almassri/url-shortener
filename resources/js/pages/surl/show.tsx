import CountryMap from '@/components/charts/map';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CountryStat, SUrl } from '@/types/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ShowSUrl({ id }: { id: string }) {
    const [surl, setSurl] = useState<SUrl | null>(null);
    const [countryReport, setCountryReport] = useState<CountryStat[]>([]);

    useEffect(() => {
        function fetchSUrl() {
            fetch(`/api/surls/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setSurl(data.data || null);
                })
                .catch((error) => {
                    console.error('Error fetching SUrl:', error);
                });
        }
        fetchSUrl();
    }, [id]);

    useEffect(() => {
        function fetchCountryReport() {
            fetch(`/api/reports/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setCountryReport(data.data || []);
                    console.log('Country report data:', data);
                })
                .catch((error) => {
                    console.error('Error fetching country report:', error);
                });
        }
        fetchCountryReport();
    }, [id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">Short URL Details</h1>

                {surl ? (
                    <div className="rounded-lg p-6 shadow-md">
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
                <CountryMap countryStats={countryReport} />
            </div>
        </AppLayout>
    );
}
