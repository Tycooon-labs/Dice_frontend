import { useState } from "react";
import cls from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { BaseModal, Button } from "@/components/Common";
import IconShieldActiveImg from "@/assets/icon/icon_shield_active.png";
import AvatarImg from "@/assets/avatar_1.png";
import styles from "./index.module.less";
import type { BaseModalProps } from "@/components/Common";

export type Props = Pick<BaseModalProps, "visible" | "onClickMask"> & {};

export type UserListProps = {
	list: any[];
};

const userList = [
	{
		uid: 1,
		name: "xxxxxx",
		coin: 9999,
		avatar: AvatarImg,
		status: 0,
	},
	{
		uid: 2,
		name: "asdasdasdasdasdasdaasdassdasdasda",
		coin: 9999,
		avatar: AvatarImg,
		status: 1,
	},
];

for (let i = 3; i <= 100; i++) {
	userList.push({
		uid: i,
		name: "xxxxxx-" + i,
		coin: 9999,
		avatar: AvatarImg,
		status: 1,
	});
}

type FailureToGrabProps = {
	visible: boolean;
};

const FailureToGrab = (props: FailureToGrabProps) => {
	return (
		<AnimatePresence>
			{props.visible && (
				<motion.div
					className={styles.failureToGrab}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<div className={styles.mask} />
					<div className={styles.grabContainer}>
						<motion.div
							initial={{ transform: "scale(0.3)" }}
							animate={{ transform: "scale(1)" }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
						>
							<img src={IconShieldActiveImg} />
							<span>Failure to grab</span>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const UserList = (props: UserListProps) => {
	return (
		<div className={styles.userList}>
			{props.list.map((item) => (
				<div key={item.uid} className={styles.userItem}>
					<img className={styles.avatar} src={item.avatar} />
					<div className={styles.info}>
						<span className={styles.name}>{item.name}</span>
						<span className={styles.coin}> / {item.coin}</span>
					</div>
					<Button disabled={item.status === 0} size="small" onClick={() => {}}>
						Grab
					</Button>
				</div>
			))}
		</div>
	);
};

export const GrabModal = (props: Props) => {
	const [active, setActive] = useState(0);
	const [failureToGrabVisible, setFailureToGrabVisible] = useState(false);
	const tabList = [
		{
			label: "All players",
			value: 0,
		},
		{
			label: "Friends",
			value: 1,
		},
	];

	const onChange = (value: number) => {
		if (active === value) return;

		setActive(value);
	};

	return (
		<>
			<FailureToGrab visible={failureToGrabVisible} />
			<BaseModal closeTipsVisible visible={props.visible} onClickMask={props.onClickMask}>
				<div className={styles.container}>
					<div className={styles.header}>
						{tabList.map((item) => (
							<span
								key={item.value}
								className={cls(styles.title, { [styles.active]: active === item.value })}
								onClick={() => onChange(item.value)}
							>
								{item.label}
							</span>
						))}
					</div>

					<div className={styles.content}>
						<UserList list={userList} />
						{active === 1 && (
							<Button size="large" theme="shadowDark">
								Invite friends
							</Button>
						)}
					</div>
				</div>
			</BaseModal>
		</>
	);
};
