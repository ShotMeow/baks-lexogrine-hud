import CameraContainer from "../Camera/Container";
import PlayerCamera from "./../Camera/Camera";

import { useConfig } from "../../API/contexts/actions";
import { apiUrl } from "../../API";

import CTAvatar from "../../assets/avatars/ct.png";
import TAvatar from "../../assets/avatars/t.png";
import bg from "../../assets/bg.png";

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
  teamId,
  side,
}: IProps) => {
  const data = useConfig("display_settings");

  const avatarUrl =
    teamId &&
    (data?.replace_avatars === "always" ||
      (data?.replace_avatars === "if_missing" && !url))
      ? `${apiUrl}api/teams/logo/${teamId}`
      : url;
  return (
    <div className="avatar">
      {showCam ? (
        sidePlayer ? (
          <div className="videofeed">
            <PlayerCamera steamid={steamid} visible={true} />
          </div>
        ) : (
          <CameraContainer observedSteamid={steamid} />
        )
      ) : null}
      {avatarUrl ? (
        <img className="no-avatar" src={bg} height={height} width={width} alt={"Avatar"} />
      ) : side === "CT" ? (
        <img
          className="no-avatar"
          src={CTAvatar}
          height={height}
          width={width}
          alt={"Avatar"}
        />
      ) : (
        <img
          className="no-avatar"
          src={TAvatar}
          height={height}
          width={width}
          alt={"Avatar"}
        />
      )}
    </div>
  );
};
export default Avatar;
