require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require("passport");
const authRoute = require("./routes/auth");
const templateRoute = require("./routes/template");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const app = express();
app.use(bodyParser.json());
app.use(
	cookieSession({
		name: "session",
		keys: ["jashwanth"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);
app.use("/template",templateRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
