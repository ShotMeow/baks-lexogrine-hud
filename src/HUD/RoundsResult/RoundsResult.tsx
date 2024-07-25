import React, {FC} from 'react';
import {Bomb, DeathIcon, Defuse} from "../../assets/Icons.tsx";
import {CSGO, RoundInfo} from "csgogsi";

import styles from "./RoundsResult.module.scss";

interface Props {
    game: CSGO;
    isShown: boolean;
}

const getRound = (round: number | undefined) => {
    switch (round) {
        case 5:
            return round;
        case 10:
            return round;
        case 15:
            return round;
        case 20:
            return round;
        case 25:
            return round;
        case 30:
            return round;
        default:
            return;
    }
};

const RoundsResult: FC<Props> = ({game, isShown}) => {
    const roundsArr: Partial<RoundInfo>[] = game.map.rounds;

    for (let i = roundsArr.length + 1; i < 31; i++) {
        roundsArr.push({
            round: i,
        });
    }
    return (
        <div
            className={`${styles["rounds-result"]} ${styles[isShown ? "" : "hide"]}`}
        >
            {roundsArr.map((round, index) => (
                <div key={round.round} className={styles["round"]}>
                    <div className={styles["inner"]}>
                        {round.outcome && (
                            <div className={styles["icon"]}>
                                {round.outcome === "ct_win_elimination" ||
                                round.outcome === "t_win_elimination" ||
                                round.outcome === "ct_win_time" ? (
                                    <DeathIcon/>
                                ) : round.outcome === "ct_win_defuse" ? (
                                    <Defuse/>
                                ) : (
                                    <Bomb/>
                                )}
                            </div>
                        )}
                        <div
                            className={`${styles["block"]} ${
                                styles[round.side === "CT" ? "CT" : round.side === "T" ? "T" : ""]
                            }`}
                        >
                            <div className={styles["block-top"]}/>
                            <span>{getRound(round.round)}</span>
                        </div>
                    </div>
                    {index === 11 && <div className={styles['line']}/>}
                </div>
            ))}
        </div>
    );
};

export default RoundsResult;