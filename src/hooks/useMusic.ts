import { useRef, useEffect } from "react";

type Props = Pick<HTMLMediaElement, "loop" | "src"> & {
	once: boolean;
	volume?: number;
};

export const useMusic = (props: Props) => {
	const audioRef = useRef(new Audio());

	const stopMusic = () => {
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
	};

	const playMusic = () => {
		audioRef.current.play().catch((error) => {
			console.log(error);
		});
	};

	useEffect(() => {
		Object.keys(props).forEach((k) => {
			(audioRef.current as any)[k] = (props as any)[k];
		});

		if (props.once) {
			window.addEventListener("click", playMusic, { once: true });
			window.addEventListener("touchstart", playMusic, { once: true });
			window.addEventListener("scroll", playMusic, { once: true });
			window.addEventListener("focus", playMusic, { once: true });
			window.addEventListener("mousemove", playMusic, { once: true });
			window.addEventListener("pointerdown", playMusic, { once: true });
		}
	}, []);

	return {
		playMusic,
		stopMusic,
	};
};
