import React, { useState, useEffect } from 'react';
import styles from "./styles.module.css";

function Home(userDetails) {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
				setIsLoading(false); // Set loading state to false after fetching

            } else {
                console.error('Failed to fetch emails:', response.status);
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setIsLoading(false); // Set loading state to false after fetching
        }
    };

    const handleDetailsClick = (email) => {
        setSelectedEmail(email);
    };

    const handleClosePopup = () => {
        setSelectedEmail(null);
    };

    const handleGenerateInvoices = async () => {
		setIsLoading(true); // Set loading state to false after fetching

        try {
            const response = await fetch('http://localhost:8080/template/sendmails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user._json.email }),
            });

            if (response.ok) {
                setTimeout(() => {
				setIsLoading(false); // Set loading state to false after fetching

                    window.location.reload();
                }, 2000);
                // Successful request
                // Perform any action upon successful POST
            } else {
                console.error('Failed to generate invoices:', response.status);
            }
        } catch (error) {
            console.error('Error generating invoices:', error);
        }
    };

    return (
        <div style={{ margin: "15vh" }}>
            {isLoading && <h1>Loading...</h1>}
            {emails.length === 0 && !isLoading && (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <h1 style={{ fontSize: "8rem" }}>😅</h1>
                    <h1>You do not have any recent Invoices</h1>
                    <button onClick={handleGenerateInvoices} className={styles.button18}>
                        Click to generate random invoices
                    </button>
                </div>
            )}
            {!selectedEmail && emails.length > 0 && (
                <main className="table">
                    <section className="table__body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Sender Name</th>
                                    <th>Sender Mail</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.map((email, index) => (
                                    <tr key={index}>
                                        <td>{email.subject}</td>
                                        <td>{email.date}</td>
                                        <td>{email.senderName}</td>
                                        <td>{email.senderMail}</td>
                                        <td>
                                            <button onClick={() => handleDetailsClick(email)}>Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </main>
            )}
            {selectedEmail && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <span className={styles.close} onClick={handleClosePopup}>
                            &times;
                        </span>
                        <div className={styles.emailDetails}>
                            <h2 className={styles.subject}>{selectedEmail.subject}</h2>
                            <p className={styles.sender}>
                                <strong>From:</strong> {selectedEmail.senderMail}
                            </p>
                            <p className={styles.date}>
                                <strong>Sent:</strong> {selectedEmail.date}
                            </p>
                            <p className={styles.body}>{selectedEmail.body}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
