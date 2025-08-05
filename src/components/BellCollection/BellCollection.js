import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import './BellCollection.scss';
import { bellsData } from './bellsData';
import { processedBellsData } from './coordinateUtils';
import CountryHighlight from './CountryHighlight';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

// City marker (blue)
const cityIcon = L.icon({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const BellCollection = () => {
    const [bellsWithCoordinates, setBellsWithCoordinates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState({
        totalBells: 0,
        totalCountries: 0,
        totalCities: 0,
        specialBells: 0,
        countryCounts: {},
        cityCounts: {},
        continentCounts: {}
    });

    const getContinent = (lat, lng) => {
        // Simplified continent detection based on coordinates
        if (lat >= 35 && lng >= -10 && lng <= 70) return 'Europe';
        if (lat >= -35 && lat <= 35 && lng >= -20 && lng <= 50) return 'Africa';
        if (lat >= 10 && lng >= 70 && lng <= 180) return 'Asia';
        if (lat >= -50 && lng >= 110 && lng <= 180) return 'Australia/Oceania';
        if (lng >= -170 && lng <= -30) return 'Americas';
        return 'Other';
    };

    const calculateStatistics = useCallback((rawBells, processedBells) => {
        const countryCounts = {};
        const cityCounts = {};
        const continentCounts = {};
        let specialBells = 0;

        rawBells.forEach(bell => {
            if (bell.special) {
                specialBells++;
                return;
            }
            
            if (bell.country) {
                countryCounts[bell.country] = (countryCounts[bell.country] || 0) + 1;
            }
            
            if (bell.city) {
                cityCounts[bell.city] = (cityCounts[bell.city] || 0) + 1;
            }
        });

        // Group by continents (simplified)
        processedBells.forEach(bell => {
            const continent = getContinent(bell.latitude, bell.longitude);
            continentCounts[continent] = (continentCounts[continent] || 0) + 1;
        });

        return {
            totalBells: rawBells.length,
            totalCountries: Object.keys(countryCounts).length,
            totalCities: Object.keys(cityCounts).length,
            specialBells,
            countryCounts,
            cityCounts,
            continentCounts
        };
    }, []);

    useEffect(() => {
        const loadBellsData = () => {
            try {
                setLoading(true);
                
                // Process the bells data instantly (no API calls needed)
                const processedBells = processedBellsData(bellsData);
                setBellsWithCoordinates(processedBells);
                
                // Calculate enhanced statistics
                const stats = calculateStatistics(bellsData, processedBells);
                setStatistics(stats);
                
                setError(null);
            } catch (err) {
                setError('Failed to load bell locations');
                console.error('Error loading bells:', err);
            } finally {
                setLoading(false);
            }
        };

        loadBellsData();
    }, [calculateStatistics]);

    // Get city pins count for display
    const cityPinsCount = bellsWithCoordinates.filter(bell => bell.city).length;

    if (loading) {
        return (
            <section id="bell-collection" className="bell-collection">
                <Container>
                    <Row>
                        <Col className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading bell locations...</span>
                            </Spinner>
                            <p className="mt-2">Loading bell collection...</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <section id="bell-collection" className="bell-collection">
                <Container>
                    <Row>
                        <Col>
                            <Alert variant="warning">
                                {error}. Some bell locations may not be displayed correctly.
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }

    return (
        <section id="bell-collection" className="bell-collection">
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2 className="section-title">Teta's Bell Collection</h2>
                        <p className="section-subtitle">
                            A collection of {statistics.totalBells} bells from {statistics.totalCountries} countries 
                            {statistics.specialBells > 0 && ` (plus ${statistics.specialBells} special bells)`}
                        </p>
                    </Col>
                </Row>
                
                <Row className="mb-4">
                    <Col>
                        <div className="map-container">
                            <MapContainer
                                center={[20, 0]}
                                zoom={2}
                                minZoom={1}
                                maxZoom={18}
                                maxBounds={[[-90, -180], [90, 180]]}
                                maxBoundsViscosity={1.0}
                                style={{ height: '500px', width: '100%' }}
                                className="bell-map"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    noWrap={true}
                                />
                                
                                {/* Country highlighting layer */}
                                <CountryHighlight bellsData={bellsData} />
                                
                                {/* Render city pins (blue markers) - only for bells with specific cities */}
                                {bellsWithCoordinates
                                    .filter(bell => bell.city && bell.latitude && bell.longitude) // Only show pins for bells that have a specific city and valid coordinates
                                    .map((bell, index) => (
                                        <Marker
                                            key={`city-${index}-${bell.city}-${bell.country}`}
                                            position={[bell.latitude, bell.longitude]}
                                            icon={cityIcon}
                                        >
                                            <Popup>
                                                <div>
                                                    <strong>{bell.city}</strong>
                                                    <div>{bell.country}</div>
                                                    {bell.displayName && (
                                                        <small className="text-muted">{bell.displayName}</small>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                            </MapContainer>
                        </div>
                        <div className="map-legend mt-2">
                            <small>
                                <span style={{color: '#3388ff'}}>● Blue pins</span>: Specific city locations | 
                                <span style={{color: '#dc3545'}}>▬ Red shading</span>: Countries with bells in collection
                            </small>
                            <div className="mt-2">
                                <small className="text-muted">
                                    <strong>Note:</strong> Countries are shaded red when we have bells from there. 
                                    Blue pins are dropped for specific cities, though we don't have complete city data for all bells in the collection.
                                </small>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg={3} md={6} className="mb-4">
                        <div className="stats-card">
                            <h4>Collection Overview</h4>
                            <div className="stats">
                                <div className="stat-item">
                                    <span className="stat-number">{statistics.totalBells}</span>
                                    <span className="stat-label">Total Bells</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{statistics.totalCountries}</span>
                                    <span className="stat-label">Countries</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{statistics.totalCities}</span>
                                    <span className="stat-label">Cities</span>
                                </div>
                                {statistics.specialBells > 0 && (
                                    <div className="stat-item">
                                        <span className="stat-number">{statistics.specialBells}</span>
                                        <span className="stat-label">Special Bells</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                    
                    <Col lg={3} md={6} className="mb-4">
                        <div className="stats-card">
                            <h4>Map Display</h4>
                            <div className="stats">
                                <div className="stat-item">
                                    <span className="stat-number" style={{color: '#3388ff'}}>{cityPinsCount}</span>
                                    <span className="stat-label">City Pins</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number" style={{color: '#dc3545'}}>{statistics.totalCountries}</span>
                                    <span className="stat-label">Highlighted Countries</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    
                    <Col lg={3} md={6} className="mb-4">
                        <div className="stats-card">
                            <h4>Top Countries</h4>
                            <div className="country-list">
                                {Object.entries(statistics.countryCounts)
                                    .sort(([,a], [,b]) => b - a)
                                    .slice(0, 6)
                                    .map(([country, count]) => (
                                        <div key={country} className="country-item">
                                            <span className="country-name">{country}</span>
                                            <span className="country-count">{count} bell{count > 1 ? 's' : ''}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Col>

                    <Col lg={3} md={6} className="mb-4">
                        <div className="stats-card">
                            <h4>By Continent</h4>
                            <div className="continent-list">
                                {Object.entries(statistics.continentCounts)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([continent, count]) => (
                                        <div key={continent} className="continent-item">
                                            <span className="continent-name">{continent}</span>
                                            <span className="continent-count">{count} bell{count > 1 ? 's' : ''}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default BellCollection;