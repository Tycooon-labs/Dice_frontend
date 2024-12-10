import { Modal, Button } from "@/components/Common";
import IconEnergyBlackImg from "@/assets/icon/icon_energy_black.png";
import styles from "./index.module.less";
import type { ModalProps } from "@/components/Common";

type Props = Pick<ModalProps, "visible" | "onClickMask"> & {};

export const TaskModal = (props: Props) => {
	const list = [
		{
			title: "Follow on Twitter(X)",
			value: 2,
			status: 0,
		},
		{
			title: "Join  Channel ",
			value: 2,
			status: 1,
		},
		{
			title: "Join  Group",
			value: 2,
			status: 1,
		},
		{
			title: "Buy all the land",
			value: 2,
			status: 1,
		},
	];

	return (
		<Modal closeTipsVisible title="Task" visible={props.visible} onClickMask={props.onClickMask}>
			<div className={styles.container}>
				{list.map((item, i) => (
					<div key={i} className={styles.item}>
						<div className={styles.left}>
							<span className={styles.title}>{item.title}</span>
							<span className={styles.value}>+{item.value}</span>
							<img src={IconEnergyBlackImg} />
						</div>
						<Button disabled={item.status === 0} size="small">
							{item.status === 0 ? "Done" : "Go"}
						</Button>
					</div>
				))}
			</div>
		</Modal>
	);
};
