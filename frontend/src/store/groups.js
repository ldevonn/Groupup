import { csrfFetch } from "./csrf";

const FETCH_GROUPS = "groups/fetchGroupsSuccess";

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

const initialState = { groups: [] };

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_GROUPS:
			return {
				...state,
				groups: action.payload,
			};
		default:
			return state;
	}
};

export default groupsReducer;
