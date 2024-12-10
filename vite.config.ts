import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import postCssPxToRem from "postcss-pxtorem";
import mkcert from "vite-plugin-mkcert";
import path from "path";

export default defineConfig(({ mode }) => ({
	build: {
		assetsInlineLimit: 10 * 1024,
	},

	plugins: [react(), mkcert()],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	server: {
		host: true,
		port: 5174,
		proxy: {
			"/api": {
				target: "http://127.0.0.1:7001",
				changeOrigin: false,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},

	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				modifyVars: {
					hack: `true; @import (reference) "${path.resolve(__dirname, "./src/styles/variable.less")}";`,
				},
			},
		},

		postcss: {
			plugins: [
				autoprefixer({
					overrideBrowserslist: ["Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 8"],
				}),
				postCssPxToRem({
					rootValue: 37.5,
					propList: ["*"],
					selectorBlackList: ["norem"],
				}),
			],
		},
	},
}));
