import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function Login() {
	const googleAuth = () => {
		window.open(
			`http://localhost:8080/auth/google/callback`,
			"_self"
		);
	};
	
	return (
		<div className={styles.container} style={{marginTop:"10vh"}}>
					<h1>Sign in to get started</h1>
					<h4>👉Frontend - React</h4>
					<h4>👉Backend - Node.js , Rabbitmq [message broker]</h4>
					<h4>👉Authentication - Google oauth</h4>
					<h4>👉since the Oauth is not verified, we have to white list emails to be able to login</h4>
					<p>please mail cs20b1007@iiitdm.ac.in to get whitelisted </p>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sing in with Google</span>
					</button>
					<img className={styles.homeimg} src="./images/homepage.png" alt="login" />
		</div>
	);
}

export default Login;
