import axios from "axios";
import toast from "react-hot-toast";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const http = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
	timeout: 1000 * 10,
});

http.interceptors.request.use((config) => {
	const { initDataRaw: tma } = retrieveLaunchParams();
	const jwtToken = (window as any).token;

	config.headers.Authorization = JSON.stringify({
		tma,
		jwtToken: jwtToken === "" ? undefined : jwtToken,
	});

	return config;
});

http.interceptors.response.use(
	(res) => {
		return res.data.data;
	},
	(err) => {
		const errMsg = err.response.data.msg || "error";

		toast.error(errMsg);

		return Promise.reject(err.response);
	}
);
