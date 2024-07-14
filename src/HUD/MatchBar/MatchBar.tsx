import * as I from "csgogsi";
import "./matchbar.scss";
import TeamScore from "./TeamScore";
import { useBombTimer } from "./../Timers/Countdown";
import { Match } from "./../../API/types";
import matchbarBgSrc from "../../assets/bg/matchbar-bg.png";
import baksLogoSrc from "../../assets/icons/baks_logo.png";

function stringToClock(time: string | number, pad = true) {
  if (typeof time === "string") {
    time = parseFloat(time);
  }
  const countdown = Math.abs(Math.ceil(time));
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown - minutes * 60;
  if (pad && seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

interface IProps {
  match: Match | null;
  map: I.Map;
  phase: I.CSGO["phase_countdowns"];
  bomb: I.Bomb | null;
}

export interface Timer {
  time: number;
  active: boolean;
  side: "left" | "right";
  type: "defusing" | "planting";
  player: I.Player | null;
}

const getRoundLabel = (mapRound: number) => {
  const round = mapRound + 1;
  if (round <= 24) {
    return `Round ${round}/24`;
  }
  const additionalRounds = round - 24;
  const OT = Math.ceil(additionalRounds / 6);
  return `OT ${OT} (${additionalRounds - (OT - 1) * 6}/6)`;
};

const Matchbar = (props: IProps) => {
  const { bomb, match, map, phase } = props;
  const time = stringToClock(phase.phase_ends_in);
  const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
  const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
  const isPlanted =
    bomb && (bomb.state === "defusing" || bomb.state === "planted");

  const bombData = useBombTimer();
  const plantTimer: Timer | null =
    bombData.state === "planting"
      ? {
          time: bombData.plantTime,
          active: true,
          side: bombData.player?.team.orientation || "right",
          player: bombData.player,
          type: "planting",
        }
      : null;
  const defuseTimer: Timer | null =
    bombData.state === "defusing"
      ? {
          time: bombData.defuseTime,
          active: true,
          side: bombData.player?.team.orientation || "left",
          player: bombData.player,
          type: "defusing",
        }
      : null;

  let leftTimer = null;
  let rightTimer = null;
  if (defuseTimer?.active || plantTimer?.active) {
    if (defuseTimer?.active) {
      if (defuseTimer.side === "left") leftTimer = defuseTimer;
      else rightTimer = defuseTimer;
    } else {
      if (plantTimer?.side === "left") leftTimer = plantTimer;
      else rightTimer = plantTimer;
    }
  }

  const amountOfMaps =
    (match && Math.floor(Number(match.matchType.substr(-1)) / 2) + 1) || 0;

  return (
    <>
      <div id={`matchbar`}>
        <TeamScore team={left} orientation={"left"} timer={leftTimer} />
        <div className={`score left ${left.side}`}>
          <div className={`wins_box_container left rounds-${amountOfMaps}`}>
            {new Array(amountOfMaps).fill(0).map((_, i) => (
              <div
                key={i}
                className={`wins_box ${
                  left.matches_won_this_series > i ? "win" : ""
                } ${left.side}`}
              />
            ))}
          </div>
          <span>{left.score}</span>
        </div>
        <div id="timer">
          <img className="baks-logo" src={baksLogoSrc} alt="Logo" />
          <img className="matchbar-bg" src={matchbarBgSrc} alt="Фон" />
          <div className="cup-bg" />
          <div className={`round_timer_text ${isPlanted ? "planting" : ""}`}>
            {isPlanted ? (
              <span>
                BOMB <br /> ON {bomb?.site}
              </span>
            ) : (
              time
            )}
          </div>
          <div
            id="round_now"
            className={`${phase.phase === "freezetime" ? "hide" : ""}`}
          >
            {getRoundLabel(map.round)}
          </div>
        </div>
        <div className={`score right ${right.side}`}>
          <div className={`wins_box_container right rounds-${amountOfMaps}`}>
            {new Array(amountOfMaps).fill(0).map((_, i) => (
              <div
                key={i}
                className={`wins_box ${
                  right.matches_won_this_series > i ? "win" : ""
                } ${left.side}`}
              />
            ))}
          </div>
          <span>{right.score}</span>
        </div>
        <TeamScore team={right} orientation={"right"} timer={rightTimer} />
      </div>
    </>
  );
};

export default Matchbar;
