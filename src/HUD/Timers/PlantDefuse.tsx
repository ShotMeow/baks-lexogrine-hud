import plantingVideo from "../../assets/videos/planting.webm";
import defusingVideo from "../../assets/videos/defusing.webm";
import {useBombTimer} from "./Countdown.ts";
import {useEffect, useRef} from "react";

const Bomb = () => {
    const platingRef = useRef<HTMLVideoElement>(null);
    const defuseRef = useRef<HTMLVideoElement>(null);

    const bombData = useBombTimer();

    useEffect(() => {
        if (defuseRef.current) {
            defuseRef.current.playbackRate = 0.1;
            defuseRef.current.play();
        }
        if (platingRef.current) {
            platingRef.current.playbackRate = 0.1;
            platingRef.current.play();
        }
    }, []);

    return bombData.state === "planting" ? (
        <div className="bomb-state">
            <video ref={platingRef} autoPlay muted loop>
                <source src={plantingVideo} type="video/webm"/>
            </video>
            <div>{bombData.player?.name} PLANTING THE BOMB</div>
        </div>
    ) : (
        bombData.state === "defusing" && (
            <div className="bomb-state">
                <video ref={defuseRef} autoPlay muted loop>
                    <source src={defusingVideo} type="video/webm"/>
                </video>
                <div>{bombData.player?.name} DEFUSING THE BOMB</div>
            </div>
        )
    )
}
export default Bomb;