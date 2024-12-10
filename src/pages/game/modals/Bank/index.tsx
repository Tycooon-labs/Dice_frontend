import { useState, useRef } from "react";
import { useSnapshot } from "valtio";
import { Modal, SwitchButton, InputNumberControl, Button } from "@/components/Common";
import { userStore } from "@/stores";
import styles from "./index.module.less";
import type { ModalProps, InputNumberControlRef } from "@/components/Common";

type Type = "deposit" | "withdraw";

export type BankModalProps = Pick<ModalProps, "visible" | "onClickMask"> & {
	onConfirm: (opts: { type: Type; n: number }) => void;
};

export const BankModal = (props: BankModalProps) => {
	const [type, setType] = useState<Type>("deposit");
	const [value, setValue] = useState<number>(0);
	const inputNumberControlRef = useRef<InputNumberControlRef>(null);
	const userState = useSnapshot(userStore.states);

	const onChangeType = (type: Type) => {
		setType(type);
		inputNumberControlRef.current?.reset();
	};

	return (
		<Modal
			closeTipsVisible
			coinBalanceVisible={type === "deposit"}
			depositAmountVisible={type === "withdraw"}
			title="Bank"
			visible={props.visible}
			onClickMask={props.onClickMask}
		>
			<div className={styles.container}>
				<SwitchButton
					defaultValue={type}
					list={[
						{ label: "Deposit", value: "deposit" },
						{ label: "Withdraw", value: "withdraw" },
					]}
					onChange={(v) => onChangeType(v as Type)}
				/>
				<InputNumberControl
					ref={inputNumberControlRef}
					maxVisible={type === "deposit"}
					step={100}
					maxValue={type === "deposit" ? userState.userInfo.coin : userState.userInfo.deposit}
					onChange={setValue}
				/>
				<Button theme="shadowDark" size="large" onClick={() => props.onConfirm({ type, n: value })}>
					Confirm
				</Button>
				{type === "deposit" && <div className={styles.tips}>Deposit interest rate 2%</div>}
			</div>
		</Modal>
	);
};
