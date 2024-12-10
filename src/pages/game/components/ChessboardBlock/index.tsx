import { useRef, useEffect } from "react";
import cls from "classnames";
import { useSnapshot } from "valtio";
import { useCountUp } from "react-countup";
import { Tooltip } from "@/components/Common";
import { gameStore } from "@/stores";
import IconPlusImg from "@/assets/icon/icon_plus.png";
import { getActivityTooltipText } from "../../utils";
import styles from "./index.module.less";
import type { TooltipProps } from "@/components/Common";
import type { ChessboardItem } from "../../types";

export type ChessboardProps = ChessboardItem & {
	onClick: (item: ChessboardItem) => void;
};

const NoneBlock = () => {
	const gameStates = useSnapshot(gameStore.states);

	return (
		<div
			className={cls(styles.block, styles.norem)}
			style={{
				width: `${gameStates.chessboardStyle.blockWidth}px`,
				height: `${gameStates.chessboardStyle.blockWidth}px`,
			}}
		/>
	);
};

const EmptyHouseBlock = (props: ChessboardProps) => {
	return (
		<span className={styles.content}>
			<img src={IconPlusImg} />
		</span>
	);
};

const HouseBlock = (props: ChessboardProps) => {
	const countUpRef = useRef(null);
	const houseLevelInfo = useRef({ start: props.data!.houseLevel!, end: props.data!.houseLevel! });
	const { update } = useCountUp({
		ref: countUpRef,
		start: houseLevelInfo.current.start,
		end: houseLevelInfo.current.end,
		duration: 1,
	});

	useEffect(() => {
		update(props.data!.houseLevel!);
	}, [props.data!.houseLevel]);

	return (
		<span className={styles.content} onClick={() => props.onClick(props)}>
			<span>lv</span>
			<span ref={countUpRef} />
		</span>
	);
};

const ActivityBlock = (props: ChessboardProps) => {
	const label = props.chessboardType.replace(/^\w/, (char) => char.toUpperCase());
	const tooltipPos: Partial<Record<ChessboardProps["chessboardType"], TooltipProps["position"]>> = {
		shield: "topRight",
		grab: "right",
		bomb: "bottomRight",
		park: "topLeft",
		tax: "left",
		bank: "bottomLeft",
	};

	return (
		<Tooltip position={tooltipPos[props.chessboardType]!} content={getActivityTooltipText(props)}>
			<span className={styles.content}>
				<img src={props.data?.activityAvatar} />
				<span className={styles.label}>{label}</span>
			</span>
		</Tooltip>
	);
};

export const ChessboardBlock = (props: ChessboardProps) => {
	const isActivityBlock = ["bank", "tax", "park", "grab", "shield", "bomb"].includes(props.chessboardType);

	const gameStates = useSnapshot(gameStore.states);

	if (props.chessboardType === "none") {
		return <NoneBlock />;
	}

	return (
		<div
			className={cls(styles.block, styles.norem, styles[props.chessboardType], { [styles.chessboardBlock]: props.isChessboardBlock })}
			style={{
				width: `${gameStates.chessboardStyle.blockWidth}px`,
				height: `${gameStates.chessboardStyle.blockWidth}px`,
			}}
		>
			{isActivityBlock && <ActivityBlock {...props} />}
			{props.chessboardType === "house" && <HouseBlock {...props} onClick={props.onClick} />}
			{props.chessboardType === "emptyHouse" && <EmptyHouseBlock {...props} />}
		</div>
	);
};
