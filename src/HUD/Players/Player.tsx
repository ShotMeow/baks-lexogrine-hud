import * as I from "csgogsi";
import Avatar from "./Avatar";
import Weapon from "../Weapon/Weapon.tsx";
import {ArmorHalf, ArmorHelmet, DeathIcon, KillIcon, Suicide,} from "../../assets/Icons.tsx";
import React, {Fragment} from "react";
import Bomb from "../Indicators/Bomb.tsx";
import Defuse from "../Indicators/Defuse.tsx";

interface IProps {
    player: I.Player;
    isObserved: boolean;
}

const getCurrentMoney = (money: number) => {
    const moneyArr = String(money).split("");
    if (String(money).length === 4) {
        moneyArr.splice(1, 0, " ");
    }

    if (String(money).length === 5) {
        moneyArr.splice(2, 0, " ").join("");
    }

    return moneyArr.join("");
};

const compareWeapon = (weaponOne: I.WeaponRaw, weaponTwo: I.WeaponRaw) => {
    return (
        weaponOne.name === weaponTwo.name &&
        weaponOne.paintkit === weaponTwo.paintkit &&
        weaponOne.type === weaponTwo.type &&
        weaponOne.ammo_clip === weaponTwo.ammo_clip &&
        weaponOne.ammo_clip_max === weaponTwo.ammo_clip_max &&
        weaponOne.ammo_reserve === weaponTwo.ammo_reserve &&
        weaponOne.state === weaponTwo.state
    );
};

const compareWeapons = (
    weaponsObjectOne: I.Weapon[],
    weaponsObjectTwo: I.Weapon[],
) => {
    const weaponsOne = [...weaponsObjectOne].sort((a, b) =>
        a.name.localeCompare(b.name),
    );
    const weaponsTwo = [...weaponsObjectTwo].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    if (weaponsOne.length !== weaponsTwo.length) return false;

    return weaponsOne.every((weapon, i) => compareWeapon(weapon, weaponsTwo[i]));
};

const arePlayersEqual = (playerOne: I.Player, playerTwo: I.Player) => {
    return (
        playerOne.name === playerTwo.name &&
        playerOne.steamid === playerTwo.steamid &&
        playerOne.observer_slot === playerTwo.observer_slot &&
        playerOne.defaultName === playerTwo.defaultName &&
        playerOne.clan === playerTwo.clan &&
        playerOne.stats.kills === playerTwo.stats.kills &&
        playerOne.stats.assists === playerTwo.stats.assists &&
        playerOne.stats.deaths === playerTwo.stats.deaths &&
        playerOne.stats.mvps === playerTwo.stats.mvps &&
        playerOne.stats.score === playerTwo.stats.score &&
        playerOne.state.health === playerTwo.state.health &&
        playerOne.state.armor === playerTwo.state.armor &&
        playerOne.state.helmet === playerTwo.state.helmet &&
        playerOne.state.defusekit === playerTwo.state.defusekit &&
        playerOne.state.flashed === playerTwo.state.flashed &&
        playerOne.state.smoked === playerTwo.state.smoked &&
        playerOne.state.burning === playerTwo.state.burning &&
        playerOne.state.money === playerTwo.state.money &&
        playerOne.state.round_killhs === playerTwo.state.round_killhs &&
        playerOne.state.round_kills === playerTwo.state.round_kills &&
        playerOne.state.round_totaldmg === playerTwo.state.round_totaldmg &&
        playerOne.state.equip_value === playerTwo.state.equip_value &&
        playerOne.state.adr === playerTwo.state.adr &&
        playerOne.avatar === playerTwo.avatar &&
        !!playerOne.team.id === !!playerTwo.team.id &&
        playerOne.team.side === playerTwo.team.side &&
        playerOne.country === playerTwo.country &&
        playerOne.realName === playerTwo.realName &&
        compareWeapons(playerOne.weapons, playerTwo.weapons)
    );
};
const Player = ({player, isObserved}: IProps) => {
    const weapons = player.weapons.map((weapon) => ({
        ...weapon,
        name: weapon.name.replace("weapon_", ""),
    }));

    const primary =
        weapons.filter(
            (weapon) =>
                !["C4", "Pistol", "Knife", "Grenade", undefined].includes(weapon.type),
        )[0] || null;
    const secondary =
        weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");

    return (
        <div
            className={`player ${player.state.flashed ? "flashed" : ""} ${player.state.health === 0 ? "dead" : ""} ${isObserved ? "active" : ""}`}
        >
            <Avatar
                side={player.team.side}
                teamId={player.team.id}
                steamid={player.steamid}
                url={player.avatar}
                height={80}
                width={80}
                showSkull={false}
                showCam={false}
                sidePlayer={true}
            />
            <div className="top">
                <div className="name">
                    <div>{player.observer_slot}</div>
                    <div>{player.name}</div>
                </div>
                {player.state.armor ? <div className="armor">
                    {player.state.helmet ? <ArmorHelmet/> : <ArmorHalf/>}
                    <span>{player.state.health}</span>
                </div> : <></>}
                <div
                    className="background-red"
                    style={{width: `${player?.state.health}%`}}
                />
                <div
                    className="background"
                    style={{width: `${player?.state.health}%`}}
                />
            </div>
            <div className="bottom">
                <div className="bottom-header">
                    <div className="bottom-header-group">
                        <div className="money">{getCurrentMoney(player.state.money)}$</div>
                        {player.state.round_kills !== 0 &&
                            <div className="round-kills">
                                <Suicide/>
                                <span>
                {player.state.round_kills}
              </span>
                            </div>
                        }
                    </div>
                    <div className="weapon">
                        {primary ? (
                            <Weapon
                                weapon={primary.name}
                                active={primary.state === "active"}
                            />
                        ) : (
                            secondary && (
                                <Weapon
                                    weapon={secondary.name}
                                    active={secondary.state === "active"}
                                />
                            )
                        )}
                    </div>
                </div>
                <div className="bottom-footer">
                    <div className="stats">
                        <div className="kills">
                            <KillIcon/>
                            <span>{player.stats.kills}</span>
                        </div>
                        <div className="deaths">
                            <DeathIcon/>
                            <span>{player.stats.deaths}</span>
                        </div>
                    </div>
                    <Bomb player={player}/>
                    <Defuse player={player}/>
                    <div className="grenades">
                        {grenades.map((grenade) => (
                            <Fragment
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
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const arePropsEqual = (
    prevProps: Readonly<IProps>,
    nextProps: Readonly<IProps>,
) => {
    if (prevProps.isObserved !== nextProps.isObserved) return false;

    return arePlayersEqual(prevProps.player, nextProps.player);
};

export default React.memo(Player, arePropsEqual);
//export default Player;
