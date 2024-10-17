import { useState, useEffect } from "react";
import Image from "@/components/ui/Image";
import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import { LINK } from "@/libs/constants";
import API from "@/libs/API";
import Avatar from "@/components/ui/Avatar";
import { toast } from "react-toastify";

const Ref = () => {
    const user = useInitData()!.user!;
    const utils = useUtils();
    const [friends, setFriends] = useState<any[]>([]);
    const [point, setPoint] = useState(0);

    const handleClickInviteLink = () => {
        const link = LINK.TELEGRAM_MINIAPP + '?start=' + user.id;
        const shareText = 'Join our Boredem Legend Club.';
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
        utils.openTelegramLink(fullUrl);
    }

    const handleClickCopyButton = () => {
        const link = LINK.TELEGRAM_MINIAPP + '?start=' + user.id;
        const shareText = 'Join our Boredem Legend Club.';
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
        navigator.clipboard.writeText(fullUrl).then(() => toast.success('Invite link copied.'));
    }

    useEffect(() => {
        API.get('/users/friends/' + user.id)
            .then(res => {
                setFriends(res.data.friends);
            }).catch(err => console.error(err.message));
        API.get(`/users/get/${user.id}`)
            .then(res => {
                setPoint(res.data.point);
            })
    }, [user]);

    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/ref.jpg" className="w-screen" height={128} />
                <div className="absolute bottom-0 text-5xl font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white'}}>Invite Friends</div>
            </div>
            <div className="px-8 mt-10 text-xs text-center">Share the fun! Invite your friends to join and enjoy exclusive rewards together. Click the link and let the adventures begin!</div>
            <div className="flex items-center justify-center gap-3 mt-5">
                <Image src="/imgs/icons/coin.png" width={80} height={80} />
                <div className="">
                    <div className="text-sm">Your point</div>
                    <div className="text-3xl font-bold text-yellow-400">{ point.toLocaleString() }</div>
                </div>
            </div>
            <div className="flex justify-between gap-3 px-10 mt-5">
                <button onClick={handleClickInviteLink} className="flex-1 h-10 font-bold transition-all duration-200 border rounded-lg hover:-translate-y-1 active:translate-y-0 border-white/20 bg-white/20">Invite</button>
                <button onClick={handleClickCopyButton} className="flex items-center justify-center w-10 h-10 transition-all duration-200 border rounded-lg hover:-translate-y-1 active:translate-y-0 border-white/20 bg-white/20">
                    <Image src="/imgs/icons/copy-icon.svg" width={20} height={20} />
                </button>
            </div>
            <div className="px-5 mt-8">
                <div className="text-xl">Your friends</div>
                <div className="flex flex-col flex-1 px-3 py-5 mt-3 font-bold border divide-y rounded-lg divide-white/50 border-white/20 bg-white/20 max-h-[300px] overflow-y-auto">
                    { friends.map((friend, index) => <div key={index} className="flex items-center gap-2 py-2">
                        <Avatar userid={friend.userid} username={friend.username} width={40} height={40} />
                        <div className="flex items-center justify-between flex-1">
                            <div className="">
                                <div className="text-sm font-bold">{ friend.firstname }</div>
                                <div className="text-[12px]">{ friend.point }</div>
                            </div>
                            <div className="text-sm"></div>
                        </div>
                    </div>) }
                    { friends.length === 0 && <div className="text-center">You don't have friend.</div> }
                </div>
            </div>
        </div>
    )
}

export default Ref;