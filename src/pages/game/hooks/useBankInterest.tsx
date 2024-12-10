import { useState } from "react";

export const useBankInterest = () => {
	const [visible, setVisible] = useState(false);

	const onShow = () => {
		setVisible(true);
	};

	const onHide = () => {
		setVisible(false);
	};

	const onConfirm = () => {};

	return {
		visible,
		onShow,
		onHide,
		onConfirm,
	};
};
