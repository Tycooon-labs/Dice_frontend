import { useEffect, useRef } from "react";
import cls from "classnames";
import { useSnapshot } from "valtio";
import { gameStore } from "@/stores";
import { getMoveDataList } from "./utils";
import styles from "./index.module.less";
import type { MutableRefObject } from "react";
import type { UserItem } from "../../types";

export type Props = UserItem & {
	onClick: () => void;
};

export type HandleDOMOpts = Pick<Props, "left" | "top"> & {
	eachBlockMoveTime: number;
	moveCount: number;
	time: number;
};

export const Piece = (props: Props) => {
	const domId = `user_${props.userId}`;
	const gameStates = useSnapshot(gameStore.states);
	const isInitDone = useRef(false);
	const prevProps = useRef<Props>();

	const handleDOM = (opts: HandleDOMOpts) => {
		const dom = document.getElementById(domId)!;

		dom.style.transition = `all ${opts.eachBlockMoveTime * opts.moveCount}s linear`;
		dom.style.transform = `translate(${opts.left}px, ${opts.top}px)`;
	};

	const animate = () => {
		const list = getMoveDataList(props, prevProps as MutableRefObject<Props>);

		prevProps.current = props;
		list.forEach((item) => {
			setTimeout(() => handleDOM(item), item.time);
		});
	};

	useEffect(() => {
		if (isInitDone.current === false) {
			prevProps.current = { ...props };
			isInitDone.current = true;
			handleDOM({ top: prevProps.current.top, left: prevProps.current.left, eachBlockMoveTime: 0, moveCount: 0, time: 0 });
		} else {
			animate();
		}
	}, [props, isInitDone]);

	return (
		<span
			id={domId}
			className={cls(styles.piece, {
				[styles.currentUser]: props.userId === 1,
			})}
			style={{
				width: `${gameStates.chessboardStyle.blockWidth}px`,
				height: `${gameStates.chessboardStyle.blockWidth}px`,
			}}
			onClick={props.onClick}
		>
			<img src={props.avatar} />
		</span>
	);
};
