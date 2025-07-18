import { CountryStat } from '@/types/types';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface CountryMapProps {
    countryStats: CountryStat[];
}

export default function CountryMap({ countryStats }: CountryMapProps) {
    const colorScale = (count: number): string => {
        if (count > 100) return '#d7191c'; // deep red (inverted from green)
        if (count > 50) return '#fdae61'; // orange (inverted from light green)
        if (count > 0) return '#a6d96a'; // light green (inverted from orange)
        return '#E0E0E0';
    };

    // Convert stats to a map for fast lookup
    const countryMap: Record<string, number> = Object.fromEntries(countryStats.map(({ code, count }) => [code, count]));

    return (
        <ComposableMap
            projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147,
            }}
        >
            <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={geoUrl}>
                    {/* eslint-disable-next-line */}
                    {({ geographies }: { geographies: any[] }) => {
                        return geographies.map((geo) => {
                            const code = geo.id;
                            const clicks = countryMap[code] ?? 0;

                            return <Geography key={geo.rsmKey} geography={geo} fill={colorScale(clicks)} stroke="#DDD" />;
                        });
                    }}
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    );
}
