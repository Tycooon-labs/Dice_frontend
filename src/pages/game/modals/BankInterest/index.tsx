import { Modal, Button } from "@/components/Common";
import IconCoinImg from "@/assets/icon/icon_coin.png";
import styles from "./index.module.less";
import type { ModalProps } from "@/components/Common";

export type BankInterestModalProps = Pick<ModalProps, "visible" | "onClickMask"> & {
	onClaim: (type: "free" | "pro", n: number) => void;
};

export const BankInterestModal = (props: BankInterestModalProps) => {
	const amount = {
		free: 100,
		pro: 200,
	};

	return (
		<Modal depositAmountVisible title="Bank interest" visible={props.visible} onClickMask={props.onClickMask}>
			<div className={styles.container}>
				<div>
					<img src={IconCoinImg} />
					<span className={styles.value}>+{amount.free}</span>
					<Button color="black" theme="shadowDark" onClick={() => props.onClaim("free", amount.free)}>
						Claim
					</Button>
					<span className={styles.tips}>free</span>
				</div>
				<div>
					<img src={IconCoinImg} />
					<span className={styles.value}>+{amount.pro}</span>
					<Button theme="shadowDark" onClick={() => props.onClaim("pro", amount.pro)}>
						Claim
					</Button>
					<span className={styles.tips}> Pro</span>
				</div>
			</div>
		</Modal>
	);
};
