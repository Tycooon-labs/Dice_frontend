import { initUtils } from "@telegram-apps/sdk-react";

export function onShare(cuid: string, shareText: string) {
	const utils = initUtils();

	utils.shareURL(`${shareText} ${import.meta.env.VITE_TG_APP_URL}?startapp=${cuid}`);
}
