import { proxy } from "valtio";
import BgmMp3 from "@/assets/music/bgm.mp3";
import DiceMp3 from "@/assets/music/dice.wav";
import CoinMp3 from "@/assets/music/coin.wav";
import type { ChessboardItem } from "@/pages/game/types";
import type { OperateType } from "@/types";

type GameState = {
	eventLocked: boolean;

	firstGoClickTipsVisible: boolean;

	chessboardStyle: {
		blockWidth: number;
		insideWidth: number;
		insideHeight: number;
	};

	chessboardBlockDataList: ChessboardItem[][];

	eachBlockMoveTime: number;

	updateCoinAnime: {
		visible: boolean;
		value: number;
		operateType: OperateType;
	};

	bomb: {
		shake: boolean;
	};

	bet: {
		enabled: boolean;
		enabledData: {
			tabs: number;
			switchButton: number;
			inputNumberControl: number;
		};
	};
};

type GameNoProxyState = {
	music: {
		bgm: HTMLMediaElement;
		dice: HTMLMediaElement;
		coin: HTMLMediaElement;
	};
};

const getStates = () => {
	const defaultData: GameState = {
		eventLocked: false,
		firstGoClickTipsVisible: true,
		chessboardStyle: {
			blockWidth: 0,
			insideWidth: 0,
			insideHeight: 0,
		},
		chessboardBlockDataList: [],
		eachBlockMoveTime: 0.4,
		updateCoinAnime: {
			visible: false,
			value: 0,
			operateType: "add",
		},

		bomb: {
			shake: false,
		},
		bet: {
			enabled: false,
			enabledData: {
				tabs: 0,
				switchButton: 0,
				inputNumberControl: 0,
			},
		},
	};

	return proxy<GameState>(defaultData);
};

const getNoProxyStates = () => {
	const noProxyDefaultData: GameNoProxyState = {
		music: {
			bgm: new Audio(),
			dice: new Audio(),
			coin: new Audio(),
		},
	};

	return noProxyDefaultData;
};

const states = getStates();
const noProxyStates = getNoProxyStates();

export const gameStore = {
	states,
	noProxyStates,
	actions: {
		initChessboard(list: ChessboardItem[][], blockW: number) {
			states.chessboardStyle.blockWidth = blockW;
			states.chessboardBlockDataList = list;
		},

		hideFirstGoClickTips() {
			states.firstGoClickTipsVisible = false;
		},

		setChessboardInsideStyle() {
			setTimeout(() => {
				const el = document.querySelector(".chessboard")!;
				const { width, height } = el.getBoundingClientRect();

				states.chessboardStyle.insideWidth = width - states.chessboardStyle.blockWidth * 2;
				states.chessboardStyle.insideHeight = height - states.chessboardStyle.blockWidth * 2;
			}, 1000 * 0.1);
		},

		buyHouse(item: ChessboardItem) {
			const blockItem = states.chessboardBlockDataList[item.y - 1][item.x - 1];

			blockItem.chessboardType = "house";
			blockItem.data = { houseLevel: 1 };
		},

		upgradeHouse(item: ChessboardItem) {
			const blockItem = states.chessboardBlockDataList[item.y - 1][item.x - 1];

			blockItem.data!.houseLevel!++;
		},

		bombHouse(item: ChessboardItem) {
			const blockItem = states.chessboardBlockDataList[item.y - 1][item.x - 1];

			blockItem.data!.houseLevel = 1;
		},

		updateCoinAnime(opts: GameState["updateCoinAnime"]) {
			states.updateCoinAnime = opts;
		},

		updateBombShake(visible: boolean) {
			states.bomb.shake = visible;
		},

		tempUpdateBetEnabledStatus(visible: boolean, data?: GameState["bet"]["enabledData"]) {
			states.bet.enabled = visible;

			if (visible) {
				states.bet.enabledData = data!;
			}
		},

		music(type: keyof GameNoProxyState["music"], action: "play" | "mute" | "unMute") {
			switch (type) {
				case "bgm":
					(() => {
						const actionObj = {
							play: () => {
								const playMusic = () => {
									if (
										!noProxyStates.music.bgm.paused &&
										noProxyStates.music.bgm.currentTime > 0 &&
										!noProxyStates.music.bgm.ended
									) {
										return;
									}

									noProxyStates.music.bgm.src = BgmMp3;
									noProxyStates.music.bgm.loop = true;
									noProxyStates.music.bgm.play();
								};

								if (!(noProxyStates.music.bgm as any).init) {
									(noProxyStates.music.bgm as any).init = true;
									window.addEventListener("click", playMusic, { once: true });
									window.addEventListener("touchstart", playMusic, { once: true });
									window.addEventListener("scroll", playMusic, { once: true });
									window.addEventListener("focus", playMusic, { once: true });
									window.addEventListener("mousemove", playMusic, { once: true });
									window.addEventListener("pointerdown", playMusic, { once: true });
								}

								playMusic();
							},
							mute: () => (noProxyStates.music.bgm.muted = true),
							unMute: () => (noProxyStates.music.bgm.muted = false),
						};

						actionObj[action]();
					})();
					break;

				case "dice":
					(() => {
						const actionObj = {
							play: () => {
								noProxyStates.music.dice.src = DiceMp3;
								noProxyStates.music.dice.play();
							},
							mute: () => (noProxyStates.music.dice.muted = true),
							unMute: () => (noProxyStates.music.dice.muted = false),
						};

						actionObj[action]();
					})();
					break;

				case "coin":
					(() => {
						const actionObj = {
							play: () => {
								noProxyStates.music.coin.src = CoinMp3;
								noProxyStates.music.coin.play();
							},
							mute: () => (noProxyStates.music.coin.muted = true),
							unMute: () => (noProxyStates.music.coin.muted = false),
						};

						actionObj[action]();
					})();
					break;
			}
		},

		batchControlMusic(action: "mute" | "unMute") {
			gameStore.actions.music("dice", action);
			gameStore.actions.music("coin", action);
		},
	},
};
