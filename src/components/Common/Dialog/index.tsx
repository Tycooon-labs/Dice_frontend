import { useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { pick } from "radash";
import { Button } from "../";
import { options } from "./options";
import styles from "./index.module.less";
import type { Options } from "./options";

export type DialogProps = {
	className?: string;
	visible: boolean;
	type: Options["type"];
	data?: any;
	okBtnText?: string;
	cancelBtnText?: string;
	cancelBtnVisible?: boolean;
	onOk?: () => void;
	onCancel?: () => void;
};

export const Dialog = (props: DialogProps) => {
	const getInfo = useMemo(() => {
		const _info = options.find((item) => item.type === props.type)!;

		return {
			...pick(_info, ["type", "icon"]),
			title: _info.title(props.data),
			desc: _info.desc(props.data),
		};
	}, [props]);

	const onOk = () => {
		props.onOk?.();
	};

	const onCancel = () => {
		props.onCancel?.();
	};

	return createPortal(
		<AnimatePresence>
			{props.visible && (
				<div className={styles.baseDialog}>
					<motion.div
						className={styles.mask}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					/>
					<motion.div
						className={styles.baseDialogContainer}
						initial={{ transform: `translateY(100%)` }}
						animate={{ transform: `translateY(0%)` }}
						exit={{ transform: `translateY(100%)` }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<div className={styles.title}>{getInfo?.title}</div>
						<div className={styles.desc}>{getInfo?.desc}</div>
						<div className={styles.groupBtn}>
							{props.cancelBtnVisible !== false ? (
								<>
									<Button color="gray" theme="shadowDark" size="large" onClick={onCancel}>
										{props.cancelBtnText || "NO"}
									</Button>
									<Button theme="shadowDark" size="large" onClick={onOk}>
										{props.okBtnText || "YES"}
									</Button>
								</>
							) : (
								<>
									<Button theme="shadowDark" size="large" onClick={onOk}>
										{props.okBtnText || "YES"}
									</Button>
								</>
							)}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
};
