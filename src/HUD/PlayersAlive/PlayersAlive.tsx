import React, {FC} from 'react';
import type {Player, Team} from "csgogsi";

import styles from "./PlayersAlive.module.scss";

interface Props {
    leftPlayers: Player[];
    rightPlayers: Player[];
    left: Team;
    right: Team;
    isShown: boolean;
}

const PlayersAlive: FC<Props> = ({leftPlayers, rightPlayers, right, left, isShown}) => {

    return (
        <div className={`${styles["players_alive"]} ${styles[isShown ? "hide" : "hide"]}`}>
            <div className={styles["title_container"]}>Players alive</div>
            <div className={styles["counter_container"]}>
                <div className={`${styles["team_counter"]} ${styles[left.side]}`}>
                    {leftPlayers.filter((player) => player.state.health > 0).length}
                </div>
                <div className={styles["vs_counter"]}>VS</div>
                <div className={`${styles["team_counter"]} ${styles[right.side]}`}>
                    {rightPlayers.filter((player) => player.state.health > 0).length}
                </div>
            </div>
        </div>
    );
};

export default PlayersAlive;