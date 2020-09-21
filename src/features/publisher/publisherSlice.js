import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { performFetch, handleLoadingUpdates } from "../../common/utils/utils";

const initialState = {
	bootcamp: null,
	loading: "idle",
	alert: "",
	photoPath: ""
};

const publisherSlice = createSlice({
	name: "publisher",
	initialState,
	reducers: {
		updatePublisher: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("publisher/upload_image/pending", state => {
				state.loading = "UPLOADING IMAGE";
			})
			.addCase("publisher/pub_bootcamp/pending", state => {
				state.loading = "FETCHING";
			})
			.addCase("publisher/delete_course/pending", state => {
				state.loading = "DELETING";
			})
			.addCase("publisher/create_course/fulfilled", (state, { payload: { loading, alert, data } }) => {
				const { bootcamp } = state;
				const { courses } = bootcamp;

				state.loading = loading;
				state.alert = alert;

				if (!courses) bootcamp.courses = [data];
				else courses.push(data);
			})
			.addCase("publisher/edit_course/fulfilled", (state, { payload: { loading, alert, data } }) => {
				const { courses } = state.bootcamp;

				state.loading = loading;
				state.alert = alert;

				const index = courses.findIndex(a => a._id === data._id);
				courses[index] = data;
			})
			.addCase("publisher/delete_course/fulfilled", (state, { payload: { loading, alert, id } }) => {
				let { courses } = state.bootcamp;

				state.loading = loading;
				state.alert = alert;

				state.bootcamp.courses = courses.filter(a => a._id !== id);
			})
			.addCase("auth/logout/fulfilled", () => initialState)
			.addMatcher(
				({ type }) => ["publisher/edit_bootcamp/pending", "publisher/edit_course/pending"].includes(type),
				state => {
					state.loading = "UPDATING";
				}
			)
			.addMatcher(
				({ type }) => ["publisher/create_bootcamp/pending", "publisher/create_course/pending"].includes(type),
				state => {
					state.loading = "CREATING";
				}
			)
			.addMatcher(
				({ type }) =>
					[
						"publisher/create_bootcamp/fulfilled",
						"publisher/upload_image/fulfilled",
						"publisher/edit_bootcamp/fulfilled",
						"publisher/pub_bootcamp/fulfilled"
					].includes(type),
				(state, { payload }) => ({ ...state, ...payload })
			)
			.addMatcher(
				({ type }) => type.startsWith("publisher") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updatePublisher } = publisherSlice.actions;

export const getPublisherBootcamp = createAsyncThunk("publisher/pub_bootcamp", async (_, { dispatch }) => {
	const { success, data, error } = await performFetch(`/api/v1/bootcamps/user/${localStorage.getItem("ID")}`, {
		method: "GET"
	});

	await handleLoadingUpdates([success ? "READY" : error ? "FAILED" : "REDIRECTING"], dispatch, updatePublisher);

	return { bootcamp: data, photoPath: data ? `/uploads/${data.photo}` : "", loading: "idle", alert: success ? "" : error || "" };
});

export const uploadImage = createAsyncThunk("publisher/upload_image", async ({ file, data }, { dispatch }) => {
	const form = document.createElement("form");
	form.setAttribute("enctype", "multipart/form-data");

	let formData = new FormData(form);
	formData.append("file", file);

	const response = await fetch(`/api/v1/bootcamps/${data._id}/photo`, {
		method: "PUT",
		body: formData,
		headers: {
			authorization: `Bearer ${localStorage.getItem("TOKEN")}`
		}
	});

	const { success, error, message, path } = await response.json();

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updatePublisher);

	return { bootcamp: data, loading: "idle", alert: success ? "" : error || message, photoPath: path || "" };
});

export const createBootcamp = createAsyncThunk("publisher/create_bootcamp", async (body, { dispatch }) => {
	const { success, error, message, data } = await performFetch("/api/v1/bootcamps/", {
		method: "POST",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "CREATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { alert: error || message, loading: "idle" };

	if (body.file) await dispatch(uploadImage({ file: body.file, data }));

	if (!body.file)
		return {
			bootcamp: data,
			alert: "",
			loading: "idle"
		};
});

export const editBootcamp = createAsyncThunk("publisher/edit_bootcamp", async (body, { dispatch, getState }) => {
	const { success, error, message, data } = await performFetch(`/api/v1/bootcamps/${getState().publisher.bootcamp.id}`, {
		method: "PUT",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { alert: error || message, loading: "idle" };

	const image = body.file instanceof File;

	if (image) await dispatch(uploadImage({ file: body.file, data }));

	if (!image)
		return {
			bootcamp: data,
			alert: "",
			loading: "idle"
		};
});

export const createCourse = createAsyncThunk("publisher/create_course", async (body, { dispatch, getState }) => {
	const { success, data, error, message } = await performFetch(`/api/v1/courses`, {
		method: "POST",
		body: JSON.stringify({ ...body, ...{ id: getState().publisher.bootcamp.id } })
	});

	await handleLoadingUpdates([success ? "CREATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { loading: "idle", alert: error || message };

	return { loading: "idle", alert: "", data };
});

export const editCourse = createAsyncThunk("publisher/edit_course", async (body, { dispatch }) => {
	const { success, data, error, message } = await performFetch(`/api/v1/courses/${body.courseID}`, {
		method: "PUT",
		body: JSON.stringify(body)
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { loading: "idle", alert: error || message };

	return { loading: "idle", alert: "", data };
});

export const deleteCourse = createAsyncThunk("publisher/delete_course", async ({ id }, { dispatch }) => {
	const { success, error, message } = await performFetch(`/api/v1/courses/${id}`, {
		method: "DELETE"
	});

	await handleLoadingUpdates([success ? "DONE" : "FAILED"], dispatch, updatePublisher);

	return { loading: "idle", alert: success ? "" : error || message, id };
});

//selectors here

export default publisherSlice.reducer;
