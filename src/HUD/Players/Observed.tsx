import React, { useState } from "react";
import { Player } from "csgogsi";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./observed.scss";
import { ArmorHalf, ArmorHelmet, HealthFull } from "./../../assets/Icons";
import { useAction } from "../../API/contexts/actions";
import Bomb from "../Indicators/Bomb.tsx";
import Defuse from "../Indicators/Defuse.tsx";

const Statistic = React.memo(
  ({ label, value }: { label: string; value: string | number }) => {
    return (
      <div className="stat">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    );
  },
);

const Observed = ({ player }: { player: Player | null }) => {
  const [showCam, setShowCam] = useState(true);

  useAction("toggleCams", () => {
    setShowCam((p) => !p);
  });

  if (!player) return null;

  const currentWeapon = player.weapons.filter(
    (weapon) => weapon.state === "active",
  )[0];
  const grenades = player.weapons.filter((weapon) => weapon.type === "Grenade");
  const { stats } = player;
  return (
    <div className={`observed ${player.team.side}`}>
      <div className="avatar-container">
        <Avatar
          steamid={player.steamid}
          teamId={player.team.id}
          url={player.avatar}
          side={player.team.side}
          height={140}
          width={140}
          showCam={showCam}
          slot={player.observer_slot}
        />
        <div className="gradient" />
      </div>
      <div className="info">
        <div className="top">
          <div className="name">
            <TeamLogo team={player.team} height={35} width={35} />
            <div>{player?.name}</div>
          </div>
          <div className="utilities">
            <div className="main">
              <Bomb player={player} />
              <Defuse player={player} />
            </div>
            <div className="grenades">
              {grenades.map((grenade) => (
                <React.Fragment
                  key={`${player.steamid}_${grenade.name}_${
                    grenade.ammo_reserve || 1
                  }`}
                >
                  <Weapon
                    weapon={grenade.name}
                    active={grenade.state === "active"}
                    isGrenade
                  />
                  {grenade.ammo_reserve === 2 ? (
                    <Weapon
                      weapon={grenade.name}
                      active={grenade.state === "active"}
                      isGrenade
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="stats">
            <div className="health">
              <HealthFull />
              <span>{player?.state.health}</span>
            </div>
            <div className="armor">
              {player?.state.helmet ? <ArmorHelmet /> : <ArmorHalf />}
              <span>{player?.state.armor}</span>
            </div>
          </div>
          <div className="statistics">
            <Statistic label={"K"} value={stats.kills} />
            <Statistic label={"A"} value={stats.assists} />
            <Statistic label={"D"} value={stats.deaths} />
          </div>
          <div className="ammo">
            <div className="counter">
              <div className="ammo_clip">
                {(currentWeapon && currentWeapon.ammo_clip) || "-"}
              </div>
              <div className="ammo_reserve">
                / {(currentWeapon && currentWeapon.ammo_reserve) || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Observed;
