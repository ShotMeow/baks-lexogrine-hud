import {useBombTimer} from "./Countdown";
import {Bomb as BombIcon, Defuse} from "../../assets/Icons.tsx";
import {useEffect, useState} from "react";

const Bomb = () => {
    const bombData = useBombTimer();
    const [plantWidth, setPlantWidth] = useState(0);
    const [defuseWidth, setDefuseWidth] = useState(0);
    useEffect(() => {
        const plantInterval = setInterval(() => {
            setPlantWidth(plantWidth + 1.8);
        }, 50);
        const defuseInterval = setInterval(() => {
            bombData.player?.state.defusekit
                ? setDefuseWidth(defuseWidth + 1.3)
                : setDefuseWidth(defuseWidth + 0.536);
        }, 50);

        return () => {
            clearInterval(defuseInterval);
            clearInterval(plantInterval);
        };
    }, [bombData.player?.state.defusekit, defuseWidth, plantWidth]);
    return (
        <>
            <div
                className={`defuse-bar ${bombData.state !== "defusing" ? "hide" : ""}`}
            >
                <Defuse/>
                <div className="indicator">
                    <div
                        className="stripe"
                        style={{
                            width: `${defuseWidth}%`,
                        }}
                    />
                </div>
            </div>
            <div
                className={`plant-bar ${bombData.state !== "planting" ? "hide" : ""}`}
            >
                <BombIcon/>
                <div className="indicator">
                    <div
                        className="stripe"
                        style={{
                            width: `${plantWidth}%`,
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Bomb;
