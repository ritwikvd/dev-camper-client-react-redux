import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { performFetch, handleLoadingUpdates } from "../../common/utils/utils";

const initialState = {
	email: localStorage.getItem("EMAIL") || "",
	session: localStorage.getItem("EMAIL") ? "active" : "inactive",
	loading: "idle",
	alert: "",
	name: localStorage.getItem("NAME") || ""
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		updateAuth: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("auth/reset_pass_and_login/pending", state => {
				state.loading = "RESETTING";
			})
			.addCase("auth/update_account/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("auth/logout/pending", state => {
				state.loading = "LOGGING OUT";
			})
			.addMatcher(
				({ type }) => type.startsWith("auth") && type.endsWith("fulfilled"),
				(state, { payload }) => ({ ...state, ...payload })
			)
			.addMatcher(
				({ type }) => type.startsWith("auth") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { logoutSession, updateAuth } = authSlice.actions;

export const handleLoginOrRegistration = createAsyncThunk("auth/update_auth_state", async (body, { dispatch }) => {
	dispatch(updateAuth({ loading: body.role ? "REGISTERING" : "LOGGING IN" }));

	const { success, token, message, error, user } = await performFetch(
		`${process.env.REACT_APP_API}/api/v1/auth/${body.role ? "register" : "login"}`,
		{
			method: "POST",
			body: JSON.stringify(body)
		}
	);

	const loadingArray = [success ? "READY" : "FAILED"];

	body.role && loadingArray.unshift("LOGGING IN");

	await handleLoadingUpdates(loadingArray, dispatch, updateAuth);

	success &&
		[
			["TOKEN", token],
			["EMAIL", user.email],
			["NAME", user.name],
			["ROLE", user.role],
			["ID", user.id]
		].forEach(([a, b]) => localStorage.setItem(a, b));

	return {
		email: body.email,
		session: success ? "active" : "inactive",
		loading: "idle",
		alert: success ? "" : error || message,
		name: user?.name || ""
	};
});

export const handlePasswordReset = createAsyncThunk("auth/reset_pass_and_login", async ({ email, resetToken, password }, { dispatch }) => {
	const { success, token, data, error, user } = await performFetch(`${process.env.REACT_APP_API}/api/v1/auth/password/${resetToken}`, {
		method: "PUT",
		body: JSON.stringify({ password })
	});

	const loadingArray = success ? ["RESET", "LOGGING IN", "READY"] : ["FAILED"];

	await handleLoadingUpdates(loadingArray, dispatch, updateAuth);

	success &&
		[
			["TOKEN", token],
			["EMAIL", user.email],
			["NAME", user.name],
			["ROLE", user.role],
			["ID", user.id]
		].forEach(([a, b]) => localStorage.setItem(a, b));

	return {
		email,
		session: success ? "active" : "inactive",
		loading: "idle",
		alert: success ? "" : error || data,
		name: user.name
	};
});

export const handleLogout = createAsyncThunk("auth/logout", async payload => {
	await new Promise(res => setTimeout(res, 500));

	const { success, error } = await performFetch(`${process.env.REACT_APP_API}/api/v1/auth/logout`, { method: "GET" });

	if (!success) console.error(error);

	["TOKEN", "EMAIL", "NAME", "ROLE", "ID"].forEach(a => localStorage.removeItem(a));

	return { ...payload, ...{ loading: "idle" } };
});

export const handleAccountUpdate = createAsyncThunk("auth/update_account", async (body, { dispatch }) => {
	const { success, error, message } = await performFetch(`${process.env.REACT_APP_API}/api/v1/auth/updatedetails`, {
		method: "PUT",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateAuth);

	const alert = success ? "" : error || message;

	localStorage.setItem("NAME", body.name);
	localStorage.setItem("EMAIL", body.email);

	if (!success) return { loading: "idle", alert };

	return { email: body.email, name: body.name, loading: "idle", alert };
});

//selectors here

export default authSlice.reducer;
