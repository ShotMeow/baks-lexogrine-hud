import CameraContainer from "../Camera/Container";
import PlayerCamera from "./../Camera/Camera";

import CTAvatar from "../../assets/avatars/ct.png";
import TAvatar from "../../assets/avatars/t.png";

interface IProps {
    steamid: string;
    url: string | null;
    slot?: number;
    height?: number;
    width?: number;
    showSkull?: boolean;
    showCam?: boolean;
    sidePlayer?: boolean;
    teamId?: string | null;
    side: "T" | "CT";
}

const Avatar = ({
                    steamid,
                    url,
                    height,
                    width,
                    showCam,
                    sidePlayer,
                    side,
                }: IProps) => {

    return (
        <div className="avatar">
            {showCam ? (
                sidePlayer ? (
                    <div className="videofeed">
                        <PlayerCamera steamid={steamid} visible={true}/>
                    </div>
                ) : (
                    <CameraContainer observedSteamid={steamid}/>
                )
            ) : null}
            <img className={`no-avatar`} src={url ? url : side === "CT" ? CTAvatar : TAvatar}
                 height={height} width={width} alt={"Avatar"}/>
        </div>
    );
};
export default Avatar;
