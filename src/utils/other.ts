import { initUtils } from "@telegram-apps/sdk-react";

export const setGestureOperationProhibited = () => {
	document.addEventListener("gesturestart", (e) => {
		e.preventDefault();
	});
	document.addEventListener("gesturechange", (e) => {
		e.preventDefault();
	});
	document.addEventListener("gestureend", (e) => {
		e.preventDefault();
	});
	document.addEventListener(
		"dblclick",
		(e) => {
			e.preventDefault();
		},
		{ passive: false }
	);
	document.addEventListener(
		"touchmove",
		function (event) {
			event.preventDefault();
		},
		{ passive: false }
	);
};

export function getShareURL(cuid: string, shareText: string) {
	return `${shareText} ${import.meta.env.VITE_TG_APP_URL}?startapp=${cuid}`;
}

export function onShare(cuid: string, shareText: string) {
	const utils = initUtils();

	utils.shareURL(`${shareText} ${import.meta.env.VITE_TG_APP_URL}?startapp=${cuid}`);
}

export function formatAmount(amount: number) {
	return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
