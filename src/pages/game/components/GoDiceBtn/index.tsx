import { useState, useRef, useEffect } from "react";
import { useSnapshot } from "valtio";
import { random } from "radash";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import { useCountUp } from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import { userStore, gameStore } from "@/stores";
import Dice1Anime from "@/assets/lottie/dice-number-1.json";
import Dice2Anime from "@/assets/lottie/dice-number-2.json";
import Dice3Anime from "@/assets/lottie/dice-number-3.json";
import Dice4Anime from "@/assets/lottie/dice-number-4.json";
import Dice5Anime from "@/assets/lottie/dice-number-5.json";
import Dice6Anime from "@/assets/lottie/dice-number-6.json";
import styles from "./index.module.less";

type DiceProps = {
	visible: boolean;
	n: number;
	animeDuration: number;
};

export type GoDIceBtnProps = {
	onMoveDistance: (n: number) => void;
	onEnergyUsedUp: () => void;
};

const TapTips = () => {
	const gameStates = useSnapshot(gameStore.states);

	return (
		<AnimatePresence>
			{gameStates.firstGoClickTipsVisible && (
				<motion.div
					className={styles.failureToGrab}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<div className={styles.tips}>
						<span className={styles.text}>Tap to start</span>
						<span className={styles.arrow}>↓</span>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const Dice = (props: DiceProps) => {
	const indexList = [Dice1Anime, Dice2Anime, Dice3Anime, Dice4Anime, Dice5Anime, Dice6Anime];

	return (
		<AnimatePresence>
			{props.visible && (
				<motion.div
					className={styles.dice}
					initial={{ opacity: 0, transform: "translateY(-60%)" }}
					animate={{ opacity: 1, transform: "translateY(0%)" }}
					exit={{ opacity: 0 }}
					transition={{
						opacity: { duration: 0.2, ease: "easeInOut" },
						transform: { duration: props.animeDuration, ease: "backOut" },
					}}
				>
					<Lottie loop={false} animationData={indexList[props.n - 1]} />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const GoDiceBtn = (props: GoDIceBtnProps) => {
	const clickLock = useRef(false);
	const countUpRef = useRef(null);
	const userStates = useSnapshot(userStore.states);
	const gameStates = useSnapshot(gameStore.states);
	const energyInfo = useRef({ start: userStates.userInfo.energy, end: userStates.userInfo.energy });
	const [dice, setDice] = useState<DiceProps>({ visible: false, animeDuration: 0, n: 0 });
	const { update } = useCountUp({
		ref: countUpRef,
		start: energyInfo.current.start,
		end: energyInfo.current.end,
		duration: 1,
	});

	const onClickGoBtn = () => {
		if (clickLock.current) return;

		if (!userStore.actions.reduceEnergy()) {
			props.onEnergyUsedUp();
			return;
		}

		const n = random(1, 6);
		const visibleTime = 1000 * (0.2 + (dice.visible ? 0.2 : 0));
		const diceAnimeTime = 1000 * 1.3;
		const pieceMoveAnimeTime = gameStore.states.eachBlockMoveTime * 1000 * n;

		clickLock.current = true;
		gameStore.actions.hideFirstGoClickTips();
		gameStore.actions.music("dice", "play");

		if (dice.visible) {
			setDice((prev) => ({ ...prev, visible: false }));
		}

		setTimeout(() => {
			setDice(() => ({ visible: true, animeDuration: (diceAnimeTime / 1000) * 0.7, n }));
			gameStore.actions.tempUpdateBetEnabledStatus(false);

			setTimeout(() => {
				props.onMoveDistance(n);

				if (gameStates.bet.enabled) {
					const coin = 300;

					toast(`Congrats, You won ${coin} DMC on your bet`);
					userStore.actions.updateCoin("add", coin);
					gameStore.actions.updateCoinAnime({ visible: true, operateType: "add", value: coin });
				}

				setTimeout(() => {
					clickLock.current = false;
				}, pieceMoveAnimeTime);
			}, diceAnimeTime);
		}, visibleTime);
	};

	useEffect(() => {
		update(userStates.userInfo.energy);
	}, [userStates.userInfo.energy]);

	return (
		<div className={styles.goDiceBtn}>
			<TapTips />
			<Dice {...dice} />

			<div className={styles.btn} onClick={onClickGoBtn}>
				<span className={styles.label}>Go!</span>
				<span className={styles.count}>
					<span ref={countUpRef} />
					<span>/10</span>
				</span>
			</div>
		</div>
	);
};
