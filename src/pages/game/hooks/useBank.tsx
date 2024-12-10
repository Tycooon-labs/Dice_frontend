import { useState } from "react";
import { userStore } from "@/stores";
import type { BankModalProps } from "../modals";

export const useBank = () => {
	const [visible, setVisible] = useState(false);

	const onShow = () => {
		setVisible(true);
	};

	const onHide = () => {
		setVisible(false);
	};

	const onConfirm = (opts: Parameters<BankModalProps["onConfirm"]>[0]) => {
		if (opts.type === "deposit") {
			userStore.actions.updateCoin("reduce", opts.n);
			userStore.actions.updateDeposit("add", opts.n);
		} else {
			userStore.actions.updateCoin("add", opts.n);
			userStore.actions.updateDeposit("reduce", opts.n);
		}
	};

	return {
		visible,
		onShow,
		onHide,
		onConfirm,
	};
};
