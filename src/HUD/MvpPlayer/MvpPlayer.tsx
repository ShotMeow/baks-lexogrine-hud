import React, {FC} from 'react';
import {CSGO, Player} from "csgogsi";

import CTAvatar from "../../assets/avatars/ct.png";
import TAvatar from "../../assets/avatars/t.png";

interface Props {
    mvpPlayer: Player | undefined;
    isShown: boolean;
    game: CSGO;
}

const MvpPlayer: FC<Props> = ({mvpPlayer, isShown, game}) => {
    return (
        <div
            className={`mvp-player ${mvpPlayer?.team.side === "CT" ? "CT" : "T"} ${isShown ? "show" : "hidden"}`}
        >
            <img
                className="mvp-team"
                src={mvpPlayer?.team.logo || ""}
                alt="Team Logo"
            />
            <img
                className="mvp-avatar"
                src={
                    mvpPlayer?.avatar
                        ? mvpPlayer.avatar
                        : mvpPlayer?.team.side === "CT"
                            ? CTAvatar
                            : TAvatar
                }
                alt="Avatar"
            />
            <div className="mvp-name">{mvpPlayer?.name}</div>
            <div className="mvp-info">
                <div className="mvp-stats-title">
                    Статистика в {game.map.round} раунде
                </div>
                <div className="mvp-stats">
                    <div>
                        <div>Damage</div>
                        <span>{mvpPlayer?.state.round_totaldmg}</span>
                    </div>
                    <div>
                        <div>Kills</div>
                        <span>{mvpPlayer?.state.round_kills}</span>
                    </div>
                    <div>
                        <div>ADR</div>
                        <span>{mvpPlayer?.state.adr}</span>
                    </div>
                    <div>
                        <div>%HS</div>
                        <span>{mvpPlayer?.state.round_killhs}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MvpPlayer;