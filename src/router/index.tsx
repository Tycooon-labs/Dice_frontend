import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/layouts";
import InitLoad from "@/pages/initLoad";
import Game from "@/pages/game";
import NoMatch from "@/pages/noMatch";

export const Router = () => {
	return (
		<Suspense fallback={"loading..."}>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" index element={<InitLoad />} />
					<Route path="/game" element={<Game />} />
					<Route path="*" element={<NoMatch />} />
				</Route>
			</Routes>
		</Suspense>
	);
};
