import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import BarChart from './BarChart';

const PlumeConcentrationChart = ({ plumeData }) => {
  const [monthlySums, setMonthlySums] = useState([]);

  useEffect(() => {
    // Aggregate plume data by month
    const aggregatePlumeDataByMonth = () => {
      const monthlyData = Array(12).fill(0); // Assuming 12 months in a year

      plumeData.forEach((plumes, monthIndex) => {
        const sumMaxConcentration = plumes.reduce(
          (acc, plume) => acc + plume.properties['Max Plume Concentration (ppm m)'],
          0
        );
        monthlyData[monthIndex] = sumMaxConcentration;
      });

      setMonthlySums(monthlyData);
    };

    aggregatePlumeDataByMonth();
  }, [plumeData]);

  return <BarChart data={monthlySums} />;
};

export default PlumeConcentrationChart;
