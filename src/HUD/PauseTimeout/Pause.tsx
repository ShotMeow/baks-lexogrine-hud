import {CSGO} from "csgogsi";

import styles from './PauseTimeout.module.scss';

interface IProps {
    phase: CSGO["phase_countdowns"] | null;
}

const Pause = ({phase}: IProps) => {
    return (
        <div

            className={`${styles['pause']} ${styles[phase && phase.phase === "paused" ? "show" : ""]}`}
        >
            PAUSE
        </div>
    );
};
export default Pause;
