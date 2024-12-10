import { useRef, useEffect, useMemo } from "react";
import { useCountUp } from "react-countup";
import { useSnapshot } from "valtio";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Common";
import { userStore, gameStore } from "@/stores";
import IconSwapImg from "@/assets/icon/icon_swap.png";
import IconBetImg from "@/assets/icon/icon_bet.png";
import IconStoreImg from "@/assets/icon/icon_store.png";
import IconCoinImg from "@/assets/icon/icon_coin.png";
import IconRankImg from "@/assets/icon/icon_rank.png";
import IconShieldActiveImg from "@/assets/icon/icon_shield_active.png";
import IconShieldNoActiveImg from "@/assets/icon/icon_shield_noActive.png";
import IconEnergyBlackImg from "@/assets/icon/icon_energy_black.png";
import { SwapModal, TaskModal, LeaderboardModal, BetModal } from "../../modals";
import { useHooks } from "../../hooks";
import styles from "./index.module.less";

export type HeaderGroupInfoProps = {
	onStore: () => void;
};

export const HeaderGroupInfo = (props: HeaderGroupInfoProps) => {
	const { swap, task, bet, leaderboard } = useHooks();
	const userStates = useSnapshot(userStore.states);
	const gameStates = useSnapshot(gameStore.states);
	const coinInfo = useRef({ start: userStates.userInfo.coin, end: userStates.userInfo.coin });
	const countUpRef = useRef(null);
	const duration = 1;

	const { update } = useCountUp({
		ref: countUpRef,
		start: coinInfo.current.start,
		end: coinInfo.current.end,
		duration,
		decimal: ",",
	});

	const getShieldList = useMemo(() => {
		const list: string[] = new Array(3).fill(IconShieldNoActiveImg);

		for (let i = 0; i < userStates.userInfo.shield; i++) {
			list[i] = IconShieldActiveImg;
		}

		return list;
	}, [userStates]);

	useEffect(() => {
		update(userStates.userInfo.coin);
	}, [userStates.userInfo.coin]);

	useEffect(() => {
		if (gameStates.updateCoinAnime.visible) {
			gameStore.actions.music("coin", "play");
			setTimeout(() => {
				gameStore.actions.updateCoinAnime({ ...gameStates.updateCoinAnime, visible: false });
			}, 1000 * duration);
		}
	}, [gameStates.updateCoinAnime.visible]);

	return (
		<>
			<SwapModal visible={swap.visible} onClickMask={swap.onHide} onConfirm={swap.onHide} />
			<TaskModal visible={task.visible} onClickMask={task.onHide} />
			<BetModal visible={bet.visible} onClickMask={bet.onHide} onConfirm={bet.onHide} />
			<LeaderboardModal visible={leaderboard.visible} onClickMask={leaderboard.onHide} />

			<div className={styles.headerGroupInfo}>
				<div className={styles.module1}>
					<div className={styles.point}>
						<img src={IconCoinImg} />
						<span ref={countUpRef} className={styles.value} />
						<AnimatePresence>
							{gameStates.updateCoinAnime.visible && (
								<motion.span
									className={styles.floatPoint}
									initial={{ opacity: 0, transform: `translateY(0%)` }}
									animate={{ opacity: 1, transform: `translateY(-100%)` }}
									exit={{ opacity: 0 }}
									transition={{
										opacity: { duration: duration / 2, ease: "easeInOut" },
									}}
								>
									{gameStates.updateCoinAnime.operateType === "add"
										? `+${gameStates.updateCoinAnime.value}`
										: `-${gameStates.updateCoinAnime.value}`}
								</motion.span>
							)}
						</AnimatePresence>
					</div>

					<div className={styles.right}>
						<span className={styles.rank} onClick={leaderboard.onShow}>
							<img src={IconRankImg} />
						</span>

						<div className={styles.shield}>
							{getShieldList.map((src, i) => (
								<motion.img
									key={i}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3, ease: "easeInOut" }}
									src={src}
								/>
							))}
						</div>
					</div>
				</div>

				<div className={styles.module2}>
					<Button theme="shadowLight" size="large" onClick={swap.onShow}>
						<>
							<img src={IconSwapImg} />
							<span>Swap</span>
						</>
					</Button>
					<Button theme="shadowLight" size="large" onClick={bet.onShow}>
						<>
							<img src={IconBetImg} />
							<span>Bet</span>
						</>
					</Button>
					<Button theme="shadowLight" size="large" onClick={props.onStore}>
						<>
							<img src={IconStoreImg} />
							<span>Store</span>
						</>
					</Button>
				</div>

				<div className={styles.module3}>
					<Button theme="shadowLight" size="large" onClick={task.onShow}>
						Task
					</Button>
					<Button theme="shadowLight" size="large" onClick={() => {}}>
						Invite friends +2
						<img src={IconEnergyBlackImg} />
					</Button>
				</div>
			</div>
		</>
	);
};
