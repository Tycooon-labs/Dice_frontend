import { TaskStatus } from "@/enums";

export type LoginBody = {
	cuid?: string;
};

export type LoginRes = {
	token: string;
};

export type UserRes = {
	usdt: number;
	coin: number;
	deposit: number;
	energy: number;
	shield: number;
};
