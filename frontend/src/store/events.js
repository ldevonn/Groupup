import { csrfFetch } from "./csrf";

const FETCH_EVENTS = "events/fetchEvents";
const FETCH_EVENT = "groups/fetchEvent";
const DELETE_EVENT = "groups/deleteEvent";
const NEW_EVENT = "groups/newEvent";

const newEvent = (event) => {
	return {
		type: NEW_EVENT,
		payload: event,
	};
};

const getEvents = (events) => {
	return {
		type: FETCH_EVENTS,
		payload: events,
	};
};

const loadEvent = (event) => {
	return {
		type: FETCH_EVENT,
		payload: event,
	};
};

const deleteEvent = (event) => {
	return {
		type: DELETE_EVENT,
		payload: event,
	};
};

export const fetchEvents = () => async (dispatch) => {
	const res = await csrfFetch("/api/events");
	const data = await res.json();

	dispatch(getEvents(data));
	return data;
};

export const fetchEvent = (eventId) => async (dispatch) => {
	const res = await csrfFetch(`/api/events/${eventId}`);
	const data = await res.json();

	dispatch(loadEvent(data));
	return res;
};

export const removeEvent = (event) => async (dispatch) => {
	const { id } = event;
	const response = await csrfFetch(`/api/events/${id}`, {
		method: "DELETE",
	});
	const data = await response.json();
	dispatch(deleteEvent(data.event));
	return data;
};

export const createEvent = (formData, groupId) => async (dispatch) => {
	const { name, type, capacity, price, description, startDate, endDate } =
		formData;
	const response = await csrfFetch(`/api/groups/${groupId}/events`, {
		method: "POST",
		body: JSON.stringify({
			groupId: Number(groupId),
			venueId: 1,
			name,
			type,
			capacity,
			price,
			description,
			startDate,
			endDate,
		}),
	});
	const data = await response.json();
	dispatch(newEvent(data.event));
	return data;
};

const initialState = { events: {}, event: {} };

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_EVENTS:
			return {
				...action.payload,
			};
		case FETCH_EVENT:
			return {
				...action.payload,
			};
		case DELETE_EVENT:
			return {
				...action.payload,
			};
		case NEW_EVENT:
			return {
				...action.payload,
			};
		default:
			return state;
	}
};

export default eventsReducer;
