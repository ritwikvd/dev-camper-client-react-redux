import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { performFetch, handleLoadingUpdates } from "../../common/utils/utils";

const reviewsAdapter = createEntityAdapter({
	selectId: a => a._id,
	sortComparer: (a, b) => a.bootcamp.name.localeCompare(b.bootcamp.name)
});

const reviewsSlice = createSlice({
	name: "reviews",
	initialState: reviewsAdapter.getInitialState({ loading: "idle", alert: "" }),
	reducers: {
		updateReviews: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("reviews/retrieval/pending", state => {
				state.loading = "FETCHING";
			})
			.addCase("reviews/edit/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("reviews/retrieval/fulfilled", (state, { payload: { loading, alert, entities } }) => {
				state.loading = loading;
				state.alert = alert;
				entities && reviewsAdapter.setAll(state, entities);
			})
			.addCase("reviews/edit/fulfilled", (state, { payload: { loading, alert, data } }) => {
				state.loading = loading;
				state.alert = alert;
				data && reviewsAdapter.upsertOne(state, data);
			})
			.addCase("misc/submit_review/fulfilled", (state, { payload: { data: { review } } }) => reviewsAdapter.addOne(state, review))
			.addCase("auth/logout/fulfilled", () => reviewsAdapter.getInitialState({ loading: "idle", alert: "" }))
			.addMatcher(
				({ type }) => type.startsWith("reviews") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updateReviews } = reviewsSlice.actions;

//thunks
export const handleRetrieval = createAsyncThunk("reviews/retrieval", async (_, { dispatch }) => {
	const { success, error, message, data } = await performFetch(
		`${process.env.REACT_APP_API}/api/v1/reviews/user/${localStorage.getItem("ID")}`,
		{ method: "GET" }
	);

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateReviews);

	return { loading: "idle", alert: success ? "" : error || message, entities: data };
});

export const editReview = createAsyncThunk("reviews/edit", async (body, { dispatch }) => {
	const { success, error, message, data } = await performFetch(`${process.env.REACT_APP_API}/api/v1/reviews/${body.reviewID}`, {
		method: "PUT",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateReviews);

	return { loading: "idle", alert: success ? "" : error || message, data };
});

//selectors
export const reviewSelectors = reviewsAdapter.getSelectors(state => state.reviews);

export default reviewsSlice.reducer;
