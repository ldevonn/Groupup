import { csrfFetch } from "./csrf";

const FETCH_GROUPS = "groups/fetchGroupsSuccess";
const SET_GROUP = "groups/setGroup";

const setGroup = (group) => {
	return {
		type: SET_GROUP,
		payload: group,
	};
};

const fetchGroupsSuccess = (groups) => {
	return {
		type: FETCH_GROUPS,
		payload: groups,
	};
};

export const fetchGroups = () => async (dispatch) => {
	const res = await csrfFetch("/api/groups");
	const data = await res.json();

	dispatch(fetchGroupsSuccess(data));
	return res;
};

export const createGroup = (group) => async (dispatch) => {
	const { name, type, about, isPrivate, city, state } = group;
	const response = await csrfFetch("/api/groups", {
		method: "POST",
		body: JSON.stringify({
			name,
			type,
			about,
			private: isPrivate,
			city,
			state,
		}),
	});
	const data = await response.json();
	dispatch(setGroup(data.group));
	return response;
};

const initialState = { groups: [] };

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_GROUPS:
			return {
				...state,
				groups: action.payload,
			};
		case SET_GROUP:
			return {
				...state,
				group: action.payload,
			};
		default:
			return state;
	}
};

export default groupsReducer;
