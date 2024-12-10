import { SDKProvider } from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const TgSdkProvider = (props: Props) => {
	const manifestUrl = new URL("tonconnect-manifest.json", window.location.href).toString();
	const botLink = import.meta.env.VITE_BOT_URL;

	return (
		<SDKProvider acceptCustomStyles>
			<TonConnectUIProvider manifestUrl={manifestUrl} actionsConfiguration={{ twaReturnUrl: botLink }}>
				{props.children}
			</TonConnectUIProvider>
		</SDKProvider>
	);
};
