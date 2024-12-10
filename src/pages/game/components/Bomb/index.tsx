import { useSnapshot } from "valtio";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { gameStore } from "@/stores";
import BombAnime from "@/assets/lottie/bomb.json";
import styles from "./index.module.less";
import { ChessboardItem } from "../../types";

export type BombProps = {
	posInfo: Pick<ChessboardItem, "top" | "left">;
	visible: boolean;
};

export const Bomb = (props: BombProps) => {
	const gameStates = useSnapshot(gameStore.states);
	const scale = 0.3;

	return (
		<AnimatePresence>
			{props.visible && (
				<motion.span
					className={styles.bomb}
					initial={{ opacity: 0, transform: "scale(3) translateY(5%)" }}
					animate={{ opacity: 1, transform: "scale(1.7) translateY(5%)" }}
					exit={{ opacity: 0, transform: "scale(1.7) translateY(5%)" }}
					transition={{
						opacity: { duration: 0.2, ease: "easeInOut" },
						transform: { duration: 0.8, ease: "easeInOut" },
					}}
					style={{
						width: `${gameStates.chessboardStyle.blockWidth * (1 + scale)}px`,
						height: `${gameStates.chessboardStyle.blockWidth * (1 + scale)}px`,
						top: `${props.posInfo?.top - (gameStates.chessboardStyle.blockWidth * scale) / 2}px`,
						left: `${props.posInfo?.left - (gameStates.chessboardStyle.blockWidth * scale) / 2}px`,
					}}
				>
					<Lottie loop={false} animationData={BombAnime} />
				</motion.span>
			)}
		</AnimatePresence>
	);
};
