import cls from "classnames";
import styles from "./index.module.less";
import type { ReactNode } from "react";

type ButtonProps = {
	theme?: "default" | "shadowDark" | "shadowLight";
	color?: "primary" | "white" | "black" | "gray";
	size?: "large" | "middle" | "small";
	className?: string;
	disabled?: boolean;
	redDot?: boolean;
	children: ReactNode;
	onClick?: () => void;
};

export const Button = (props: ButtonProps) => {
	return (
		<span
			className={cls("custom-button", styles.button, props.className, {
				[styles[props.theme || "default"]]: true,
				[styles[props.color || "primary"]]: true,
				[styles[props.size || "middle"]]: true,
				[styles.disabled]: props.disabled,
				[styles.redDot]: props.redDot,
			})}
			onClick={() => !props.disabled && props.onClick?.()}
		>
			{props.children}
		</span>
	);
};
