import { Modal, Button } from "@/components/Common";
import IconEnergyBlackImg from "@/assets/icon/icon_energy_black.png";
import styles from "./index.module.less";
import type { ModalProps } from "@/components/Common";

type Props = Pick<ModalProps, "visible" | "onClickMask"> & {
	onConfirm: () => void;
};

export const ProSubscriptionPlansModal = (props: Props) => {
	const list = [
		{
			label: "Tax rate",
			value: "15% → 12%",
		},
		{
			label: "Deposit interest",
			value: "5% → 8%",
		},
		{
			label: "Energy Limit",
			value: "10 → 15",
		},
		{
			label: "Park",
			value: "",
			type: "park",
		},
		{
			label: "Bet Fee",
			value: "10% → 5%",
		},
		{
			label: "Swap Fee",
			value: "8% → 5%",
		},
	];

	return (
		<Modal title="Tycooon Pro Subscription Plans" visible={props.visible} className={styles.proSubscriptionPlans} onClickMask={props.onClickMask}>
			<div className={styles.container}>
				<div className={styles.grid}>
					{list.map((item, i) => (
						<div key={i}>
							<span className={styles.label}>{item.label}</span>
							<span className={styles.value}>
								{item.type === "park" ? (
									<>
										<span>+2</span>
										<img src={IconEnergyBlackImg} />
										<span>→ +3</span>
										<img src={IconEnergyBlackImg} />
									</>
								) : (
									<span>{item.value}</span>
								)}
							</span>
						</div>
					))}
				</div>
				<Button theme="shadowDark" size="large" onClick={props.onConfirm}>
					Subscribe for 99 Star/mo
				</Button>
			</div>
		</Modal>
	);
};
