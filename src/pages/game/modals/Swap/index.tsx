import { useState, useRef } from "react";
import { useSnapshot } from "valtio";
import { Modal, Button, InputNumber } from "@/components/Common";
import { gameStore, userStore } from "@/stores";
import IconArrowDown from "@/assets/icon/icon_arrow_down.png";
import styles from "./index.module.less";
import type { ModalProps, InputNumberRef } from "@/components/Common";
import toast from "react-hot-toast";

type Props = Pick<ModalProps, "visible" | "onClickMask"> & {
	onConfirm: () => void;
};

export const SwapModal = (props: Props) => {
	const coinInputRef = useRef<InputNumberRef>();
	const usdtInputRef = useRef<InputNumberRef>();
	const [inputStyle, setInputStyle] = useState({ coin: 0, usdt: 0 });
	const userStates = useSnapshot(userStore.states);

	const transformAmount = (v: number): number => {
		return Number(Number(v * 0.8).toFixed(2));
	};

	const onChangeCoinInput = (coin: number | string) => {
		usdtInputRef.current?.setValue(coin === "" ? coin : transformAmount(coin as number));
	};

	const onChangeUsdtInput = (usdt: number | string) => {
		coinInputRef.current?.setValue(usdt === "" ? usdt : transformAmount(usdt as number));
	};

	const onClickExchangeMethod = () => {
		if (inputStyle.coin === 0) {
			const { top: coinInputTop } = coinInputRef.current!.getDOM().getBoundingClientRect();
			const { top: usdtInputTop } = usdtInputRef.current!.getDOM().getBoundingClientRect();
			const n = usdtInputTop - coinInputTop;

			setInputStyle(() => ({ coin: n, usdt: -n }));
		} else {
			setInputStyle(() => ({ coin: 0, usdt: 0 }));
		}

		coinInputRef.current?.setValue("");
		usdtInputRef.current?.setValue("");
	};

	const onConfirm = () => {
		const coinVal = Number(coinInputRef.current?.getValue());
		const usdtVal = Number(usdtInputRef.current?.getValue());

		if (inputStyle.coin === 0) {
			if (coinVal < 1000) {
				toast.error("Minimum Swap 1000 DMC");
				return;
			}

			if (userStates.userInfo.coin < coinVal) {
				toast.error("Not enough balance");
				return;
			}

			userStore.actions.updateCoin("reduce", coinVal);
			userStore.actions.updateUSDT("add", usdtVal);
		} else {
			if (usdtVal < 1) {
				toast.error("Minimum Swap 1 USDT");
				return;
			}

			if (userStates.userInfo.usdt < usdtVal) {
				toast.error("Not enough balance");
				return;
			}

			userStore.actions.updateCoin("add", coinVal);
			userStore.actions.updateUSDT("reduce", usdtVal);
		}

		gameStore.actions.updateCoinAnime({
			visible: true,
			operateType: inputStyle.coin === 0 ? "reduce" : "add",
			value: coinVal,
		});
	};

	return (
		<Modal
			coinBalanceVisible={inputStyle.coin === 0}
			usdtBalanceVisible={inputStyle.coin !== 0}
			closeTipsVisible
			title="Swap"
			visible={props.visible}
			onClickMask={props.onClickMask}
		>
			<div className={styles.container}>
				<div className={styles.control}>
					<InputNumber
						placeholder="0"
						leftIcon="coin"
						rightIcon={inputStyle.coin === 0 ? "max" : "help"}
						ref={coinInputRef}
						maxValue={100000}
						disabled={inputStyle.coin !== 0}
						style={{ transform: `translateY(${inputStyle.coin}px)` }}
						onChange={onChangeCoinInput}
					/>
					<span className={styles.iconArrowDown} onClick={onClickExchangeMethod}>
						<img src={IconArrowDown} />
					</span>
					<InputNumber
						disabled={inputStyle.coin === 0}
						placeholder="0"
						leftIcon="usdt"
						rightIcon="help"
						maxValue={10000}
						ref={usdtInputRef}
						style={{ transform: `translateY(${inputStyle.usdt}px)` }}
						onChange={onChangeUsdtInput}
					/>
				</div>
				<Button theme="shadowDark" size="large" onClick={onConfirm}>
					{/* Connect Wallet */}
					Swap
				</Button>
				<div className={styles.tips}>{inputStyle.coin === 0 ? "Minimum Swap 1000 DMC" : "Minimum Swap 1 USDT"}</div>
			</div>
		</Modal>
	);
};
