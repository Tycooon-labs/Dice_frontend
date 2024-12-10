import { useState, forwardRef, useImperativeHandle } from "react";
import cls from "classnames";
import styles from "./index.module.less";

type Value = string | number;

export type TabsProps = {
	defaultValue?: Value;
	disabled?: boolean;
	list: {
		label: string;
		value: Value;
	}[];
	onChange: (value: Value) => void;
};

export type TabsRef = {
	reset: () => void;
	setValue: (v: Value) => void;
};

export const Tabs = forwardRef((props: TabsProps, ref) => {
	const [active, setActive] = useState(props.defaultValue);

	const onChange = (value: Value) => {
		if (active === value || props.disabled) return;

		setActive(value);
		props.onChange(value);
	};

	useImperativeHandle<any, TabsRef>(ref, () => ({
		reset: () => {
			setActive(props.defaultValue || 0);
		},
		setValue: (v) => {
			setActive(v);
		},
	}));

	return (
		<div className={cls("custom-tabs", styles.tabs)}>
			{props.list.map((item) => (
				<span key={item.value} className={cls({ [styles.active]: active === item.value })} onClick={() => onChange(item.value)}>
					{item.label}
				</span>
			))}
		</div>
	);
});
