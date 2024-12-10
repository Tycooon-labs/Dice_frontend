import { useEffect, useState, useRef } from "react";
import { useSnapshot } from "valtio";
import { Modal, SwitchButton, InputNumberControl, Button, Tabs, Tooltip } from "@/components/Common";
import { userStore, gameStore } from "@/stores";
import IconHelpImg from "@/assets/icon/icon_help.png";
import styles from "./index.module.less";
import type { ModalProps, TabsRef, SwitchButtonRef, InputNumberControlRef } from "@/components/Common";

type Props = Pick<ModalProps, "visible" | "onClickMask"> & {
	onConfirm: () => void;
};

export const BetModal = (props: Props) => {
	const tabDefault = 0;
	const switchButtonDefault = 0;
	const valueDefault = 100;
	const [tabActive, setTabActive] = useState(tabDefault);
	const [switchButtonActive, setSwitchButtonActive] = useState(switchButtonDefault);
	const [value, setValue] = useState(valueDefault);
	const userStates = useSnapshot(userStore.states);
	const gameStates = useSnapshot(gameStore.states);
	const tabsRef = useRef<TabsRef>();
	const switchButtonRef = useRef<SwitchButtonRef>();
	const valueRef = useRef<InputNumberControlRef>();

	const betTypeList = [
		{ label: "Big/Small", value: 0 },
		{ label: "Odd/Even", value: 1 },
	];

	const betTypeGameList = [
		[
			{ label: "Small(1.2.3)", value: 0 },
			{ label: "Big(4.5.6)", value: 1 },
		],
		[
			{ label: "Odd(1.3.5)", value: 0 },
			{ label: "Even(2.4.6)", value: 1 },
		],
	];

	const onConfirm = () => {
		gameStore.actions.tempUpdateBetEnabledStatus(true, {
			tabs: tabActive,
			switchButton: switchButtonActive,
			inputNumberControl: value,
		});
		props.onConfirm();
	};

	useEffect(() => {
		if (props.visible && !gameStates.bet.enabled) {
			tabsRef.current?.reset();
			switchButtonRef.current?.reset();
			valueRef.current?.reset();
		}
	}, [props.visible]);

	return (
		<Modal coinBalanceVisible closeTipsVisible title="Bet" visible={props.visible} onClickMask={props.onClickMask}>
			<div className={styles.container}>
				<Tabs
					ref={tabsRef}
					defaultValue={gameStates.bet.enabled ? gameStates.bet.enabledData.tabs : tabDefault}
					disabled={gameStates.bet.enabled}
					list={betTypeList}
					onChange={(v) => setTabActive(v as number)}
				/>
				<SwitchButton
					ref={switchButtonRef}
					defaultValue={gameStates.bet.enabled ? gameStates.bet.enabledData.switchButton : switchButtonDefault}
					disabled={gameStates.bet.enabled}
					list={betTypeGameList[tabActive]}
					onChange={(v) => setSwitchButtonActive(v as number)}
				/>
				<InputNumberControl
					ref={valueRef}
					defaultValue={gameStates.bet.enabled ? gameStates.bet.enabledData.inputNumberControl : valueDefault}
					step={100}
					disabled={gameStates.bet.enabled}
					maxValue={userStates.userInfo.coin}
					onChange={(v) => setValue(v)}
				/>
				<Button theme="shadowDark" size="large" disabled={gameStates.bet.enabled} onClick={onConfirm}>
					Confirm
				</Button>
				<div className={styles.tips}>
					<span>Bet on the outcome of the next dice roll</span>
					<Tooltip content="123y81273891" position="left">
						<img src={IconHelpImg} />
					</Tooltip>
				</div>
			</div>
		</Modal>
	);
};
