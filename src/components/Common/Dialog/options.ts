export type Options = {
	type: "energyUsedUp" | "buy" | "upgrade" | "tax";
	title: (data: any) => string;
	desc: (data: any) => string;
	icon?: string;
};

export const options: Options[] = [
	{
		type: "buy",
		title: (data) => `Land Price ${data.price}`,
		desc: () => `Please confirm whether to purchase the land`,
	},
	{
		type: "upgrade",
		title: (data) => `lv${data.curLevel} → lv${data.nextLevel}`,
		desc: (data) => `Land Upgrade Cost ${data.price}`,
	},
	{
		type: "tax",
		title: (data) => `Tax amount ${data.price}`,
		desc: (data) => `Land tax ${data.tax}%`,
	},
	{
		type: "energyUsedUp",
		title: () => "Energy used up",
		desc: () => `Restore 1 point every hour`,
	},
];
