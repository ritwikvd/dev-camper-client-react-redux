import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { performFetch, handleLoadingUpdates } from "../../common/utils/utils";

const bootcampsAdapter = createEntityAdapter({
	selectId: a => a._id,
	sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const addedStateEntities = {
	loading: "idle",
	alert: "",
	page: 1
};

const bootcampSlice = createSlice({
	name: "bootcamps",
	initialState: bootcampsAdapter.getInitialState(addedStateEntities),
	reducers: {
		updateBootcamps: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("bootcamps/pagination/fulfilled", (state, { payload: { entities, ...rest } }) => {
				for (let a in rest) state[a] = rest[a];
				bootcampsAdapter.setAll(state, entities);
			})
			.addCase("bootcamps/retrieval/fulfilled", (state, { payload: { entities, ...rest } }) => {
				for (let a in rest) state[a] = rest[a];
				bootcampsAdapter.setAll(state, entities);
			})
			.addCase("auth/logout/fulfilled", () => bootcampsAdapter.getInitialState(addedStateEntities))
			.addMatcher(
				({ type }) => type.startsWith("bootcamps") && type.endsWith("pending"),
				state => {
					state.loading = "FETCHING";
				}
			)
			.addMatcher(
				({ type }) => type.startsWith("bootcamps") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updateBootcamps } = bootcampSlice.actions;

//thunks
export const handleRetrieval = createAsyncThunk("bootcamps/retrieval", async ({ zip, miles, rating } = {}, { dispatch }) => {
	const url = `${process.env.REACT_APP_API}/api/v1/bootcamps?limit=5&page=1${rating ? `&averageRating[gt]=${rating}` : ""}${
		zip ? `&zip=${zip}&miles=${miles}` : ""
	}`;

	const {
		success,
		data,
		error,
		message,
		pagination: { total }
	} = await performFetch(url, { method: "GET" });

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateBootcamps);

	return { loading: "idle", alert: success ? "" : error || message, entities: data, total, query: url, page: 1 };
});

export const handlePagination = createAsyncThunk("bootcamps/pagination", async ({ page }, { dispatch, getState }) => {
	const url = getState().bootcamps.query.replace(/page=\d/, `page=${page}`);

	const { success, data, error, message } = await performFetch(url, { method: "GET" });

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateBootcamps);

	return { loading: "idle", alert: success ? "" : error || message, entities: data, page };
});

//selectors
export const bootcampSelectors = bootcampsAdapter.getSelectors(state => state.bootcamps);

export default bootcampSlice.reducer;
