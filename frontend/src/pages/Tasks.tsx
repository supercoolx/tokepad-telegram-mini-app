import { useState, useEffect, Fragment } from "react";
import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import { useTonWallet, useTonConnectModal } from '@tonconnect/ui-react';
import { Modal, Placeholder, Button } from '@telegram-apps/telegram-ui';
import Countdown from 'react-countdown';
import { toast } from "react-toastify";

import API from "@/libs/API";
import { LINK, PLATFORM } from "@/libs/constants";
import Image from "@/components/ui/Image";

const Task = () => {
    const user = useInitData()!.user!;
    const utils = useUtils();
    const wallet = useTonWallet();
    const { open } = useTonConnectModal();

    const [isConnectedWallet, setConnectedWallet] = useState(false);
    const [isFollowingX, setFollowingX] = useState(false);
    const [isJoinedTelegramChannel, setJoinedTelegramChannel] = useState(false);
    const [isVisitedWebsite, setVisitedWebsite] = useState(false);
    const [dailyRemainSecond, setDailyRemainSecond] = useState(0);

    const [openVisitWebsiteModal, setOpenVisitWebsiteModal] = useState(false);
    const [openJoinTGModal, setOpenJoinTGModal] = useState(false);
    const [openFollowXModal, setOpenFollowXModal] = useState(false);

    useEffect(() => {
        API.get(`/users/get/${user.id}`).then(res => {
            setFollowingX(res.data.xFollowed);
            setJoinedTelegramChannel(res.data.telegramChannelJoined);
            setVisitedWebsite(res.data.visitWebSite);
            setConnectedWallet(res.data.walletConnected);
        }).catch(console.error);
        handleClaimDailyReward();
    }, [user]);

    const handleConnectWallet = () => {
        if (isConnectedWallet) return;
        if (wallet) {
            API.post(`/users/connect_wallet`, { userid: user.id }).then(res => {
                if (res.data.success) {
                    setConnectedWallet(true);
                    toast.success(res.data.msg);
                } else toast.error(res.data.msg);
            }).catch(console.error)
        } else {
            open();
        }
    }

    const handleClaimDailyReward = (status = 0) => {
        API.post(`/users/claim/daily`, { userid: user.id, status }).then(res => {
            if (res.data.success) {
                setDailyRemainSecond(res.data.ms);
                if (res.data.status == 'success') {
                    toast('Claimed successfully.');
                }
            } else {
                toast.error(res.data.msg);
            }
        }).catch(console.error);
    }

    const handleTGChannelLink = () => {
        utils.openTelegramLink(LINK.TELEGRAM_CHANNEL);
    }

    const handleWebsiteLink = () => {
        utils.openLink(LINK.WEBSITE);
    }

    const handleXLink = () => {
        API.post('/users/follow', { userid: user.id, platform: PLATFORM.X }).catch(console.error);
        utils.openLink(LINK.X);
    }

    const handleJoinTelegramChannel = () => {
        API.post('/users/jointg', {
            userid: user.id,
            type: 'channel'
        }).then(res => {
            if (res.data.success) {
                setJoinedTelegramChannel(true);
                setOpenJoinTGModal(false);
                toast(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    const handleFollowX = () => {
        API.post('/users/followx', { userid: user.id, username: user.username }).then(res => {
            if (res.data.success) {
                setFollowingX(true);
                setOpenFollowXModal(false);
                toast(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    const handleVisitWebsite = () => {
        API.post('/users/visit_website', { userid: user.id }).then(res => {
            if (res.data.success) {
                setVisitedWebsite(true);
                setOpenVisitWebsiteModal(false);
                toast(res.data.msg);
            }
            else toast.error(res.data.msg);
        }).catch(console.error);
    }

    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/task.jpg" />
                <div className="absolute bottom-0 text-[42px] font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white' }}>Earn more coins</div>
            </div>
            <div className="px-8 mt-10 text-xs text-center">Complete task and get coins instantly! Stay updated and stack up your rewards</div>
            <div className="flex flex-col gap-3 mt-10">
                <div className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                        <Image src="/imgs/icons/wallet.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">Connect wallet</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">+1000</span>
                            </div>
                        </div>
                        <button disabled={isConnectedWallet} onClick={handleConnectWallet} className="w-[100px] h-[30px] rounded-lg bg-yellow-500 text-sm shadow-md hover:scale-110 transition-all duration-200 disabled:bg-slate-800 disabled:shadow-none hover:disabled:scale-100 disabled:hover:cursor-not-allowed">{isConnectedWallet ? 'Connected' : (wallet ? 'Redeem' : 'Connect')}</button>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                        <Image src="/imgs/icons/x.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">Follow our X</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">+1000</span>
                            </div>
                        </div>
                        <button disabled={isFollowingX} onClick={() => setOpenFollowXModal(true)} className="w-[100px] h-[30px] rounded-lg bg-yellow-500 text-sm shadow-md hover:scale-110 transition-all duration-200 disabled:bg-slate-800 disabled:shadow-none hover:disabled:scale-100 disabled:hover:cursor-not-allowed">Follow</button>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                        <Image src="/imgs/icons/telegram.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">Join TG channel</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">+1000</span>
                            </div>
                        </div>
                        <button disabled={isJoinedTelegramChannel} onClick={() => setOpenJoinTGModal(true)} className="w-[100px] h-[30px] rounded-lg bg-yellow-500 text-sm shadow-md hover:scale-110 transition-all duration-200 disabled:bg-slate-800 disabled:shadow-none hover:disabled:scale-100 disabled:hover:cursor-not-allowed">Join</button>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                        <Image src="/imgs/icons/website.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">Visit Website</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">+1000</span>
                            </div>
                        </div>
                        <button disabled={isVisitedWebsite} onClick={() => setOpenVisitWebsiteModal(true)} className="w-[100px] h-[30px] rounded-lg bg-yellow-500 text-sm shadow-md hover:scale-110 transition-all duration-200 disabled:bg-slate-800 disabled:shadow-none hover:disabled:scale-100 disabled:hover:cursor-not-allowed">Visit</button>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                        <Image src="/imgs/icons/daily.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">Daily Reward</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">+1000</span>
                            </div>
                        </div>
                        <button disabled={dailyRemainSecond > 0} onClick={() => handleClaimDailyReward(1)} className="w-[100px] h-[30px] rounded-lg bg-yellow-500 text-sm shadow-md hover:scale-110 transition-all duration-200 disabled:bg-slate-800 disabled:shadow-none hover:disabled:scale-100 disabled:hover:cursor-not-allowed">
                            {dailyRemainSecond > 0 ?
                                <Countdown date={Date.now() + dailyRemainSecond} intervalDelay={1000} precision={3} onComplete={() => setDailyRemainSecond(0)} renderer={(props) => <span>{props.hours.toString().padStart(2, '0')} : {props.minutes.toString().padStart(2, '0')} : {props.seconds.toString().padStart(2, '0')}</span>} /> :
                                'Redeem'}
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                header={<Modal.Header />}
                open={openVisitWebsiteModal}
                onOpenChange={setOpenVisitWebsiteModal}
            >
                <Placeholder
                    header={<span className="text-yellow-400">Visit Website</span>}
                    action={
                        <Fragment>
                            <Button onClick={handleWebsiteLink} size="m" stretched>Visit</Button>
                            <Button onClick={handleVisitWebsite} size="m" stretched>Complete</Button>
                        </Fragment>
                    }
                />
            </Modal>
            <Modal
                header={<Modal.Header />}
                open={openJoinTGModal}
                onOpenChange={setOpenJoinTGModal}
            >
                <Placeholder
                    header={<span className="text-yellow-400">Join TG channel</span>}
                    action={
                        <Fragment>
                            <Button onClick={handleTGChannelLink} size="m" stretched>Join</Button>
                            <Button onClick={handleJoinTelegramChannel} size="m" stretched>Complete</Button>
                        </Fragment>
                    }
                />
            </Modal>
            <Modal
                header={<Modal.Header />}
                open={openFollowXModal}
                onOpenChange={setOpenFollowXModal}
            >
                <Placeholder
                    header={<span className="text-yellow-400">Follow our X</span>}
                    action={
                        <Fragment>
                            <Button onClick={handleXLink} size="m" stretched>Follow</Button>
                            <Button onClick={handleFollowX} size="m" stretched>Complete</Button>
                        </Fragment>
                    }
                />
            </Modal>
        </div>
    )
}

export default Task;