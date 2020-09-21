import { useDispatch, useSelector } from "react-redux";

let timer = null;

const useAlert = (slice, caller) => {
	const alert = useSelector(state => state[slice].alert);
	const dispatch = useDispatch();

	if (alert) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => dispatch(caller({ alert: "" })), 5000);
	}

	return alert;
};

export default useAlert;
