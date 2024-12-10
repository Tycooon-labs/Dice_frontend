import { proxy } from "valtio";
import type { UserRes } from "@/types/user";
import type { OperateType } from "@/types";

type StoreState = {
	isLogin: boolean;
	userInfo: UserRes;
};

(window as any).token = "";

const getStates = () => {
	const defaultData: StoreState = {
		isLogin: false,
		userInfo: {
			usdt: 20.12,
			coin: 5123,
			energy: 10,
			deposit: 2000,
			shield: 1,
		},
	};

	return proxy<StoreState>(defaultData);
};

const states = getStates();

export const userStore = {
	states,
	actions: {
		loginSuccess(token: string) {
			states.isLogin = true;
			(window as any).token = token;
		},

		setUserInfo(payload: UserRes) {
			states.userInfo = payload;
		},

		updateUSDT(type: OperateType, n: number) {
			if (type === "add") {
				states.userInfo.usdt += n;
			} else {
				states.userInfo.usdt -= n;
			}
		},

		updateCoin(type: OperateType, n: number) {
			if (type === "add") {
				states.userInfo.coin += n;
			} else {
				states.userInfo.coin -= n;
			}
		},

		updateDeposit(type: OperateType, n: number) {
			if (type === "add") {
				states.userInfo.deposit += n;
			} else {
				states.userInfo.deposit -= n;
			}
		},

		reduceEnergy() {
			if (states.userInfo.energy > 0) {
				states.userInfo.energy--;
				return true;
			} else {
				return false;
			}
		},

		addEnergy(n: number) {
			states.userInfo.energy += n;
		},

		addShield() {
			if (states.userInfo.shield >= 3) {
				return;
			}

			states.userInfo.shield++;
		},
	},
};
