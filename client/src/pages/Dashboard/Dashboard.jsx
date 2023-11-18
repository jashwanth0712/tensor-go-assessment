import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [invoices, setInvoices] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/invoices');
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setInvoices(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('There was a problem fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Invoices</h1>
      <pre>{invoices}</pre>
    </div>
  );
};

export default Dashboard;
