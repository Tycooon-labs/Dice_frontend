import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import cls from "classnames";
import { Tooltip } from "../";
import IconCoinImg from "@/assets/icon/icon_coin.png";
import IconUsdtImg from "@/assets/icon/icon_usdt.png";
import IconHelpImg from "@/assets/icon/icon_help.png";
import styles from "./index.module.less";

export type InputNumberProps = {
	placeholder: string;
	leftIcon: "coin" | "usdt";
	rightIcon: "max" | "help";
	maxValue?: number;
	helpText?: string;
	disabled?: boolean;
	style?: React.CSSProperties;
	onChange: (v: number | string) => void;
};

export type InputNumberRef = {
	getValue: () => number | string;
	setValue: (v: number | string) => void;
	getDOM: () => HTMLDivElement;
};

export const InputNumber = forwardRef((props: InputNumberProps, ref) => {
	const [value, setValue] = useState<number | string>("");
	const divRef = useRef<HTMLDivElement>(null);

	const onChangeCoinInput = (e: any) => {
		let v = e.target.value.replace(/[^0-9]/g, "");

		if (v !== "") {
			v = props.maxValue === undefined ? Number(v) : Math.min(Number(v), props.maxValue);
		}

		setValue(v);
		props.onChange(v);
	};

	const onMax = () => {
		if (value === props.maxValue) return;

		setValue(props.maxValue!);
		props.onChange(props.maxValue!);
	};

	useImperativeHandle<any, InputNumberRef>(ref, () => ({
		getValue: () => value,
		setValue: (v) => {
			setValue(v);
		},
		getDOM: () => divRef.current!,
	}));

	return (
		<div className={cls("custom-inputNumber", styles.inputNumber)} ref={divRef} style={props.style}>
			<img className={styles.leftIcon} src={props.leftIcon === "coin" ? IconCoinImg : IconUsdtImg} />
			<input type="text" value={value} placeholder={props.placeholder} disabled={props.disabled} onChange={onChangeCoinInput} />
			{props.rightIcon === "max" && (
				<span className={styles.max} onClick={onMax}>
					MAX
				</span>
			)}
			{props.rightIcon === "help" && (
				<Tooltip content="123y81273891" position="left">
					<img className={styles.helpIcon} src={IconHelpImg} />
				</Tooltip>
			)}
		</div>
	);
});
