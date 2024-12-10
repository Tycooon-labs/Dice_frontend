import { Toaster } from "react-hot-toast";
import "./index.less";

export const Toast = () => {
	const TimeOut = 1000 * 4;

	return (
		<Toaster
			position="top-center"
			reverseOrder={false}
			toastOptions={{
				className: "hotToast",
				duration: TimeOut,
				style: {
					maxWidth: "640px",
				},
			}}
		/>
	);
};
