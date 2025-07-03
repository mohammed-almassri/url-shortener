export type SUrl = {
    id: string;
    original_url: string;
    short_url: string;
    created_at: string;
    click_count: number;
};

export type CountryStat = {
    country: string;
    code: string | null;
    count: number;
};
