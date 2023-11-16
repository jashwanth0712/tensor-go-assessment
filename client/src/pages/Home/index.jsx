import React, { useState, useEffect } from 'react';
import styles from "./styles.module.css";
function Home(userDetails) {
	const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, []);
	const user = userDetails.user;
	const fetchEmails = async () => {
		try {
		  if (!userDetails || !userDetails.user || !userDetails.user.accessToken) {
			console.error('User details/access token not available');
			return;
		  }
		  const response = await fetch('http://localhost:8080/auth/getInvoiceEmails', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  accessToken: user.accessToken,
			  // Any other necessary data for the request
			}),
		  });
		  
	  
		  if (response.ok) {
			const data = await response.json();
			setEmails(data);
		  } else {
			console.error('Failed to fetch emails:', response.status);
		  }
		} catch (error) {
		  console.error('Error fetching emails:', error);
		}
	  };
	  
	return (
		<div>
		<h2>Email List</h2>
		<table className={styles.emailTable}>
		  <thead>
			<tr>
			  <th>Subject</th>
			  <th>Date</th>
			  <th>Sender Name</th>
			  <th>Sender Mail</th>
			  <th>Body</th>
			</tr>
		  </thead>
		  <tbody>
			{emails.map((email, index) => (
			  <tr key={index}>
				<td>{email.subject}</td>
				<td>{email.date}</td>
				<td>{email.senderName}</td>
				<td>{email.senderMail}</td>
				<td>{email.body}</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	);
}

export default Home;
