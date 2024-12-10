import { useState, useRef, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cls from "classnames";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import styles from "./index.module.less";

export type TooltipProps = {
	content: string;
	position: "right" | "topRight" | "bottomRight" | "left" | "topLeft" | "bottomLeft";
	children: ReactNode;
};

type Pos = {
	top?: string;
	left?: string;
	bottom?: string;
};

const getDefaultPos = () => ({ top: undefined, left: undefined, bottom: undefined });

export const Tooltip = (props: TooltipProps) => {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const tooltipPos = useRef<Pos>(getDefaultPos());

	const onClickWrapper = () => {
		const rect = ref.current!.getBoundingClientRect();

		tooltipPos.current = getDefaultPos();

		switch (props.position) {
			case "right":
				tooltipPos.current.left = rect.left + rect.width + "px";
				tooltipPos.current.top = rect.top + rect.height / 2 + "px";
				break;

			case "topRight":
				tooltipPos.current.left = rect.left + rect.width + "px";
				tooltipPos.current.top = rect.top + "px";
				break;

			case "bottomRight":
				tooltipPos.current.left = rect.left + rect.width + "px";
				tooltipPos.current.bottom = window.innerHeight - rect.bottom + "px";
				break;

			case "left":
				tooltipPos.current.left = rect.left + "px";
				tooltipPos.current.top = rect.top + rect.height / 2 + "px";
				break;

			case "topLeft":
				tooltipPos.current.left = rect.left + "px";
				tooltipPos.current.top = rect.top + "px";
				break;

			case "bottomLeft":
				tooltipPos.current.left = rect.left + "px";
				tooltipPos.current.bottom = window.innerHeight - rect.bottom + "px";
				break;
		}

		setVisible(true);
	};

	return (
		<>
			{createPortal(
				<AnimatePresence>
					{visible && (
						<motion.div
							className={styles.baseTooltip}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<div className={styles.mask} onClick={() => setVisible(false)} />
							<span className={cls(styles.baseTooltipContainer, styles[props.position])} style={tooltipPos.current}>
								{props.content}
							</span>
						</motion.div>
					)}
				</AnimatePresence>,
				document.body
			)}
			{cloneElement(props.children as any, { ref, onClick: onClickWrapper })}
		</>
	);
};
