import {useState} from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import Observed from "./../Players/Observed";
import RadarMaps from "./../Radar/RadarMaps";
import Trivia from "../Trivia/Trivia";
import SideBox from "../SideBoxes/SideBox";
import MoneyBox from "../SideBoxes/Money";
import UtilityLevel from "../SideBoxes/UtilityLevel";
import Killfeed from "../Killfeed/Killfeed";
import Overview from "../Overview/Overview";
import Tournament from "../Tournament/Tournament";
import {CSGO, Player} from "csgogsi";
import {Match} from "../../API/types";
import {useAction} from "../../API/contexts/actions";
import {Scout} from "../Scout";
import {GSI} from "../../API/HUD";
import PlayersAlive from "../PlayersAlive/PlayersAlive.tsx";
import PlantDefuse from "../Timers/PlantDefuse.tsx";
import PlayersList from "../PlayersList/PlayersList.tsx";
import RoundsResult from "../RoundsResult/RoundsResult.tsx";
import MvpPlayer from "../MvpPlayer/MvpPlayer.tsx";

interface Props {
    game: CSGO;
    match: Match | null;
}

const Layout = ({game, match}: Props) => {
    const [forceHide, setForceHide] = useState(false);
    useAction("boxesState", (state) => {
        console.log("UPDATE STATE UMC", state);
        if (state === "show") {
            setForceHide(false);
        } else if (state === "hide") {
            setForceHide(true);
        }
    });

    const left =
        game.map.team_ct.orientation === "left"
            ? game.map.team_ct
            : game.map.team_t;
    const right =
        game.map.team_ct.orientation === "left"
            ? game.map.team_t
            : game.map.team_ct;

    const leftPlayers = game.players.filter(
        (player) => player.team.side === left.side,
    );
    const rightPlayers = game.players.filter(
        (player) => player.team.side === right.side,
    );
    const isFreezetime =
        (game.round && game.round.phase === "freezetime") ||
        game.phase_countdowns.phase === "freezetime";


    const [mvpPlayer, setMvpPlayer] = useState<Player>();

    GSI.on("roundEnd", () => {
        const newMvpPlayer = game.players.find(
            (player) => player.state.round_kills >= 3,
        );

        if (newMvpPlayer) {
            setMvpPlayer(newMvpPlayer);
        } else {
            setMvpPlayer(undefined);
        }
    });

    return (
        <div className={`layout ${game.map.phase === 'gameover' ? 'hide' : ''}`}>
            <PlayersAlive leftPlayers={leftPlayers} rightPlayers={rightPlayers} left={left} right={right}
                          isShown={!isFreezetime}/>
            <PlantDefuse/>
            <Killfeed/>
            <Overview match={match} map={game.map} players={game.players || []}/>
            <RadarMaps match={match} map={game.map} game={game}/>
            <MatchBar
                map={game.map}
                phase={game.phase_countdowns}
                bomb={game.bomb}
                match={match}
                mvpPlayer={mvpPlayer}
            />
            <PlayersList leftPlayers={leftPlayers} rightPlayers={rightPlayers} left={left} right={right}/>
            <RoundsResult game={game} isShown={isFreezetime && !mvpPlayer}/>
            <Tournament/>

            <Observed player={game.player}/>

            <TeamBox
                team={left}
                players={leftPlayers}
                side="left"
                current={game.player}
            />
            <TeamBox
                team={right}
                players={rightPlayers}
                side="right"
                current={game.player}
            />
            <MvpPlayer mvpPlayer={mvpPlayer} isShown={Boolean(isFreezetime && mvpPlayer)} game={game}/>

            <Trivia/>
            <Scout left={left.side} right={right.side}/>
            <div className={"boxes left"}>
                <UtilityLevel
                    side={left.side}
                    players={game.players}
                    show={isFreezetime && !forceHide}
                />
                <SideBox side="left" hide={forceHide}/>
                <MoneyBox
                    team={left.side}
                    side="left"
                    loss={Math.min(left.consecutive_round_losses * 500 + 1400, 3400)}
                    equipment={leftPlayers
                        .map((player) => player.state.equip_value)
                        .reduce((pre, now) => pre + now, 0)}
                    money={leftPlayers
                        .map((player) => player.state.money)
                        .reduce((pre, now) => pre + now, 0)}
                    show={isFreezetime && !forceHide}
                />
            </div>
            <div className={"boxes right"}>
                <UtilityLevel
                    side={right.side}
                    players={game.players}
                    show={isFreezetime && !forceHide}
                />
                <SideBox side="right" hide={forceHide}/>
                <MoneyBox
                    team={right.side}
                    side="right"
                    loss={Math.min(right.consecutive_round_losses * 500 + 1400, 3400)}
                    equipment={rightPlayers
                        .map((player) => player.state.equip_value)
                        .reduce((pre, now) => pre + now, 0)}
                    money={rightPlayers
                        .map((player) => player.state.money)
                        .reduce((pre, now) => pre + now, 0)}
                    show={isFreezetime && !forceHide}
                />
            </div>
        </div>
    );
};
export default Layout;
