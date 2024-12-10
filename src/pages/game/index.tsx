import { useEffect, useState } from "react";
import cls from "classnames";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { UAParser } from "ua-parser-js";
import { useEventLock } from "@/hooks";
import { userStore, gameStore, dialogStore } from "@/stores";
import { ChessboardBlock, Piece, HeaderGroupInfo, GoDiceBtn, Bomb, FooterGroupInfo } from "./components";
import { BankModal, GrabModal, BankInterestModal, ProSubscriptionPlansModal, StoreModal } from "./modals";
import { useHooks } from "./hooks";
import { createChessboard, idToXY, getMockUserInfo, createConfetti, getHouseLevelPrice } from "./utils";
import styles from "./index.module.less";
import type { ChessboardProps } from "./components";
import type { BankInterestModalProps } from "./modals";
import type { UserItem, ChessboardItem } from "./types";

export default () => {
	const [userInfo, setUserInfo] = useState<UserItem>();
	const gameStates = useSnapshot(gameStore.states);
	const userStates = useSnapshot(userStore.states);
	const { isLockedRef, updateLock } = useEventLock();
	const hapticFeedback = useHapticFeedback();
	const { proSubscriptionPlans, bomb, store, bank, grab, bankInterest } = useHooks();

	const init = () => {
		const scale = 0.88;
		const wBlockW = parseInt(String((window.innerWidth / 8) * scale));
		const hBlockW = parseInt(String((window.innerHeight / 15) * scale));
		const blockW = wBlockW > hBlockW ? hBlockW : wBlockW;

		const chessboardList = createChessboard(blockW);

		for (let i = 1; i <= 6; i++) {
			chessboardList[0][i] = { ...chessboardList[0][i], chessboardType: "house", data: { houseLevel: i } };
		}

		gameStore.actions.initChessboard(chessboardList, blockW);

		setUserInfo(getMockUserInfo());

		gameStore.actions.setChessboardInsideStyle();
	};

	const onMoveDistance = (moveN: number) => {
		const lastBlockId = 42;
		const tempUser: UserItem = JSON.parse(JSON.stringify(userInfo));
		const id = tempUser.id + moveN <= lastBlockId ? tempUser.id + moveN : tempUser.id + moveN - lastBlockId;
		const item = idToXY(id);

		tempUser.left = item.left;
		tempUser.top = item.top;
		tempUser.id = id;

		setUserInfo(tempUser);
		dialogStore.actions.hide();

		for (let i = 1; i <= moveN; i++) {
			setTimeout(() => {
				if (hapticFeedback.supports("impactOccurred")) {
					for (let j = 0; j < 3; j++) {
						setTimeout(() => {
							hapticFeedback.impactOccurred("rigid");
						}, j * 20);
					}
				}
			}, i * gameStates.eachBlockMoveTime * 1000);
		}

		setTimeout(() => {
			switch (item.chessboardType) {
				case "emptyHouse":
					(() => {
						const houseList: ChessboardItem[] = [];

						gameStates.chessboardBlockDataList.forEach((yList) => {
							yList.map((item) => {
								if (item.chessboardType === "house") {
									houseList.push(item);
								}
							});
						});

						const price = 10 * (houseList.length + 1);

						if (isLockedRef.current) return;

						dialogStore.actions.show({
							type: "buy",
							data: { price },
							onCancel: () => {
								dialogStore.actions.hide();
							},
							onOk: () => {
								if (userStates.userInfo.coin < price) {
									toast.error("Not enough balance");
									return;
								}

								if (isLockedRef.current) return;

								updateLock();
								setTimeout(() => {
									dialogStore.actions.hide();
									userStore.actions.updateCoin("reduce", price);
									gameStore.actions.updateCoinAnime({
										visible: true,
										operateType: "reduce",
										value: price,
									});
									gameStore.actions.buyHouse(item);
									setTimeout(() => updateLock(), 1000 * 0.5);
								}, 1000 * 0.3);
							},
						});
					})();
					break;

				case "house":
					(() => {
						const n = item.data?.houseLevel! * 10;
						const curLevel = item.data?.houseLevel!;
						const nextLevel = curLevel + 1;
						const price = getHouseLevelPrice(curLevel);

						gameStore.actions.updateCoinAnime({
							visible: true,
							operateType: "add",
							value: n,
						});
						userStore.actions.updateCoin("add", n);

						dialogStore.actions.show({
							type: "upgrade",
							data: {
								price,
								curLevel,
								nextLevel,
							},
							onCancel: () => {
								dialogStore.actions.hide();
							},
							onOk: () => {
								if (isLockedRef.current) return;

								if (userStates.userInfo.coin < price) {
									toast.error("Not enough balance");
									return;
								}

								updateLock();
								setTimeout(() => {
									gameStore.actions.upgradeHouse(item);
									userStore.actions.updateCoin("reduce", price);
									gameStore.actions.updateCoinAnime({
										visible: true,
										operateType: "reduce",
										value: price,
									});
									dialogStore.actions.hide();
									createConfetti();
									setTimeout(() => updateLock(), 1000 * 0.5);
								}, 1000 * 0.3);
							},
						});
					})();
					break;

				case "bomb":
					bomb.onShake();
					break;

				case "park":
					userStore.actions.addEnergy(2);
					toast("Congrats, you get 2 energy");
					break;

				case "bank":
					bank.onShow();
					break;

				case "shield":
					userStore.actions.addShield();
					toast("Congrats, you get 1 shield");
					break;

				case "tax":
					(() => {
						const price = 100;

						dialogStore.actions.show({
							type: "tax",
							data: {
								tax: 8,
								price,
							},
							cancelBtnVisible: false,
							okBtnText: "Confirm",
							onCancel: () => {
								dialogStore.actions.hide();
							},
							onOk: () => {
								if (isLockedRef.current) return;

								updateLock();
								setTimeout(() => {
									dialogStore.actions.hide();
									userStore.actions.updateCoin("reduce", price);
									gameStore.actions.updateCoinAnime({
										visible: true,
										operateType: "reduce",
										value: price,
									});
									setTimeout(() => updateLock(), 1000 * 0.5);
								}, 1000 * 0.3);
							},
						});
					})();
					break;

				case "grab":
					grab.onShow();
					break;
			}
		}, 1000 * gameStates.eachBlockMoveTime * moveN);
	};

	const onClickChessboardBlock = (item: Parameters<ChessboardProps["onClick"]>[0]) => {};

	const onClaimBankInterest = (type: Parameters<BankInterestModalProps["onClaim"]>[0], n: number) => {
		if (type === "free") {
			bankInterest.onHide();
			gameStore.actions.updateCoinAnime({
				visible: true,
				operateType: "add",
				value: n,
			});
			userStore.actions.updateCoin("add", n);
		} else {
			proSubscriptionPlans.onShow();
		}
	};

	const onBuyEnergy = (n: number) => {
		userStore.actions.addEnergy(n);
		store.onHide();
	};

	const onEnergyUsedUp = () => {
		dialogStore.actions.show({
			type: "energyUsedUp",
			data: {},
			okBtnText: "Get more Energy",
			cancelBtnVisible: false,
			onCancel: () => {
				dialogStore.actions.hide();
			},
			onOk: () => {
				if (isLockedRef.current) return;

				updateLock();
				dialogStore.actions.hide();
				store.onShow();
				setTimeout(() => {
					setTimeout(() => updateLock(), 1000 * 0.5);
				}, 1000 * 0.3);
			},
		});
	};

	useEffect(() => {
		init();

		if (["macOS", "window"].includes(UAParser(navigator.userAgent).os.name!)) {
			window.addEventListener("resize", init);
		}

		setTimeout(() => {
			bankInterest.onShow();
		}, 1000 * 0.5);
	}, []);

	return (
		<div className={cls(styles.page, { [styles.shake]: gameStates.bomb.shake })}>
			<BankModal
				visible={bank.visible}
				onClickMask={bank.onHide}
				onConfirm={(opts) => {
					gameStore.actions.updateCoinAnime({
						visible: true,
						operateType: opts.type === "deposit" ? "reduce" : "add",
						value: opts.n,
					});
					bank.onConfirm(opts);
					bank.onHide();
				}}
			/>
			<GrabModal visible={grab.visible} onClickMask={grab.onHide} />
			<BankInterestModal visible={bankInterest.visible} onClaim={onClaimBankInterest} />
			<ProSubscriptionPlansModal
				visible={proSubscriptionPlans.visible}
				onClickMask={proSubscriptionPlans.onHide}
				onConfirm={proSubscriptionPlans.onConfirm}
			/>
			<StoreModal visible={store.visible} onClickMask={store.onHide} onBuy={onBuyEnergy} />

			<AnimatePresence>
				{gameStates.chessboardStyle.insideWidth !== 0 && (
					<motion.div
						className={styles.control}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							opacity: { duration: 0.2, ease: "easeInOut" },
						}}
						style={{
							width: `${gameStates.chessboardStyle.insideWidth}px`,
							height: `${gameStates.chessboardStyle.insideHeight}px`,
						}}
					>
						<HeaderGroupInfo onStore={store.onShow} />
						<GoDiceBtn onMoveDistance={onMoveDistance} onEnergyUsedUp={onEnergyUsedUp} />
						<FooterGroupInfo />
					</motion.div>
				)}
			</AnimatePresence>

			<div className={cls("chessboard", styles.chessboard)}>
				<Bomb visible={bomb.visible} posInfo={bomb.posInfo} />
				{userInfo && <Piece {...userInfo} onClick={proSubscriptionPlans.onShow} />}

				{gameStates.chessboardBlockDataList.map((row, y) => (
					<div key={y} className={cls(styles.row, styles.norem)}>
						{row.map((item, x) => (
							<ChessboardBlock {...item} key={`${x}_${y}`} onClick={onClickChessboardBlock} />
						))}
					</div>
				))}
			</div>

			<div className={styles.bg} />
		</div>
	);
};
