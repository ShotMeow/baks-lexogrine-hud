import * as I from "csgogsi";
import { Timer } from "./MatchBar";
import TeamLogo from "./TeamLogo";
import { onGSI } from "../../API/contexts/actions";
import WinAnnouncement from "./WinIndicator";
import { useState } from "react";

interface IProps {
  orientation: "left" | "right";
  timer: Timer | null;
  team: I.Team;
}

const TeamScore = ({ orientation, team }: IProps) => {
  const [show, setShow] = useState(false);

  onGSI(
    "roundEnd",
    (result) => {
      if (result.winner.orientation !== orientation) return;
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 5000);
    },
    [orientation],
  );

  return (
    <>
      <div className={`team ${orientation} ${team.side || ""}`}>
        <div className="team-name">{team?.name || null}</div>
        <TeamLogo team={team} />
      </div>
      <WinAnnouncement team={team} show={show} />
    </>
  );
};

export default TeamScore;
