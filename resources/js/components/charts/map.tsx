import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
interface CountryStat {
    country_code: string;
    count: number;
}

interface CountryMapProps {
    countryStats: CountryStat[];
}

export default function CountryMap({ countryStats }: CountryMapProps) {
    const colorScale = (count: number): string => {
        if (count > 100) return '#FF5733';
        if (count > 50) return '#FFC300';
        if (count > 0) return '#DAF7A6';
        return '#E0E0E0';
    };

    // Convert stats to a map for fast lookup
    const countryMap: Record<string, number> = Object.fromEntries(countryStats.map(({ country_code, count }) => [country_code, count]));

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
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo) => {
                            const code = geo.properties.name;
                            const clicks = countryMap[code] ?? 0;

                            return <Geography key={geo.rsmKey} geography={geo} fill={colorScale(clicks)} stroke="#DDD" />;
                        })
                    }
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    );
}
