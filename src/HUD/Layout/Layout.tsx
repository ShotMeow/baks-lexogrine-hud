import { useState } from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import Observed from "./../Players/Observed";
import RadarMaps from "./../Radar/RadarMaps";
import Trivia from "../Trivia/Trivia";
import SideBox from "../SideBoxes/SideBox";
import MoneyBox from "../SideBoxes/Money";
import UtilityLevel from "../SideBoxes/UtilityLevel";
import Killfeed from "../Killfeed/Killfeed";
import MapSeries from "../MapSeries/MapSeries";
import Overview from "../Overview/Overview";
import Tournament from "../Tournament/Tournament";
import Pause from "../PauseTimeout/Pause";
import Timeout from "../PauseTimeout/Timeout";
import { CSGO } from "csgogsi";
import { Match } from "../../API/types";
import { useAction } from "../../API/contexts/actions";
import { Scout } from "../Scout";
import CTAvatar from "../../assets/avatars/ct.png";
import TAvatar from "../../assets/avatars/t.png";

interface Props {
  game: CSGO;
  match: Match | null;
}
/*
interface State {
  winner: Team | null,
  showWin: boolean,
  forceHide: boolean
}*/

const Layout = ({ game, match }: Props) => {
  const [forceHide, setForceHide] = useState(false);
  const [playersListShown, setPlayersListShown] = useState(false);
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

  useAction("openPlayersList", () => {
    setPlayersListShown(!playersListShown);
  });

  return (
    <div className="layout">
      <div className={`players_alive`}>
        <div className="title_container">Players alive</div>
        <div className="counter_container">
          <div className={`team_counter ${left.side}`}>
            {leftPlayers.filter((player) => player.state.health > 0).length}
          </div>
          <div className={`vs_counter`}>VS</div>
          <div className={`team_counter ${right.side}`}>
            {rightPlayers.filter((player) => player.state.health > 0).length}
          </div>
        </div>
      </div>
      <Killfeed />
      <Overview match={match} map={game.map} players={game.players || []} />
      <RadarMaps match={match} map={game.map} game={game} />
      <MatchBar
        map={game.map}
        phase={game.phase_countdowns}
        bomb={game.bomb}
        match={match}
      />
      <Pause phase={game.phase_countdowns} />
      <Timeout map={game.map} phase={game.phase_countdowns} />
      {/*<SeriesBox map={game.map} match={match} />*/}
      {playersListShown && (
        <div className="players-list">
          <div className={`left ${left.side === "CT" ? "CT" : "T"}`}>
            <div className="header">
              <div>Nickname</div>
              <div>K</div>
              <div>A</div>
              <div>D</div>
              <div>HS%</div>
              <div>ADR</div>
            </div>
            <div className="players">
              {leftPlayers.map((player) => (
                <div className="list-player">
                  <div className="avatar">
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
          <div className={`right ${right.side === "CT" ? "CT" : "T"}`}>
            <div className="header">
              <div>ADR</div>
              <div>HS%</div>
              <div>D</div>
              <div>A</div>
              <div>K</div>
              <div>Nickname</div>
            </div>
            <div className="players">
              {rightPlayers.map((player) => (
                <div className="list-player">
                  <div>{player.state.adr}</div>
                  <div>{player.state.round_killhs}</div>
                  <div>{player.stats.deaths}</div>
                  <div>{player.stats.assists}</div>
                  <div>{player.stats.kills}</div>
                  <div className="avatar">
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
      )}
      <Tournament />

      <Observed player={game.player} />

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

      <Trivia />
      <Scout left={left.side} right={right.side} />
      <MapSeries
        teams={[left, right]}
        match={match}
        isFreezetime={isFreezetime}
        map={game.map}
      />
      <div className={"boxes left"}>
        <UtilityLevel
          side={left.side}
          players={game.players}
          show={isFreezetime && !forceHide}
        />
        <SideBox side="left" hide={forceHide} />
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
        <SideBox side="right" hide={forceHide} />
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
