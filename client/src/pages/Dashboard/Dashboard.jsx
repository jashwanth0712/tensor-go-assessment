import React, { useEffect, useState } from 'react';
import styles from "../Home/styles.module.css";

const calculateDateDifference = (dueDate) => {
  const currentDate = new Date();
  const parsedDueDate = new Date(dueDate);
  const differenceMs = parsedDueDate - currentDate;
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  return differenceDays;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Extracts only the date part
};

const Dashboard = (userDetails) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    recipientEmail: '',
    dueDate: '',
    billAmount: 0,
    ownerEmail:''
    // Add other fields as needed for invoice creation
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCreateInvoice = async () => {
    try { 
      const response = await fetch('http://localhost:3001/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvoiceData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      toggleModal();
    } catch (error) {
      console.error('There was a problem creating the invoice:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoiceData({
      ...newInvoiceData,
      [name]: value,
      ownerEmail: user._json.email,

    });
  };

  const user = userDetails.user;
console.log(">user",user)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/invoices/${user._json.email}`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (error) {
        console.error('There was a problem fetching data:', error);
      }
    };

    fetchData();
  }, [showModal]);

  useEffect(() => {
    let filtered = invoices.filter((invoice) => {
      return (
        invoice.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedStatus === 'all' || invoice.status === selectedStatus) &&
        (!startDate || new Date(invoice.dueDate) >= new Date(startDate)) &&
        (!endDate || new Date(invoice.dueDate) <= new Date(endDate))
      );
    });

    filtered.sort((a, b) => {
      const amountA = a.billAmount;
      const amountB = b.billAmount;
      if (sortOrder === 'asc') {
        return amountA - amountB;
      } else {
        return amountB - amountA;
      }
    });

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, selectedStatus, startDate, endDate, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div>
      <h1>Invoices</h1>
      <main className={styles.table}>
          <div style={{margin:"10px",backgroundColor:"#fff5"}} className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search by email"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.inputFields}
      />
      <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className={styles.inputFields}
      >
        <option value="all">All Status</option>
        <option value="not paid">Not Paid</option>
        <option value="paid">Paid</option>
        {/* Add other status options */}
      </select>
      <label className={styles.labelStyles}>Sort by Amount:</label>
      <select
        value={sortOrder}
        onChange={handleSortChange}
        className={styles.inputFields}
      >
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>
      <label className={styles.labelStyles}>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className={styles.inputFields}
      />
      <label className={styles.labelStyles}>End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className={styles.inputFields}
      />
          <button onClick={toggleModal} className={styles.button9}>
            Create Invoice
          </button>

          {showModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                {/* Form for creating new invoice */}
                <label>Recipient Email:</label>
                <input
                  type="text"
                  name="recipientEmail"
                  value={newInvoiceData.recipientEmail}
                  onChange={handleInputChange}
                />

                <label>Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newInvoiceData.dueDate}
                  onChange={handleInputChange}
                />

                <label>Bill Amount:</label>
                <input
                  type="number"
                  name="billAmount"
                  value={newInvoiceData.billAmount}
                  onChange={handleInputChange}
                />

                <button onClick={handleCreateInvoice} className={styles.button9}>Submit</button>
                <button onClick={toggleModal}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        {!showModal&&<section className={`${styles.table}__body`}>
          <table>
            <thead>
              <tr>
                <th>Invoice mail</th>
                <th>Bill Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.recipientEmail}</td>
                  <td>₹{invoice.billAmount}</td>
                  <td>
                  <div className={
                        calculateDateDifference(invoice.dueDate) < 0
                        ? styles.statuscancelled
                        : calculateDateDifference(invoice.dueDate) < 10
                        ? styles.statuspending
                        : styles.statusdelivered
                    }>
                        {formatDate(invoice.dueDate)}
                    </div>
                  </td>
                  <td>
                    <div className={
                        invoice.status== 'not paid'
                        ? styles.statuscancelled
                        :styles.statusdelivered
                    }>
                    {invoice.status}
                    </div>
                    </td>
                  <td>
                    {invoice.status=='not paid'?
                    <button>Remind</button>
                    :    
                    <button>Get reciept</button>
                }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>}
        {
            invoices.length==0 && 
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <h1 style={{fontSize:"5rem"}}>😅</h1>
                <h3>create  invoices to view them in dashboard</h3>
            </div>
        }
      </main>
    </div>
  );
};

export default Dashboard;
