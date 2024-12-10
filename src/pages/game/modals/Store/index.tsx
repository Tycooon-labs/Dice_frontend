import { Modal, Button } from "@/components/Common";
import IconEnergyBlackImg from "@/assets/icon/icon_energy_black.png";
import styles from "./index.module.less";
import type { ModalProps } from "@/components/Common";

type Props = Pick<ModalProps, "visible" | "onClickMask"> & {
	onBuy: (n: number) => void;
};

export const StoreModal = (props: Props) => {
	const list = [
		{
			energy: 10,
			price: 29,
		},
		{
			energy: 30,
			price: 79,
		},
		{
			energy: 50,
			price: 129,
		},
		{
			energy: 100,
			price: 249,
		},
	];

	return (
		<Modal closeTipsVisible title="Store" visible={props.visible} onClickMask={props.onClickMask}>
			<div className={styles.container}>
				{list.map((item) => (
					<div key={item.price} className={styles.item}>
						<div className={styles.label}>
							<span>{item.energy}</span>
							<img src={IconEnergyBlackImg} />
						</div>
						<Button theme="shadowDark" size="small" onClick={() => props.onBuy(item.energy)}>
							{item.price} Star
						</Button>
					</div>
				))}
			</div>
		</Modal>
	);
};
