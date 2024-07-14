import { Team } from "csgogsi";

const WinAnnouncement = ({
  team,
  show,
}: {
  team: Team | null;
  show: boolean;
}) => {
  if (!team) return null;
  return (
    <div
      className={`winner ${team.side === "CT" ? "CT" : "T"} ${
        show ? "show" : "hidden"
      }`}
    >
      {team.logo ? <img src={team.logo} alt={"Team logo"} /> : ""}
      <div className="team">{team.name}</div>
      <div className="title">Wins the Round</div>
    </div>
  );
};

export default WinAnnouncement;
