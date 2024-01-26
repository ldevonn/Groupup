import { csrfFetch } from "./csrf";

const FETCH_GROUPS = "groups/fetchGroupsSuccess";
const NEW_GROUP = "groups/newGroup";
const EDIT_GROUP = "groups/editGroup";
const FETCH_GROUP = "groups/fetchGroup";
const DELETE_GROUP = "groups/deleteGroup";

const newGroup = (group) => {
	return {
		type: NEW_GROUP,
		payload: group,
	};
};

const editGroup = (group) => {
	return {
		type: EDIT_GROUP,
		payload: group,
	};
};

const deleteGroup = (group) => {
	return {
		type: DELETE_GROUP,
		payload: group,
	};
};

const fetchGroupsSuccess = (groups) => {
	return {
		type: FETCH_GROUPS,
		payload: groups,
	};
};

const loadGroup = (group) => {
	return {
		type: FETCH_GROUP,
		payload: group,
	};
};

export const fetchGroup = (groupId) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}`);
	const data = await res.json();

	dispatch(loadGroup(data));
	return res;
};

export const fetchGroups = () => async (dispatch) => {
	const res = await csrfFetch("/api/groups");
	const data = await res.json();

	dispatch(fetchGroupsSuccess(data));
	return res;
};

export const removeGroup = (group) => async (dispatch) => {
	const { id } = group;
	const response = await csrfFetch(`/api/groups/${id}`, {
		method: "DELETE",
	});
	const data = await response.json();
	dispatch(deleteGroup(data.group));
	return data;
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
	dispatch(newGroup(data.group));
	return data;
};

export const updateGroup = (group) => async (dispatch) => {
	const { id, name, type, about, isPrivate, city, state } = group;
	console.log(id);
	const response = await csrfFetch(`/api/groups/${id}`, {
		method: "PUT",
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
	dispatch(editGroup(data.group));
	return data;
};

const initialState = { groups: {}, group: null };

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_GROUPS:
			return {
				...action.payload,
			};
		case NEW_GROUP:
			return {
				...action.payload,
			};
		case FETCH_GROUP:
			return {
				group: action.payload,
			};
		case DELETE_GROUP:
			return {
				group: action.payload,
			};
		case EDIT_GROUP:
			return {
				group: action.payload,
			};
		default:
			return state;
	}
};

export default groupsReducer;
