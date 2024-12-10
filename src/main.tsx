import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TgSdkProvider } from "@/providers";
import { Toast } from "@/components/Common";
import { Router } from "./router";
import { sentryInit } from "./utils/sentry";
import "amfe-flexible";
// import "./utils/flexible-v2";
import "normalize.css";
import "./styles/global.less";
import "./styles/vant.less";

if (import.meta.env.MODE !== "development") {
	sentryInit();
}

if (import.meta.env.MODE === "preview") {
	import("eruda").then((eruda) => eruda.default.init());
}

if (window.location.pathname !== "/") {
	window.location.href = "/";
} else {
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<TgSdkProvider>
			<BrowserRouter>
				<Router />
				<Toast />
			</BrowserRouter>
		</TgSdkProvider>
	);
}
