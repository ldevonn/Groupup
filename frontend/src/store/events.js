import { csrfFetch } from "./csrf";

const FETCH_EVENTS = "events/fetchEvents";

const getEvents = (events) => {
	return {
		type: FETCH_EVENTS,
		payload: events,
	};
};

export const fetchEvents = () => async (dispatch) => {
	const res = await csrfFetch("/api/events");
	const data = await res.json();

	dispatch(getEvents(data));
	console.log(data);
	return res;
};

const initialState = { events: {} };

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_EVENTS:
			return {
				...action.payload,
			};
		default:
			return state;
	}
};

export default eventsReducer;
