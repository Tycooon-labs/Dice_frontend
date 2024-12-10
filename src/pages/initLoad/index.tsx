import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoImg from "@/assets/init_dice.png";
import TitleImg from "@/assets/init_title.png";
import styles from "./index.module.less";

type ImgItem = {
	src: string;
	load: boolean;
};

const maxConcurrent = 2;
let curQueueLoadDoneCount = 0;

export default () => {
	const navigate = useNavigate();
	const [imgList, setImgList] = useState<ImgItem[]>([]);
	const [loadDoneCount, setLoadDoneCount] = useState<number>(0);
	const [queueList, setQueueList] = useState<string[]>([]);
	const imgModule: Record<string, { default: string }> = import.meta.glob("../../assets/**/*.{jpg,jpeg,png}", { eager: true });

	const init = () => {
		const tempImgList = [];

		for (const item of Object.values(imgModule)) {
			tempImgList.push({
				src: item.default,
				load: false,
			});
		}

		setImgList(tempImgList);
	};

	const handleImageLoad = () => {
		curQueueLoadDoneCount++;

		if (curQueueLoadDoneCount === maxConcurrent || loadDoneCount + curQueueLoadDoneCount === imgList.length) {
			const tempCurQueueLoadDoneCount = curQueueLoadDoneCount;

			setLoadDoneCount((prev) => prev + tempCurQueueLoadDoneCount);
			setQueueList([]);
			curQueueLoadDoneCount = 0;
		}
	};

	const handleAddQueue = () => {
		const tempAddList = [];
		const newList = imgList.filter((item) => item.load === false);

		if (newList.length === 0) {
			return;
		}

		for (const i in newList) {
			const item = newList[i];

			item.load = true;
			tempAddList.push(item.src);

			if (Number(i) === maxConcurrent - 1) {
				break;
			}
		}

		setQueueList(tempAddList);
	};

	useEffect(() => {
		setTimeout(() => {
			setLoadDoneCount(4);
		}, 1000 * 0.4);
		setTimeout(() => {
			setLoadDoneCount(7);
		}, 1000 * 1);
		setTimeout(() => {
			setLoadDoneCount(9);
		}, 1000 * 1.4);
		setTimeout(() => {
			setLoadDoneCount(10);
		}, 1000 * 1.8);
		setTimeout(() => {
			navigate("/game");
		}, 1000 * 2);
	}, []);

	return (
		<div className={styles.page}>
			<img className={styles.logo} src={LogoImg} />
			<img className={styles.title} src={TitleImg} />
			<div className={styles.container}>
				<div className={styles.loading}>
					<span className={styles.text}>loading</span>
					<span className={styles.dot}>.</span>
					<span className={styles.dot}>.</span>
					<span className={styles.dot}>.</span>
				</div>
				<div className={styles.process}>
					{/* <span className={styles.line} style={{ width: `${(loadDoneCount / imgList.length) * 100}%` }} /> */}
					<span className={styles.line} style={{ width: `${(loadDoneCount / 10) * 100}%` }} />
				</div>
				<div className={styles.version}>v 1.0.0</div>
			</div>

			<div style={{ opacity: 0, width: 0, height: 0, overflow: "hidden" }}>
				{queueList.map((src, i) => (
					<img key={i} src={src} onLoad={() => handleImageLoad()} onError={() => handleImageLoad()} />
				))}
			</div>
		</div>
	);
};
