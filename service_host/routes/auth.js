const router = require("express").Router();
const passport = require("passport");
const { google } = require("googleapis");
const searchWord = 'sample'
router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});
// Endpoint to return the access token
router.get("/getAccessToken", (req, res) => {
    if (req.user && req.user.accessToken) {
        res.json({ access_token: req.user.accessToken });
    } else {
        res.status(401).json({ message: "Access token not found" });
    }
});
// Function to fetch the latest 100 emails from the inbox
const getLatestEmails = (accessToken, callback) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accessToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    gmail.users.messages.list({
        userId: "me",
        maxResults: 100,
        q: "in:inbox",
    }, (err, response) => {
        if (err) {
            callback(err, null);
            return;
        }

        const messages = response.data.messages;
        const emails = [];
        let processed_emails=0;
        messages.forEach((message) => {
            gmail.users.messages.get({
                userId: "me",
                id: message.id,
            }, (err, email) => {
                if (err) {
                    callback(err, null);
                    return;
                }

                const emailInfo = {
                    subject: '',
                    date: '',
                    senderName: '',
                    senderMail: '',
                    body: '',
                };
                let hasInvoice = false;

                const headers = email.data.payload.headers;
                headers.forEach((header) => {
                    if (header.name === 'Subject') {
                        if (header.value.toLowerCase().includes(searchWord)) {
                            hasInvoice = true;
                        }
                        emailInfo.subject = header.value;
                    } else if (header.name === 'From') {
                        const senderInfo = header.value.match(/(.+)<(.+)>/);
                        if (senderInfo && senderInfo.length === 3) {
                            emailInfo.senderName = senderInfo[1].trim();
                            emailInfo.senderMail = senderInfo[2].trim();
                        } else {
                            emailInfo.senderMail = header.value.trim();
                        }
                    } else if (header.name === 'Date') {
                        emailInfo.date = header.value;
                    }
                });
                if (email.data.snippet.toLowerCase().includes(searchWord)) {
                    hasInvoice = true;
                }
                const body = email.data.snippet || ''; // Using snippet as a sample; could use full body if needed

                emailInfo.body = body;
                if(hasInvoice){
                    emails.push(emailInfo);
                }
                processed_emails+=1;
                if (processed_emails === messages.length) {
                    callback(null, emails);
                }
            });
        });
    });
};

// Endpoint to get the latest 100 emails from the inbox
router.get("/getInvoiceEmails", (req, res) => {
    if (req.user && req.user.accessToken) {
        getLatestEmails(req.user.accessToken, (err, emails) => {
            if (err) {
                res.status(500).json({ error: true, message: "Failed to fetch emails", err: err });
                return;
            }
            res.json(emails);
        });
    } else {
        res.status(401).json({ message: "Access token not found" });
    }
});

module.exports = router;
