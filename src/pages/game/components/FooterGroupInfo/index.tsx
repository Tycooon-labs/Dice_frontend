import { useState } from "react";
import cls from "classnames";
import { gameStore } from "@/stores";
import IconVoiceEnabledImg from "@/assets/icon/icon_voice_enabled.png";
import IconVoiceDisabledImg from "@/assets/icon/icon_voice_disabled.png";
import IconBgmEnabledImg from "@/assets/icon/icon_bgm_enabled.png";
import IconBgmDisabledImg from "@/assets/icon/icon_bgm_disabled.png";
import styles from "./index.module.less";

export const FooterGroupInfo = () => {
	const [voiceIsMute, setVoiceIsMute] = useState(false);
	const [bgmIsMute, setBgmIsMute] = useState(false);

	const onToggleVoice = () => {
		gameStore.actions.batchControlMusic(voiceIsMute ? "unMute" : "mute");
		setVoiceIsMute(!voiceIsMute);
	};

	const onToggleBgm = () => {
		gameStore.actions.music("bgm", bgmIsMute ? "unMute" : "mute");
		setBgmIsMute(!bgmIsMute);
	};

	return (
		<div className={styles.footerGroupInfo}>
			<span className={cls(styles.voice)} onClick={onToggleVoice}>
				<img src={voiceIsMute ? IconVoiceDisabledImg : IconVoiceEnabledImg} />
			</span>
			<span className={cls(styles.bgm, { [styles.enabled]: !bgmIsMute })} onClick={onToggleBgm}>
				<img src={bgmIsMute ? IconBgmDisabledImg : IconBgmEnabledImg} />
			</span>
		</div>
	);
};
