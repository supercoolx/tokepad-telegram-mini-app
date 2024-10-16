import { useState, useEffect } from "react";
import { useInitData } from "@telegram-apps/sdk-react";
import { CountUp } from "@eeacms/countup";

import API from '@/libs/API';
import Avatar from "@/components/ui/Avatar";
import Image from "@/components/ui/Image";

const Leaderboard = () => {
    const user = useInitData()!.user!;

    const [users, setUsers] = useState<any[]>([]);
    const [type, setType] = useState("total");
    const [selfRank, setSelfRank] = useState(-1);
    const [self, setSelf] = useState<any>();

    const [userCount, setUserCount] = useState(0);
    const [isCounting, setCounting] = useState(false);

    useEffect(() => {
        API.get('/users/count/all')
            .then(res => {
                setUserCount(res.data.count);
                setCounting(true);
            })
            .catch(console.error);
    }, []);
    useEffect(() => {
        API.get(`/users/ranking/${user.id}/${type}`)
            .then(res => {
                setUsers(res.data.users);
                setSelfRank(res.data.rank);
                setSelf(res.data.self);
            }).catch(console.error);
    }, [type])

    const handleClickType = (type: "week" | "total") => () => {
        setType(type);
    }

    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/wallet.jpg" />
                <div className="absolute bottom-0 text-[42px] font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white' }}>Leaderboard</div>
            </div>
            { self && <div className="flex justify-center gap-2 mt-10">
                <div className="w-24 py-2 text-center rounded-lg bg-white/20 border-white/20">
                    <div className="text-xs">Your point</div>
                    <div className="text-sm">{self.point.toString.toLocalestring()}</div>
                </div>
                <div className="w-24 py-2 text-center rounded-lg bg-white/20 border-white/20">
                    <div className="text-xs">Your rank</div>
                    <div className="text-sm">-123-</div>
                </div>
            </div> }
            <div className="flex flex-col px-3 mt-10">
                {users.map((user, index) => <div key={index} className="flex items-center gap-2 py-2">
                    <Avatar userid={user.userid} username={user.username} width={40} height={40} />
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="text-sm font-bold">{user.firstname}</div>
                            <div className="text-[12px]">{user.point}</div>
                        </div>
                        <div className="text-sm"></div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Leaderboard;