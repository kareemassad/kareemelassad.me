import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { getUniqueCountries } from './bellsData';

// Simplified country name mappings for GeoJSON matching
const countryNameMappings = {
    'United States': 'United States of America',
    'Czechia': 'Czech Republic',
    'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
    'United Arab Emirates': 'United Arab Emirates', 
    'United Kingdom': 'United Kingdom',
    'Cayman Islands': 'Cayman Islands',
    'Antigua and Barbuda': 'Antigua and Barbuda',
    'Costa Rica': 'Costa Rica',
    'South Africa': 'South Africa'
};

// Reverse mapping for when GeoJSON uses different names
const reverseCountryMappings = {
    'United States of America': 'United States',
    'Czech Republic': 'Czechia',
    'USA': 'United States',
    'US': 'United States'
};

const CountryHighlight = ({ bellsData }) => {
    const [countryGeoData, setCountryGeoData] = useState(null);
    const [bellCountries, setBellCountries] = useState(new Set());
    const [countryCounts, setCountryCounts] = useState(new Map());

    useEffect(() => {
        // Get unique countries from bell data and count bells per country
        const countries = getUniqueCountries(bellsData);
        const allCountryNames = new Set();
        countries.forEach(country => {
            allCountryNames.add(country); // Original name
            const mapped = countryNameMappings[country];
            if (mapped) {
                allCountryNames.add(mapped); // Mapped name
            }
        });
        setBellCountries(allCountryNames);

        // Count bells per country
        const counts = new Map();
        bellsData.forEach(bell => {
            if (bell.country && !bell.special) {
                const mappedCountry = countryNameMappings[bell.country] || bell.country;
                counts.set(bell.country, (counts.get(bell.country) || 0) + 1); // Store original country name
                if (mappedCountry !== bell.country) {
                    counts.set(mappedCountry, (counts.get(mappedCountry) || 0) + 1); // Also store mapped name
                }
            }
        });
        setCountryCounts(counts);

        // Load simplified world countries GeoJSON
        fetchCountriesGeoJSON();
    }, [bellsData]);

    const fetchCountriesGeoJSON = async () => {
        try {
            // Using Natural Earth data which has consistent country names
            const response = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const geoData = await response.json();
            setCountryGeoData(geoData);
        } catch (error) {
            console.warn('Failed to load country boundaries:', error);
            
            // Fallback to alternative source
            try {
                const fallbackResponse = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    setCountryGeoData(fallbackData);
                }
            } catch (fallbackError) {
                console.warn('Fallback also failed:', fallbackError);
            }
        }
    };

    const checkCountryMatch = (geoCountryName) => {
        // Safety check - don't match empty/undefined names
        if (!geoCountryName || typeof geoCountryName !== 'string') {
            return false;
        }
        
        // Direct match
        if (bellCountries.has(geoCountryName)) {
            return true;
        }
        
        // Check reverse mapping (GeoJSON name -> our data name)
        const reverseMapped = reverseCountryMappings[geoCountryName];
        if (reverseMapped && bellCountries.has(reverseMapped)) {
            return true;
        }
        
        // Check if any of our bell countries map to this GeoJSON country
        for (const bellCountry of bellCountries) {
            const mapped = countryNameMappings[bellCountry];
            if (mapped === geoCountryName) {
                return true;
            }
        }
        
        return false;
    };

    const getCountryStyle = (feature) => {
        // Try multiple property names in order of preference
        const possibleNames = [
            feature.properties.ADMIN,
            feature.properties.NAME,
            feature.properties.NAME_EN,
            feature.properties.NAME_LONG,
            feature.properties.SOVEREIGNT,
            feature.properties.name,
            feature.properties.admin,
            feature.properties.country
        ].filter(name => name && typeof name === 'string');

        let hasBells = false;
        
        // Check each possible name
        for (const countryName of possibleNames) {
            if (checkCountryMatch(countryName)) {
                hasBells = true;
                break;
            }
        }
        
        return {
            fillColor: hasBells ? '#dc3545' : 'transparent',
            weight: 1,
            opacity: 0.4,
            color: '#999',
            fillOpacity: hasBells ? 0.25 : 0
        };
    };

    const getBellCountForCountry = (geoCountryName) => {
        // Try direct match first
        if (countryCounts.has(geoCountryName)) {
            return countryCounts.get(geoCountryName);
        }
        
        // Try reverse mapping
        const reverseMapped = reverseCountryMappings[geoCountryName];
        if (reverseMapped && countryCounts.has(reverseMapped)) {
            return countryCounts.get(reverseMapped);
        }
        
        // Try forward mapping
        for (const [bellCountry, count] of countryCounts.entries()) {
            const mapped = countryNameMappings[bellCountry];
            if (mapped === geoCountryName) {
                return count;
            }
        }
        
        return 0;
    };

    const onEachCountry = (feature, layer) => {
        // Try multiple property names in order of preference
        const possibleNames = [
            feature.properties.ADMIN,
            feature.properties.NAME,
            feature.properties.NAME_EN,
            feature.properties.NAME_LONG,
            feature.properties.SOVEREIGNT,
            feature.properties.name,
            feature.properties.admin,
            feature.properties.country
        ].filter(name => name && typeof name === 'string');

        let hasBells = false;
        let matchedCountryName = null;
        let bellCount = 0;
        
        // Check each possible name and get bell count
        for (const countryName of possibleNames) {
            if (checkCountryMatch(countryName)) {
                hasBells = true;
                matchedCountryName = countryName;
                bellCount = getBellCountForCountry(countryName);
                if (bellCount > 0) break; // If we found bells, use this name
            }
        }
        
        if (hasBells && matchedCountryName) {
            const bellText = bellCount === 1 ? '1 bell' : `${bellCount} bells`;
            layer.bindPopup(`<strong>${matchedCountryName}</strong><br/>${bellText} in collection`);
            
            layer.on({
                mouseover: (e) => {
                    e.target.setStyle({
                        weight: 2,
                        fillOpacity: 0.4,
                        color: '#dc3545'
                    });
                },
                mouseout: (e) => {
                    e.target.setStyle(getCountryStyle(feature));
                }
            });
        }
    };

    if (!countryGeoData) {
        return null;
    }

    return (
        <GeoJSON
            data={countryGeoData}
            style={getCountryStyle}
            onEachFeature={onEachCountry}
        />
    );
};

export default CountryHighlight;