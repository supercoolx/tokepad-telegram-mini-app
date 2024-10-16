import { useState, useEffect } from "react";
import { useInitData } from "@telegram-apps/sdk-react";
// import { CountUp } from "@eeacms/countup";

import API from '@/libs/API';
import Avatar from "@/components/ui/Avatar";
import Image from "@/components/ui/Image";

const Leaderboard = () => {
    const user = useInitData()!.user!;

    const [users, setUsers] = useState<any[]>([]);
    const [type,] = useState("total");
    const [selfRank, setSelfRank] = useState(-1);
    const [self, setSelf] = useState<any>();

    const [userCount, setUserCount] = useState(0);
    // const [isCounting, setCounting] = useState(false);

    useEffect(() => {
        API.get('/users/count/all')
            .then(res => {
                setUserCount(res.data.count);
                // setCounting(true);
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
    }, [type]);

    // const handleClickType = (type: "week" | "total") => () => {
    //     setType(type);
    // }

    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/wallet.jpg" />
                <div className="absolute bottom-0 text-[42px] font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white' }}>Leaderboard</div>
            </div>
            {self && <div className="flex justify-center gap-2 mt-10">
                <div className="w-24 py-2 text-center rounded-lg bg-white/20 border-white/20">
                    <div className="text-xs">Your point</div>
                    <div className="text-sm">{self.point.toLocaleString()}</div>
                </div>
                <div className="w-24 py-2 text-center rounded-lg bg-white/20 border-white/20">
                    <div className="text-xs">Your rank</div>
                    <div className="text-sm">{selfRank.toLocaleString()}</div>
                </div>
            </div>}
            <div className="flex items-end justify-center gap-2 mt-5 text-center">
                {/* <CountUp
                    end={userCount}
                    formatter={(val: number) => <span className="text-3xl font-bold leading-none text-yellow-500">{Math.floor(val).toLocaleString()}</span>}
                    isCounting={isCounting} duration={0.5}
                /> */}
                 <span className="text-3xl font-bold leading-none text-yellow-500">{ userCount.toLocaleString() }</span>
                <span className="text-sm">users</span>
            </div>
            <div className="flex flex-col px-5 mt-5 max-h-[calc(100vh-150px)] overflow-y-auto">
                {users[0] && <div className={`flex items-center gap-2 px-3 rounded-lg py-2 border ${users[0].userid === self.userid ? 'border-yellow-500' : 'border-transparent'}`}>
                    <Avatar userid={users[0].userid} username={users[0].username} width={40} height={40} />
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="text-sm font-bold max-w-[220px] overflow-hidden text-ellipsis">{users[0].firstname}</div>
                            <div className="text-[12px]">{users[0].point.toLocaleString()}</div>
                        </div>
                        <div className="">
                            <Image src="/imgs/icons/gold.png" width={20} height={20} />
                        </div>
                    </div>
                </div>}
                {
                    users[1] && <div className={`flex items-center gap-2 px-3 rounded-lg py-2 border ${users[1].userid === self.userid ? 'border-yellow-500' : 'border-transparent'}`}>
                        <Avatar userid={users[1].userid} username={users[1].username} width={40} height={40} />
                        <div className="flex items-center justify-between flex-1">
                            <div className="">
                                <div className="overflow-hidden text-sm font-bold text-ellipsis">{users[1].firstname}</div>
                                <div className="text-[12px]">{users[1].point.toLocaleString()}</div>
                            </div>
                            <div className="">
                                <Image src="/imgs/icons/silver.png" width={20} height={20} />
                            </div>
                        </div>
                    </div>
                }
                {
                    users[2] && <div className={`flex items-center gap-2 px-3 rounded-lg py-2 border ${users[2].userid === self.userid ? 'border-yellow-500' : 'border-transparent'}`}>
                        <Avatar userid={users[2].userid} username={users[2].username} width={40} height={40} />
                        <div className="flex items-center justify-between flex-1">
                            <div className="">
                                <div className="overflow-hidden text-sm font-bold text-ellipsis">{users[2].firstname}</div>
                                <div className="text-[12px]">{users[2].point.toLocaleString()}</div>
                            </div>
                            <div className="">
                                <Image src="/imgs/icons/bronze.png" width={20} height={20} />
                            </div>
                        </div>
                    </div>
                }
                {users.slice(3).map((user, index) => <div key={index} className={`flex items-center gap-2 px-3 rounded-lg py-2 border ${user.userid === self.userid ? 'border-yellow-500' : 'border-transparent'}`}>
                    <Avatar userid={user.userid} username={user.username} width={40} height={40} />
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="overflow-hidden text-sm font-bold text-ellipsis">{user.firstname}</div>
                            <div className="text-[12px]">{user.point.toLocaleString()}</div>
                        </div>
                        <div className="text-sm">#{index + 4}</div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Leaderboard;