import React, { useState } from "react";

const Image = ({ src }) => {
	const [show, setShow] = useState(false);

	return (
		<div className="image-container">
			<p className={`loading ${show ? "none" : ""}`}>LOADING</p>
			<img className={show ? "" : "place-below"} onLoad={() => setShow(true)} alt="Bootcamp Image" src={src} />
		</div>
	);
};

export default Image;
