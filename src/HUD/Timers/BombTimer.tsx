import {useBombTimer} from "./Countdown";
import {Bomb as BombIcon, Defuse} from "../../assets/Icons.tsx";
import {useEffect, useState} from "react";

const Bomb = () => {
    const bombData = useBombTimer();
    const [plantWidth, setPlantWidth] = useState(0);
    const [defuseWidth, setDefuseWidth] = useState(0);

    useEffect(() => {
        let plantInterval: NodeJS.Timeout, defuseInterval: NodeJS.Timeout;

        if (bombData.state === "planting" && plantWidth < 100) {
            plantInterval = setInterval(() => {
                setPlantWidth((prev) => {
                    const newWidth = prev + 2.5; // 100% за 4 секунды (100 / 40 = 2.5)
                    return Math.min(newWidth, 100);
                });
            }, 100); // 4 секунды = 4000 мс / 40 итераций по 100 мс
        } else if (bombData.state === "defusing" && defuseWidth < 100) {
            const increment = bombData.player?.state.defusekit ? 2 : 1; // 100% за 5 секунд (100 / 50 = 2) или 10 секунд (100 / 100 = 1)
            defuseInterval = setInterval(() => {
                setDefuseWidth((prev) => {
                    const newWidth = prev + increment;
                    return Math.min(newWidth, 100);
                });
            }, 100); // 5-10 секунд = 5000-10000 мс / 100 итераций по 100 мс
        }

        return () => {
            clearInterval(defuseInterval);
            clearInterval(plantInterval);
        };
    }, [bombData.state, bombData.player?.state.defusekit, plantWidth, defuseWidth]);

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
