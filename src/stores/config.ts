import { proxy } from "valtio";

type StoreState = {};

const getStates = () => {
	const defaultData: StoreState = {};

	return proxy<StoreState>(defaultData);
};

const states = getStates();

export const configStore = {
	states,
	actions: {},
};
