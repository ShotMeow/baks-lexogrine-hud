import {CSGO} from "csgogsi";

import styles from './PauseTimeout.module.scss';

interface IProps {
    game: CSGO;
}

const Pause = ({game}: IProps) => {
    return (
        <div

            className={`${styles['pause']} ${styles[game.phase_countdowns.phase === "paused" ? "show" : ""]} ${styles[game.map.round === 0 ? "adjacent" : "no-adjacent"]}`}
        >
            PAUSE
        </div>
    );
};
export default Pause;
