import { proxy } from "valtio";
import type { DialogProps } from "@/components/Common";

type DialogState = DialogProps & {};

const getDefaultData = (): DialogState => ({
	className: "",
	visible: false,
	type: "buy",
	data: {},
	cancelBtnVisible: undefined,
	cancelBtnText: undefined,
	okBtnText: undefined,
	onOk: undefined,
	onCancel: undefined,
});

const getStates = () => {
	return proxy<DialogState>(getDefaultData());
};

const states = getStates();

export const dialogStore = {
	states,
	actions: {
		hide() {
			states.visible = false;
		},

		show(opts: Omit<DialogProps, "visible">) {
			const newOpts = {
				...getDefaultData(),
				...opts,
			};

			for (const [key, value] of Object.entries<any>(newOpts)) {
				(states as any)[key] = value;
			}

			states.visible = true;
		},
	},
};
