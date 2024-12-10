import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UAParser } from "ua-parser-js";
import { useSnapshot } from "valtio";
import { useViewport, initSwipeBehavior, initClosingBehavior, initInitData } from "@telegram-apps/sdk-react";
import { login } from "@/apis";
import { Dialog } from "@/components/Common";
import { userStore, gameStore, dialogStore } from "@/stores";
import BgmMp3 from "@/assets/music/bgm.mp3";

export default () => {
	const viewport = useViewport();
	const navigate = useNavigate();
	const initData = initInitData();
	const [closingBehavior] = initClosingBehavior();
	const [swipeBehavior] = initSwipeBehavior();
	const [loading, setLoading] = useState<boolean>(true);
	const dialogStates = useSnapshot(dialogStore.states);

	const init = async () => {
		setLoading(false);
		console.log(initData);
		console.log(navigator);
		console.log(UAParser(navigator.userAgent));
	};

	useEffect(() => {
		init();
		gameStore.actions.music("bgm", "play");

		try {
			swipeBehavior.disableVerticalSwipe();
		} catch (err) {}
	}, []);

	useEffect(() => {
		!viewport?.isExpanded && viewport?.expand();
	}, [viewport?.isExpanded]);

	useEffect(() => {
		closingBehavior.enableConfirmation();
	}, [closingBehavior]);

	return loading ? (
		<div style={{ backgroundColor: "#000", width: "100vw", height: "100vh" }} />
	) : (
		<>
			<Dialog {...dialogStates} />
			<Outlet />
		</>
	);
};
