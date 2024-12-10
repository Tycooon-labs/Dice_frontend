import { motion, AnimatePresence } from "framer-motion";
import cls from "classnames";
import { createPortal } from "react-dom";
import { useSnapshot } from "valtio";
import { gameStore } from "@/stores";
import "./index.less";
import type { ReactNode } from "react";

export type BaseModalProps = {
	className?: string;
	visible: boolean;
	children: ReactNode;
	closeTipsVisible?: boolean;
	onClickMask?: () => void;
};

export const BaseModal = (props: BaseModalProps) => {
	const gameStates = useSnapshot(gameStore.states);

	return createPortal(
		<AnimatePresence>
			{props.visible && (
				<motion.div
					className={cls("baseModal", props.className)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<div className="mask" onClick={() => props.onClickMask?.()} />
					<div className="baseModalContainerWrapper" style={{ width: `${gameStates.chessboardStyle.insideWidth}px` }}>
						<div className="baseModalContainer">{props.children}</div>
						{props.closeTipsVisible && <div className="closeTips">Click anywhere to close</div>}
					</div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
};
