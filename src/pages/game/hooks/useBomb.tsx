import { useState } from "react";
import { useSnapshot } from "valtio";
import { random } from "radash";
import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { gameStore } from "@/stores";
import { idToXY } from "../utils";
import { ChessboardItem } from "../types";

export const useBomb = () => {
	const [visible, setVisible] = useState(false);
	const [posInfo, setPosInfo] = useState<Pick<ChessboardItem, "top" | "left">>({ top: 0, left: 0 });
	const gameStates = useSnapshot(gameStore.states);
	const hapticFeedback = useHapticFeedback();

	const onShow = (id: number) => {
		const block = idToXY(id);

		setPosInfo(block);
		setVisible(true);

		setTimeout(() => {
			gameStore.actions.bombHouse(block);
			setVisible(false);
		}, 1000 * 2);
	};

	const onShake = () => {
		const houseList: ChessboardItem[] = [];

		gameStates.chessboardBlockDataList.forEach((yList) => {
			yList.map((item) => {
				if (item.chessboardType === "house") {
					houseList.push(item);
				}
			});
		});

		if (houseList.length !== 0) {
			const bombHouseBlock = houseList[random(0, houseList.length - 1)];
			let timer: any = null;

			onShow(bombHouseBlock.id);
			setTimeout(() => {
				gameStore.actions.updateBombShake(true);
				if (hapticFeedback.supports("impactOccurred")) {
					timer = setInterval(() => {
						hapticFeedback.impactOccurred("rigid");
					}, 50);
				}

				setTimeout(() => {
					gameStore.actions.updateBombShake(false);
					timer && clearInterval(timer);
				}, 1000 * 0.8);
			}, 1000);
		}
	};

	return {
		visible,
		posInfo,
		onShow,
		onShake,
	};
};
