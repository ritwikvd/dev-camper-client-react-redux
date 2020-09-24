import React, { Suspense, useState, useEffect } from "react";
import ReactDOM from "react-dom";
// import App from "./app/App";
import store from "./app/store";
import { Provider } from "react-redux";

const appPromise = import("./app/App");
const App = React.lazy(() => appPromise);

const Index = () => {
	const [showApp, setShowApp] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowApp(true);
		}, 1000);
	}, []);

	return (
		<React.StrictMode>
			<Provider store={store}>
				{showApp || (
					<main className="main-login">
						<p className="loading align-center">INITIALIZING</p>
					</main>
				)}
				<Suspense fallback={null}>{showApp && <App />}</Suspense>
			</Provider>
		</React.StrictMode>
	);
};

ReactDOM.render(<Index />, document.getElementById("root"));
