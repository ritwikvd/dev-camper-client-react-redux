import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { performFetch, handleLoadingUpdates } from "../common/utils/utils";

const miscSlice = createSlice({
	name: "misc",
	initialState: { data: {}, loading: "idle", alert: "" },
	reducers: {
		updateMisc: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("auth/logout/fulfilled", () => ({ data: {}, loading: "idle", alert: "" }))
			.addCase("misc/submit_review/pending", state => {
				state.loading = "CREATING";
			})
			.addCase("misc/update_password/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("misc/reset_password/pending", state => {
				state.loading = "REDIRECTING";
			})
			.addCase("misc/retrieve_user_reviews/pending", state => {
				state.loading = "FETCHING";
			})
			.addCase("misc/edit_user_reviews/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("misc/delete_review/pending", state => {
				state.loading = "DELETING";
			})
			.addMatcher(
				({ type }) => ["misc/bootcamp/pending", "misc/bootcamp_reviews/pending"].includes(type),
				state => {
					state.loading = "FETCHING";
				}
			)
			.addMatcher(
				({ type }) => type.startsWith("misc") && type.endsWith("fulfilled"),
				(state, { payload }) => ({ ...state, ...payload })
			)
			.addMatcher(
				({ type }) => type.startsWith("misc") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updateMisc } = miscSlice.actions;

//thunks
export const getBootcamp = createAsyncThunk("misc/bootcamp", async ({ id }, { dispatch }) => {
	const { success, data, message, error } = await performFetch(`${process.env.REACT_APP_API}/api/v1/bootcamps/${id}`, { method: "GET" });

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateMisc);

	return { data: success ? data : {}, loading: "idle", alert: success ? "" : error || message };
});

export const getBootcampReviews = createAsyncThunk("misc/bootcamp_reviews", async ({ id }, { dispatch }) => {
	const { success, data, message, error } = await performFetch(`${process.env.REACT_APP_API}/api/v1/bootcamps/${id}/reviews`, {
		method: "GET"
	});

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateMisc);

	return { data: success ? data : {}, loading: "idle", alert: success ? "" : error || message };
});

export const submitReview = createAsyncThunk("misc/submit_review", async ({ id, body }, { dispatch }) => {
	const { success, message, error } = await performFetch(`${process.env.REACT_APP_API}/api/v1/bootcamps/${id}/reviews`, {
		method: "POST",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "CREATED" : "FAILED"], dispatch, updateMisc);

	return { data: { submitted: success }, loading: "idle", alert: success ? "" : error || message };
});

export const updatePassword = createAsyncThunk("misc/update_password", async (body, { dispatch }) => {
	const { success, message, error } = await performFetch(`${process.env.REACT_APP_API}/api/v1/auth/updatepassword`, {
		method: "PUT",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateMisc);

	return { data: { updated: success }, loading: "idle", alert: success ? "" : error || message };
});

export const resetPassword = createAsyncThunk("misc/reset_password", async ({ email }) => {
	const { success, error, message, resetToken } = await performFetch(`${process.env.REACT_APP_API}/api/v1/auth/password`, {
		method: "POST",
		body: JSON.stringify({
			email
		})
	});

	return { data: { resetToken }, loading: "idle", alert: success ? "" : error || message };
});

export const handleReviewRetrieval = createAsyncThunk("misc/retrieve_user_reviews", async (_, { dispatch }) => {
	const { success, error, message, data } = await performFetch(
		`${process.env.REACT_APP_API}/api/v1/reviews/user/${localStorage.getItem("ID")}`,
		{ method: "GET" }
	);

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateMisc);

	return { loading: "idle", alert: success ? "" : error || message, data };
});

export const editReview = createAsyncThunk("misc/edit_user_reviews", async (body, { dispatch }) => {
	const { success, error, message } = await performFetch(`${process.env.REACT_APP_API}/api/v1/reviews/${body.reviewID}`, {
		method: "PUT",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateMisc);

	return { loading: "idle", alert: success ? "" : error || message, data: { edited: success } };
});

export const deleteReview = createAsyncThunk("misc/delete_review", async ({ id }, { dispatch, getState }) => {
	const { success, error, message } = await performFetch(`${process.env.REACT_APP_API}/api/v1/reviews/${id}`, {
		method: "DELETE"
	});

	await handleLoadingUpdates([success ? "DONE" : "FAILED"], dispatch, updateMisc);

	let data = getState().misc.data;

	data = success ? data.filter(r => r._id !== id) : data;

	return { loading: "idle", alert: success ? "" : error || message, data };
});

export default miscSlice.reducer;
