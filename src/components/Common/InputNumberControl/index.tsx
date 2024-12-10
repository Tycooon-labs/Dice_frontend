import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import cls from "classnames";
import IconControlPlusImg from "@/assets/icon/icon_control_plus.png";
import IconControlMinusImg from "@/assets/icon/icon_control_minus.png";
import styles from "./index.module.less";

export type InputNumberControlProps = {
	defaultValue?: number;
	disabled?: boolean;
	maxVisible?: boolean;
	maxValue: number;
	step?: number;
	onLongPress?: (type: "minus" | "plus") => void;
	onChange?: (v: number) => void;
};

export type InputNumberControlRef = {
	reset: () => void;
};

export const InputNumberControl = forwardRef((props: InputNumberControlProps, ref) => {
	const [value, setValue] = useState(props.defaultValue || 0);
	const timer = useRef({ timeOut: 0, interval: 0 });
	const step = props.step || 1;

	const onPlus = () => {
		if (props.disabled) return;

		setValue((v) => {
			if (props.maxValue <= v) {
				return v;
			}

			const newV = v + step >= props.maxValue ? props.maxValue : v + step;
			props.onChange?.(newV);
			return newV;
		});
	};

	const onMinus = () => {
		if (props.disabled) return;

		setValue((v) => {
			if (v <= 0) {
				return v;
			}

			const newV = v - step <= 0 ? 0 : v - step;
			props.onChange?.(newV);
			return newV;
		});
	};

	const onMax = () => {
		if (value === props.maxValue || props.disabled) return;

		setValue(props.maxValue);
		props.onChange?.(props.maxValue);
	};

	const onTouchStart = (type: Parameters<Required<InputNumberControlProps>["onLongPress"]>[0]) => {
		timer.current.timeOut = window.setTimeout(() => {
			timer.current.interval = window.setInterval(() => {
				if (type === "minus") {
					onMinus();
				} else {
					onPlus();
				}

				props.onLongPress?.(type);
			}, 1000 * 0.05);
		}, 1000 * 0.5);
	};

	const onTouchEnd = () => {
		window.clearTimeout(timer.current.timeOut);
		window.clearInterval(timer.current.interval);
	};

	const onTouchMove = () => {
		window.clearTimeout(timer.current.timeOut);
		window.clearInterval(timer.current.interval);
	};

	useImperativeHandle<any, InputNumberControlRef>(ref, () => ({
		reset: () => {
			setValue(props.defaultValue || 0);
			props.onChange?.(props.defaultValue || 0);
		},
	}));

	return (
		<div className={cls("custom-inputNumberControl", styles.inputNumberControl)}>
			<div className={styles.control}>
				<span
					className={cls(styles.icon, { [styles.disabled]: value <= 0 })}
					onClick={onMinus}
					onTouchStart={() => onTouchStart("minus")}
					onTouchEnd={onTouchEnd}
					// onTouchMove={onTouchMove}
					onMouseDown={() => onTouchStart("minus")}
					onMouseUp={onTouchEnd}
					// onMouseMove={onTouchMove}
				>
					<img src={IconControlMinusImg} />
				</span>
				<span className={styles.value}>{value}</span>
				<span
					className={cls(styles.icon, { [styles.disabled]: props.maxValue <= value })}
					onClick={onPlus}
					onTouchStart={() => onTouchStart("plus")}
					onTouchEnd={onTouchEnd}
					// onTouchMove={onTouchMove}
					onMouseDown={() => onTouchStart("plus")}
					onMouseUp={onTouchEnd}
					// onMouseMove={onTouchMove}
				>
					<img src={IconControlPlusImg} />
				</span>
			</div>
			{props.maxVisible && (
				<span className={styles.max} onClick={onMax}>
					MAX
				</span>
			)}
		</div>
	);
});
