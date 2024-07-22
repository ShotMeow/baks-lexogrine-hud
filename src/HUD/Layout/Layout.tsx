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
import { CSGO, Player, RoundInfo } from "csgogsi";
import { Match } from "../../API/types";
import { useAction } from "../../API/contexts/actions";
import { Scout } from "../Scout";
import CTAvatar from "../../assets/avatars/ct.png";
import TAvatar from "../../assets/avatars/t.png";

import defusingVideo from "../../assets/videos/defusing.webm";
import plantingVideo from "../../assets/videos/planting.webm";
import { Bomb, DeathIcon, Defuse } from "../../assets/Icons.tsx";
import { GSI } from "../../API/HUD";

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

  const roundsArr: Partial<RoundInfo>[] = [];
  game.map.rounds.forEach((round) => roundsArr.push(round));

  for (let i = roundsArr.length + 1; i < 31; i++) {
    roundsArr.push({
      round: i,
    });
  }

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
      <div className={`players_alive ${isFreezetime ? 'hide' : 'hide'}`}>
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
      {game.bomb?.state === "planting" ? (
        <div className="bomb-state">
          <video autoPlay muted loop>
            <source src={plantingVideo} type="video/webm" />
          </video>
          <div>{game.bomb.player?.name} PLANTING THE BOMB</div>
        </div>
      ) : (
        game.bomb?.state === "defusing" && (
          <div className="bomb-state">
            <video autoPlay muted loop>
              <source src={defusingVideo} type="video/webm" />
            </video>
            <div>{game.bomb.player?.name} DEFUSING THE BOMB</div>
          </div>
        )
      )}
      <Killfeed />
      <Overview match={match} map={game.map} players={game.players || []} />
      <RadarMaps match={match} map={game.map} game={game} />
      <MatchBar
        map={game.map}
        phase={game.phase_countdowns}
        bomb={game.bomb}
        match={match}
        mvpPlayer={mvpPlayer}
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
      <div
        className={`rounds-result ${!isFreezetime || mvpPlayer ? "hide" : ""}`}
      >
        {roundsArr.map((round) => (
          <div key={round.round} className="round">
            {round.outcome && (
              <div className="icon">
                {round.outcome === "ct_win_elimination" ||
                round.outcome === "t_win_elimination" ||
                round.outcome === "ct_win_time" ? (
                  <DeathIcon />
                ) : round.outcome === "ct_win_defuse" ? (
                  <Defuse />
                ) : (
                  <Bomb />
                )}
              </div>
            )}
            <div
              className={`block ${
                round.side === "CT" ? "CT" : round.side === "T" ? "T" : ""
              }`}
            >
              <div className="block-top" />
              <span>{getRound(round.round)}</span>
            </div>
          </div>
        ))}
      </div>
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

      <div
        className={`mvp-player ${mvpPlayer?.team.side === "CT" ? "CT" : "T"} ${isFreezetime && mvpPlayer ? "show" : "hidden"}`}
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
