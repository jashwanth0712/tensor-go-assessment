import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import Navbar from "./components/Navbar";
function App() {
	const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			const url = `http://localhost:8080/auth/login/success`;
			const { data } = await axios.get(url, { withCredentials: true });
			setUser(data.user._json);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<div className="container">
			<Navbar user={user}/>
			<Routes>
				<Route
					exact
					path="/"
					element={user ? <Home user={user} /> : <Navigate to="/login" />}
				/>
				<Route
					exact
					path="/login"
					element={user ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					path="/signup"
					element={user ? <Navigate to="/" /> : <Signup />}
				/>
			</Routes>
		</div>
	);
}

export default App;
