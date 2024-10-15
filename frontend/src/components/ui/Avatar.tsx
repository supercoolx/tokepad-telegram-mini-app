import Link from "../Link"
import Image from "./Image"

interface AvatarProps {
    userid?: number
    width: number
    height: number
    className?: string
    username?: String
}

const Avatar = ({ userid, width, className, height, username }: AvatarProps) => {
    return (
        <div className="relative">
            { username ?
            <Link to={`https://t.me/${username}`}><Image className={`rounded-full ${ className }`} src={`/api/v1/users/avatar/${userid}`}  alt="avatar" width={width} height={height} loading="lazy" /></Link> :
            <Image className="rounded-full" src={`/api/v1/users/avatar/${userid}`}  alt="avatar" width={width} height={height} loading="lazy" /> }
        </div>
    );
}

export default Avatar;