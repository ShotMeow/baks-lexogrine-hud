import React, {FC, useState} from 'react';
import CTAvatar from "../../assets/avatars/ct.png";
import TAvatar from "../../assets/avatars/t.png";
import type {Player, Team} from "csgogsi";
import {useAction} from "../../API/contexts/actions.tsx";

import styles from "./PlayersList.module.scss";

interface Props {
    leftPlayers: Player[];
    rightPlayers: Player[];
    left: Team;
    right: Team;
}

const PlayersList: FC<Props> = ({leftPlayers, rightPlayers, right, left}) => {
    const [playersListShown, setPlayersListShown] = useState(false);

    useAction("openPlayersList", () => {
        setPlayersListShown(!playersListShown);
    });

    return playersListShown && (
        <div className={styles['players-list']}>
            <div className={`${styles['left']} ${styles[left.side === "CT" ? "CT" : "T"]}`}>
                <div className={styles['header']}>
                    <div>Nickname</div>
                    <div>K</div>
                    <div>A</div>
                    <div>D</div>
                    <div>HS%</div>
                    <div>ADR</div>
                </div>
                <div className={styles['players']}>
                    {leftPlayers.map((player) => (
                        <div className={styles["list-player"]}>
                            <div className={styles["avatar"]}>
                                <img
                                    src={
                                        player.avatar
                                            ? player.avatar
                                            : left.side === "CT"
                                                ? CTAvatar
                                                : TAvatar
                                    }
                                    alt="Avatar"
                                />
                                <div>{player.name}</div>
                            </div>
                            <div>{player.stats.kills}</div>
                            <div>{player.stats.assists}</div>
                            <div>{player.stats.deaths}</div>
                            <div>{player.state.round_killhs}</div>
                            <div>{player.state.adr}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`${styles['right']} ${styles[right.side === "CT" ? "CT" : "T"]}`}>
                <div className={styles['header']}>
                    <div>ADR</div>
                    <div>HS%</div>
                    <div>D</div>
                    <div>A</div>
                    <div>K</div>
                    <div>Nickname</div>
                </div>
                <div className={styles['players']}>
                    {rightPlayers.map((player) => (
                        <div className={styles["list-player"]}>
                            <div>{player.state.adr}</div>
                            <div>{player.state.round_killhs}</div>
                            <div>{player.stats.deaths}</div>
                            <div>{player.stats.assists}</div>
                            <div>{player.stats.kills}</div>
                            <div className={styles["avatar"]}>
                                <div>{player.name}</div>
                                <img
                                    src={
                                        player.avatar
                                            ? player.avatar
                                            : right.side === "CT"
                                                ? CTAvatar
                                                : TAvatar
                                    }
                                    alt="Avatar"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayersList;