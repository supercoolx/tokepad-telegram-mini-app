import { useState, useEffect } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';
import { useTonWallet, useTonConnectUI, CHAIN } from '@tonconnect/ui-react';
import { toast } from 'react-toastify';


import API from '@/libs/API';
import { OWNER_ADDRESS, IS_MAINNET } from "@/libs/constants";
import Image from "@/components/ui/Image"

const Boost = () => {
    const user = useInitData()!.user!;
    const wallet = useTonWallet();
    const [tonConnectUI, ] = useTonConnectUI();

    const [items, setItems] = useState<any[]>([]);
    const [myItems, setMyItems] = useState<any[]>([]);

    const [tab, setTab] = useState<'new' | 'my'>('new');

    useEffect(() => {
        API.get('/users/boost/getall').then(res => {
            setItems(res.data.boosts);
        }).catch(err => {
            toast.error('Something went wrong.');
            setItems([]);
            console.error(err);
        });
        API.get('/users/boost/getmy/' + user.id).then(res => {
            if (res.data.success) {
                setMyItems(res.data.boosts);
            }
        }).catch(err => {
            toast.error('Something went wrong.');
            console.error(err);
        });
    }, []);

    useEffect(() => {
        if (!wallet) return;
        if (IS_MAINNET && tonConnectUI?.wallet?.account.chain !== CHAIN.MAINNET) {
            toast.error("Connect your mainnet wallet!");
        }
        if (!IS_MAINNET && tonConnectUI?.wallet?.account.chain === CHAIN.MAINNET) {
            toast.error("Connect your testnet wallet!");
        }
    }, [wallet]);

    const handleConnectWallet = () => {
        if (wallet) tonConnectUI.disconnect();
        else tonConnectUI.openModal();
    }

    const handlePayment = (item: any) => {
        if (!wallet) return toast.error("Connect your wallet!");
        if (IS_MAINNET && tonConnectUI?.wallet?.account.chain !== CHAIN.MAINNET) {
            return toast.error("Connect your mainnet wallet!");
        }
        if (!IS_MAINNET && tonConnectUI?.wallet?.account.chain === CHAIN.MAINNET) {
            return toast.error("Connect your testnet wallet!");
        }

        const amount = (item.price * Math.pow(10, 9)).toString();
        tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            network: IS_MAINNET ? CHAIN.MAINNET : CHAIN.TESTNET,
            messages: [
                {
                    address: OWNER_ADDRESS,
                    amount: amount,
                }
            ]
        }).then(tx => {
            console.log('Transaction success:', tx);
            return API.post('/users/boost/purchase', { userid: user.id, boostid: item._id, tx });
        }).then(res => {
            if (res.data.success) {
                setMyItems(prev => [...prev, { item, level: 1 }]);
                setTab('my');
                toast.success(res.data.msg);
            } else {
                toast.error(res.data.msg);
            }
        }).catch(err => {
            toast.error('Something went wrong.');
            console.error(err);
        });
    }

    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <button onClick={handleConnectWallet} className="absolute top-3 right-3 z-10 px-2 h-[30px] flex items-center justify-center gap-1 rounded-lg bg-slate-800 text-sm shadow-md hover:scale-110 transition-all duration-200">{ wallet ? wallet.account.address?.slice(0, 5) + '...' + wallet.account.address?.slice(-5) : 'Connect Wallet' }</button>
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/boost.jpg" className="w-screen" height={128} />
                <div className="absolute bottom-0 text-[42px] font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white' }}>Boost legends</div>
            </div>
            <div className="px-8 mt-10 text-xs text-center">Boost your tap and enjoy more rewards instantly!</div>
            <div className="grid grid-cols-2 gap-2 mx-5 mt-6">
                <button disabled={tab === 'new'} onClick={() => setTab('new')} className="py-1 transition-all duration-200 bg-transparent border rounded-l-full disabled:bg-yellow-500 hover:bg-yellow-500 disabled:translate-y-1 disabled:cursor-not-allowed border-white/50">New Boost</button>
                <button disabled={tab === 'my'} onClick={() => setTab('my')} className="py-1 transition-all duration-200 bg-transparent border rounded-r-full disabled:bg-yellow-500 hover:bg-yellow-500 disabled:translate-y-1 disabled:cursor-not-allowed border-white/50">My Boost</button>
            </div>
            <div className={`flex flex-col gap-3 mt-5 ${ tab === 'new' ? '' : 'hidden'}`}>
                {items.map((item, index) => <div key={index} className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800">
                        <Image src="/imgs/icons/energy.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">{ item.description }</span>
                            </div>
                        </div>
                        <button onClick={() => handlePayment(item)} className="w-[100px] h-[30px] flex items-center justify-center gap-1 rounded-lg bg-slate-800 text-sm shadow-md hover:scale-110 transition-all duration-200">
                            <Image src="/imgs/icons/ton.png" width={12} height={12} />
                            <span>{item.price}</span>
                        </button>
                    </div>
                </div>)}
            </div>
            <div className={`flex flex-col gap-3 mt-5 ${ tab === 'my' ? '' : 'hidden'}`}>
                {myItems.map((item, index) => <div key={index} className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800">
                        <Image src="/imgs/icons/energy.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">{item.item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">{ item.item.description }</span>
                            </div>
                        </div>
                        <div className="">{item.level} <small>level</small></div>
                        {/* <button onClick={() => handlePayment(item)} className="w-[100px] h-[30px] flex items-center justify-center gap-1 rounded-lg bg-slate-800 text-sm shadow-md hover:scale-110 transition-all duration-200">
                            <Image src="/imgs/icons/ton.png" width={12} height={12} />
                            <span>{item.item.price}</span>
                        </button> */}
                    </div>
                </div>)}
                {myItems.length === 0 && <div className="mt-10 text-center">You didn't boosted yet!</div> }
            </div>
        </div>
    )
}

export default Boost;