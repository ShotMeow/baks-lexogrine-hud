import plantingVideo from "../../assets/videos/planting.webm";
import defusingVideo from "../../assets/videos/defusing.webm";
import {useBombTimer} from "./Countdown.ts";

const Bomb = () => {
    const bombData = useBombTimer();

    return bombData.state === "planting" ? (
        <div className="bomb-state">
            <video autoPlay muted loop>
                <source src={plantingVideo} type="video/webm"/>
            </video>
            <div>{bombData.player?.name} PLANTING THE BOMB</div>
        </div>
    ) : (
        bombData.state === "defusing" && (
            <div className="bomb-state">
                <video autoPlay muted loop>
                    <source src={defusingVideo} type="video/webm"/>
                </video>
                <div>{bombData.player?.name} DEFUSING THE BOMB</div>
            </div>
        )
    )
}
export default Bomb;