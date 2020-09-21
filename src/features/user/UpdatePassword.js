import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, updateMisc } from "../miscSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const UpdatePassword = () => {
	const {
		data: { updated }
	} = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	const [current, setCurrent] = useState("");
	const [newPass, setNew] = useState("");
	const [confirm, setConfirm] = useState("");

	useEffect(() => {
		updated && (setConfirm("") || setCurrent("") || setNew(""));
	}, [updated]);

	const handleSubmit = async e => {
		e.preventDefault();
		if (newPass.length < 6 || current.length < 6)
			return dispatch(updateMisc({ alert: "Your password needs to contain atleast 6 characters" }));
		if (newPass !== confirm) return dispatch(updateMisc({ alert: "Your passwords need to match" }));
		dispatch(updatePassword({ currentPassword: current, newPassword: newPass }));
	};

	if (loading) return <main className="main-update-pass">{loading}</main>;

	return (
		<main className="main-update-pass">
			<form onSubmit={handleSubmit} className="form-update-pass">
				<div className="alert-container align-center">
					<h1>Set a new password</h1>
					{alert && <div>{alert}</div>}
				</div>
				<input type="password" placeholder="Current Password" value={current} onChange={e => setCurrent(e.target.value)} required />
				<input type="password" placeholder="New Password" value={newPass} onChange={e => setNew(e.target.value)} required />
				<input type="password" placeholder="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
				<button type="submit">Update</button>
			</form>
		</main>
	);
};

export default UpdatePassword;
