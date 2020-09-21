import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bootcampReducer from "../features/bootcamps/bootcampSlice";
import publisherReducer from "../features/publisher/publisherSlice";
import miscReducer from "../features/miscSlice";

const reducer = { auth: authReducer, bootcamps: bootcampReducer, publisher: publisherReducer, misc: miscReducer };

const middleware = [...getDefaultMiddleware()];

const store = configureStore({
	reducer,
	middleware,
	devTools: process.env.NODE_ENV !== "production"
});

export default store;
