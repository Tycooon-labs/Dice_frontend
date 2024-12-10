import { useState } from "react";

export const useProSubscriptionPlans = () => {
	const [visible, setVisible] = useState(false);

	const onShow = () => {
		setVisible(true);
	};

	const onHide = () => {
		setVisible(false);
	};

	const onConfirm = () => {
		onHide();
	};

	return {
		visible,
		onShow,
		onHide,
		onConfirm,
	};
};
