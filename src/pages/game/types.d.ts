export type ChessboardItem = {
	x: number;
	y: number;
	left: number;
	top: number;
	id: number;
	isChessboardBlock: boolean;
	chessboardType: "none" | "emptyHouse" | "house" | "bank" | "shield" | "tax" | "park" | "grab" | "bomb";
	data?: {
		houseLevel?: number;
		activityAvatar?: string;
	};
};

export type UserItem = Pick<ChessboardItem, "id" | "top" | "left" | "x" | "y"> & {
	userId: number;
	avatar: string;
};
