import {CSGO, Map} from "csgogsi";

import styles from './PauseTimeout.module.scss';
import React from "react";

interface IProps {
    phase: CSGO["phase_countdowns"] | null;
    map: Map;
}

const Timeout = ({phase, map}: IProps) => {
    const time = phase && Math.abs(Math.ceil(phase.phase_ends_in));
    const team = phase && phase.phase === "timeout_t" ? map.team_t : map.team_ct;

    return (
        <div
            className={`${styles['timeout']} ${
                styles[time && time > 2 && phase &&
                (phase.phase === "timeout_t" || phase.phase === "timeout_ct")
                    ? "show"
                    : ""]
            } ${
                styles[phase && (phase.phase === "timeout_t" || phase.phase === "timeout_ct")
                    ? phase.phase.substring(8)
                    : ""]
            }`}
        >
            <img
                className={styles['team']}
                src={team.logo || ""}
                alt="Team Logo"
            />
            {team.name} TIMEOUT
        </div>
    );
};
export default Timeout;
