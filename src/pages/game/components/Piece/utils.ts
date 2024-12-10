import { gameStore } from "@/stores";
import type { MutableRefObject } from "react";
import type { Props, HandleDOMOpts } from "./index";

export function getMoveDataList(props: Props, prevProps: MutableRefObject<Props>): HandleDOMOpts[] {
	const { eachBlockMoveTime } = gameStore.states;

	function getRes(id: number, type: "x" | "y"): HandleDOMOpts[] {
		const defaultTime = 0;
		const { left, top } = props;

		if (prevProps.current!.id < id || (id === 1 && prevProps.current.id > 29)) {
			const moveCount = id === 1 ? 42 - prevProps.current.id + 1 : id - prevProps.current.id;

			if (type === "x") {
				return [
					{ left, top: prevProps.current.top, moveCount, eachBlockMoveTime, time: defaultTime },
					{ left, top, moveCount: props.id - id, eachBlockMoveTime, time: moveCount * 1000 * eachBlockMoveTime },
				];
			} else {
				return [
					{ left: prevProps.current.left, top, moveCount, eachBlockMoveTime, time: defaultTime },
					{ left, top, moveCount: props.id - id, eachBlockMoveTime, time: moveCount * 1000 * eachBlockMoveTime },
				];
			}
		} else {
			const moveCount = prevProps.current.id === 42 ? 1 : props.id - prevProps.current.id;

			if (type === "x") {
				return [{ left, top, moveCount, eachBlockMoveTime, time: defaultTime }];
			} else {
				return [{ left, top, moveCount, eachBlockMoveTime, time: defaultTime }];
			}
		}
	}

	if (props.id <= 8) {
		return getRes(1, "y");
	} else if (props.id <= 22) {
		return getRes(8, "x");
	} else if (props.id <= 29) {
		return getRes(22, "y");
	} else {
		return getRes(29, "x");
	}
}
