import { Modal } from "@/components/Common";
import AvatarImg from "@/assets/avatar_1.png";
import styles from "./index.module.less";
import type { ModalProps } from "@/components/Common";

type Props = Pick<ModalProps, "visible" | "onClickMask"> & {};

type Rank = {
	rank: string | number;
	name: string;
	avatar: string;
	total: number;
};

type UserItemProps = Rank & {};

const myRankInfo: Rank = {
	rank: "999+",
	name: "xxxx",
	avatar: AvatarImg,
	total: 100,
};

const userList: Rank[] = [];

for (let i = 1; i <= 100; i++) {
	userList.push({
		rank: i,
		name: "xxxxxadsasdasdasdasdasdadasdasx-" + i,
		avatar: AvatarImg,
		total: 9999,
	});
}

const UserItem = (props: UserItemProps) => {
	return (
		<div className={styles.userItem}>
			<span className={styles.rank}>{props.rank}</span>
			<img className={styles.avatar} src={props.avatar} />
			<span className={styles.name}>{props.name}</span>
			<div className={styles.total}>
				<span className={styles.label}>Total assets</span>
				<span className={styles.value}>{props.total}</span>
			</div>
		</div>
	);
};

export const LeaderboardModal = (props: Props) => {
	return (
		<Modal closeTipsVisible title="Leaderboard" visible={props.visible} onClickMask={props.onClickMask}>
			<div className={styles.container}>
				{userList.map((item) => (
					<UserItem key={item.rank} {...item} />
				))}
				<div className={styles.fixed}>
					<UserItem {...myRankInfo} />
				</div>
			</div>
		</Modal>
	);
};
