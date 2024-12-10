import { useProSubscriptionPlans } from "./useProSubscriptionPlans";
import { useBomb } from "./useBomb";
import { useSwap } from "./useSwap";
import { useTask } from "./useTask";
import { useBet } from "./useBet";
import { useStore } from "./useStore";
import { useLeaderboard } from "./useLeaderboard";
import { useBank } from "./useBank";
import { useGrab } from "./useGrab";
import { useBankInterest } from "./useBankInterest";

export const useHooks = () => {
	const proSubscriptionPlans = useProSubscriptionPlans();
	const bomb = useBomb();
	const swap = useSwap();
	const task = useTask();
	const bet = useBet();
	const store = useStore();
	const leaderboard = useLeaderboard();
	const bank = useBank();
	const grab = useGrab();
	const bankInterest = useBankInterest();

	return {
		proSubscriptionPlans,
		bomb,
		swap,
		task,
		bet,
		store,
		leaderboard,
		bank,
		grab,
		bankInterest,
	};
};
