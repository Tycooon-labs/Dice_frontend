import { useRef, useState } from "react";

export const useEventLock = () => {
	const isLockedRef = useRef(false);

	const updateLock = () => {
		setTimeout(() => {
			isLockedRef.current = !isLockedRef.current;
		});
	};

	return {
		isLockedRef,
		updateLock,
	};
};
