import confetti from "canvas-confetti";
import Avatar1Img from "@/assets/avatar_1.png";
import IconBankImg from "@/assets/icon/icon_bank.png";
import IconShieldWhiteImg from "@/assets/icon/icon_shield_white.png";
import IconTaxImg from "@/assets/icon/icon_tax.png";
import IconParkImg from "@/assets/icon/icon_park.png";
import IconGrabImg from "@/assets/icon/icon_grab.png";
import IcoBombImg from "@/assets/icon/icon_bomb.png";
import { gameStore } from "@/stores";
import type { ChessboardItem, UserItem } from "./types";

const defaultBlockBorderWidth = 1;
const defaultBlockMarginWidth = 2;

export function createChessboard(blockW: number): ChessboardItem[][] {
	const X = 8;
	const Y = 15;
	const tempList: ChessboardItem[][] = [];

	for (let y = 0; y < Y; y++) {
		tempList.push([]);

		for (let x = 0; x < X; x++) {
			const res: ChessboardItem = {
				x: x + 1,
				y: y + 1,
				left: 0,
				top: 0,
				id: -1,
				isChessboardBlock: false,
				chessboardType: "none",
			};

			if ([0].includes(y)) {
				res.id = x + 1;
			} else if (y > 0 && y < 14 && x === 7) {
				res.id = 7 + y + 1;
			} else if ([14].includes(y)) {
				res.id = 21 + 7 - x + 1;
			} else if (y > 0 && y < 14 && x === 0) {
				res.id = 42 - y + 1;
			}

			if (res.id !== -1) {
				res.left = x * (blockW + defaultBlockBorderWidth * 2) + x * defaultBlockMarginWidth;
				res.top = y * (blockW + defaultBlockBorderWidth * 2) + y * defaultBlockMarginWidth;

				res.isChessboardBlock = true;
				res.chessboardType = "emptyHouse";

				switch (res.id) {
					case 1:
						res.data = { activityAvatar: IconShieldWhiteImg };
						res.chessboardType = "shield";
						break;

					case 8:
						res.data = { activityAvatar: IconParkImg };
						res.chessboardType = "park";
						break;

					case 15:
						res.data = { activityAvatar: IconTaxImg };
						res.chessboardType = "tax";
						break;

					case 22:
						res.data = { activityAvatar: IconBankImg };
						res.chessboardType = "bank";
						break;

					case 29:
						res.data = { activityAvatar: IcoBombImg };
						res.chessboardType = "bomb";
						break;

					case 36:
						res.data = { activityAvatar: IconGrabImg };
						res.chessboardType = "grab";
						break;
				}
			}

			tempList[y][x] = res;
		}
	}

	return tempList;
}

export function idToXY(id: number): ChessboardItem {
	const list = gameStore.states.chessboardBlockDataList;

	for (let i = 0; i < list.length; i++) {
		for (let j = 0; j < list[i].length; j++) {
			const item = list[i][j];

			if (item.id === id) {
				return item;
			}
		}
	}

	throw new Error("idToXY undefined");
}

export function getMockUserInfo() {
	const getUserInfo = (userId: number, avatar: string, item: ChessboardItem): UserItem => ({
		userId,
		id: item.id,
		left: item.left,
		top: item.top,
		x: item.x,
		y: item.y,
		avatar,
	});

	return getUserInfo(1, Avatar1Img, idToXY(1));
}

export function createConfetti() {
	const colors = ["#FF0000", "#9100FF", "#FF9700", "#008FFF", "#FF00AD", "#72FF00"];

	const duration = 2.4 * 1000;
	const animationEnd = Date.now() + duration;
	const defaults = { colors, startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

	const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

	const interval = window.setInterval(() => {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 80 * (timeLeft / duration);
		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
		});
		confetti({
			...defaults,
			particleCount,

			origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
		});
	}, 300);
}

export function getHouseLevelPrice(curLevel: number) {
	let currentValue = 10;
	let difference = 10;

	for (let i = 1; i <= curLevel - 1; i++) {
		currentValue += difference;
		difference += 10;
	}

	return currentValue;
}

export function getActivityTooltipText(item: ChessboardItem) {
	const obj: Record<string, string> = {
		bank: "You can deposit and withdraw DMC in the bank, with a daily interest rate of 5%, and a daily interest rate of 8% for Pro players. ",
		shield: "When you move to this land, you can get a shield for free, which can resist one robbery by other players.",
		tax: "If you move to the land, you need to pay land tax, the tax amount is equal to 15% of the value of all the player's land",
		grab: "Every time you arrive here, you can rob other players. If the other player has no shield, you will get 10% of the other player's DMC.",
		bomb: "Every time you get here, a bomb will be dropped on a random piece of your land, causing that land to be downgraded by 1 level",
		park: "Each time you arrive at the park, you can get 2 energy points for free",
	};

	return obj[item.chessboardType];
}
