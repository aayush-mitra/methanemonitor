'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PlumeConcentrationChart from '../components/PlumeConcentrationChart';
import Image from 'next/image';

// Dynamically load Leaflet components
const MapWithNoSSR = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function HomePage() {
  const [plumeData, setPlumeData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);

  useEffect(() => {
    fetchPlumeData();
  }, []);

  const fetchPlumeData = async () => {
    const res = await fetch('/api/aggregate');
    const data = await res.json();
    const aggregatedData = aggregateByMonth(data); // Process data by month
    setPlumeData(aggregatedData);
  };

  const aggregateByMonth = (data) => {
    const monthMap = {};
    data.forEach((plume) => {
      if (plume?.properties) {
        const date = new Date(plume.properties['UTC Time Observed']);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = [];
        }
        monthMap[monthKey].push(plume);
      }
    });
    return Object.values(monthMap);
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(Number(e.target.value)); // Update current month displayed
  };

  const getFormattedMonthYear = (monthIndex) => {
    const baseDate = new Date(2022, 10);
    baseDate.setMonth(baseDate.getMonth() + monthIndex);
    return baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <header>
        <nav>
          <div className="left">
            <div className="logo">
              <img src='/logo.png' alt="" />
            </div>
          </div>
          <div className="right">
            <div className="link">
              <a href="#">Forum</a>
            </div>
            <div className="link">
              <a href="">Login</a>
            </div>
          </div>
        </nav>
      </header>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Monitor Methane, <br />
            Protect Our Planet
          </h1>
          <h3>
            Explore real-time data on methane emissions, understand the science
            behind climate change, and join a community working towards a greener
            future. Together, we can take action for a sustainable tomorrow.
          </h3>
          <div className="buttons">
            <a href="#methane"><div className="button1">Learn More</div></a>
            <div className="button2">Discuss Solutions</div>
          </div>
        </div>
      </section>
      <section id='methane' className="methane-map">
        <h1>Methane Plumes Visualization</h1>
        <label>
          Select Month: {getFormattedMonthYear(currentMonth)}
          <input
            type="range"
            min="0"
            max={plumeData.length - 1}
            value={currentMonth}
            onChange={handleMonthChange}
          />
        </label>

        {plumeData.length > 0 && (
          <MapWithNoSSR
            center={[37.7749, -122.4194]} // Example center, adjust as needed
            zoom={5}
            style={{ height: '500px', width: '80%' }}
          >
            <TileLayer
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {plumeData[currentMonth].map((plume, index) => (
              <Marker
                position={[
                  plume.properties['Latitude of max concentration'],
                  plume.properties['Longitude of max concentration'],
                ]}
                key={index}
              >
                <Popup>
                  Max concentration at location: {plume.properties['Latitude of max concentration']},{' '}
                  {plume.properties['Longitude of max concentration']}
                </Popup>
              </Marker>
            ))}
          </MapWithNoSSR>
        )}
      </section>
      <section className="methane-map">
        <PlumeConcentrationChart plumeData={plumeData} />
      </section>
      <section className="information">
        <h1>Information</h1>
        <div className="info-boxes">
        <div className="info">
        <div className="image">
          <img src='/image2.avif' alt="" />
        </div>
        <div className="text">
          <h2>The Methane Problem</h2>
          <p className="subtitle">
            How Methane Contributes to the Climate Crisis
          </p>
          <p>
            Although methane breaks down in the atmosphere faster than carbon
            dioxide, it is over 80 times more powerful at warming the planet in
            the short term. This means that even small increases in methane
            emissions can accelerate global warming and intensify climate
            impacts, from more extreme weather events to rising sea levels.
            Reducing methane emissions now is critical for slowing the pace of
            climate change.
          </p>
        </div>
      </div>
      <div className="info">
        <div className="image">
        <img src='/image3.avif' alt="" />
        </div>
        <div className="text">
          <h2>Tracking Methane Emissions</h2>
          <p className="subtitle">
            The Importance of Monitoring Methane for a Greener Future
          </p>
          <p>
            Accurately mapping and monitoring methane emissions is essential for
            understanding where they come from and how to control them. With the
            help of satellite technology and data analysis, we can identify
            methane "hot spots" and develop targeted strategies to reduce
            emissions. Tools like the Methane Monitor can help visualize these
            emissions, empowering governments and communities to take action.
          </p>
        </div>
      </div>
      <div className="info">
        <div className="image">
        <img src='/image4.avif' alt="" />
        </div>
        <div className="text">
          <h2>Mitigating Methane: A Climate Solution</h2>
          <p className="subtitle">
            The Urgent Need to Control Methane Emissions
          </p>
          <p>
            Reducing methane emissions is one of the fastest and most
            cost-effective ways to slow global warming. By implementing better
            practices in industries like agriculture, waste management, and
            energy production, we can significantly reduce methane release.
            Achieving global methane reduction goals could make a substantial
            difference in meeting climate targets and protecting the planet for
            future generations.
          </p>
        </div>
      </div>
        </div>
      </section>
      <div className="helpout">
        <div className="helpout-content">
          <h1>Join the Methane Mitigation Movement</h1>
          <div className="btn">Discuss Solutions</div>
        </div>
      </div>
      <footer>© MethaneMonitor 2024</footer>
    </>
  );
}