import { useSnapshot } from "valtio";
import { BaseModal } from "../BaseModal";
import { userStore } from "@/stores";
import IconCoinImg from "@/assets/icon/icon_coin.png";
import IconUsdtImg from "@/assets/icon/icon_usdt.png";
import { formatAmount } from "@/utils/other";
import "./index.less";
import type { ReactNode } from "react";
import type { BaseModalProps } from "../BaseModal";

export type ModalProps = Pick<BaseModalProps, "visible" | "closeTipsVisible" | "onClickMask" | "className"> & {
	title: string;
	coinBalanceVisible?: boolean;
	usdtBalanceVisible?: boolean;
	depositAmountVisible?: boolean;
	children: ReactNode;
};

export const Modal = (props: ModalProps) => {
	const userStates = useSnapshot(userStore.states);

	return (
		<BaseModal visible={props.visible} className={props.className} closeTipsVisible={props.closeTipsVisible} onClickMask={props.onClickMask}>
			<div className="container">
				<div className="header">
					<span className="title">{props.title}</span>
					{props.coinBalanceVisible && (
						<div className="balance">
							<span>Balance {formatAmount(userStates.userInfo.coin)}</span>
							<img src={IconCoinImg} />
						</div>
					)}
					{props.usdtBalanceVisible && (
						<div className="balance">
							<span>Balance {formatAmount(userStates.userInfo.usdt)}</span>
							<img src={IconUsdtImg} />
						</div>
					)}
					{props.depositAmountVisible && (
						<div className="balance">
							<span>Deposit Amount {formatAmount(userStates.userInfo.deposit)}</span>
							<img src={IconCoinImg} />
						</div>
					)}
				</div>
				<div>{props.children}</div>
			</div>
		</BaseModal>
	);
};
