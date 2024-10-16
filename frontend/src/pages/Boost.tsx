import { useState, useEffect } from 'react';
import { useInitData, useInvoice } from '@telegram-apps/sdk-react';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';


import API from '@/libs/API';
import Image from "@/components/ui/Image"

const Boost = () => {
    const user = useInitData()!.user!;
    const invoice = useInvoice();

    const [items, setItems] = useState<any[]>([]);
    // const [totalPrice, setTotalPrice] = useState({usersCount: 0, price: 0});
    const [purchasedItem, setPurchasedItem] = useState<any>();
    const [endTime, setEndTime] = useState(0);

    useEffect(() => {
        API.get('/play/boost/getall').then(res => {
            setItems(res.data.boosts);
        }).catch(err => {
            toast.error('Something went wrong.');
            setItems([]);
            console.error(err);
        });
        API.get('/play/boost/getmy/' + user.id).then(res => {
            if (res.data.success) {
                setPurchasedItem(res.data.boost.item);
                setEndTime(res.data.boost.endTime);
            }
            if (res.data.success || res.data.status == 'noboost') {
                // setTotalPrice(res.data.total);
            }
        }).catch(err => {
            toast.error('Something went wrong.');
            console.error(err);
        });
    }, []);

    const handlePayment = (item: any) => {
        API.post('/play/invoice', { userid: user.id, id: item._id })
            .then(res => {
                console.log(res.data);
                invoice.open(res.data.link, 'url').then(invoiceRes => {
                    console.log("invoice res=", invoiceRes);
                    if (invoiceRes === 'paid') {
                        setPurchasedItem(item);
                        setEndTime(Date.now() + item.period * 24 * 60 * 60 * 1000);
                    }
                    // setTotalPrice(prev => ({
                    //     usersCount: prev.usersCount + 1,
                    //     price: prev.price + item.price
                    // }));
                });
            }).catch(err => {
                console.error(err);
                toast.error(err.message);
            });
    }

    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/boost.jpg" />
                <div className="absolute bottom-0 text-[42px] font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white' }}>Boost legends</div>
            </div>
            <div className="px-8 mt-10 text-xs text-center">Boost your tap and enjoy more rewards instantly!</div>
            <div className="flex flex-col gap-3 mt-10">
                {items.map((item, index) => <div key={index} className="flex items-center gap-2 px-3 py-2 mx-3 border rounded-lg bg-slate-600 border-white/50 justi">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800">
                        <Image src="/imgs/icons/energy.png" width={20} height={20} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                        <div className="">
                            <div className="">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Image src="/imgs/icons/coin.png" width={12} height={12} />
                                <span className="text-[10px]">x{item.bonus} for {item.period} days</span>
                            </div>
                        </div>
                        {
                            purchasedItem ?
                                <button disabled={true} className="w-[100px] h-[30px] flex items-center justify-center gap-1 rounded-lg bg-slate-800 text-sm shadow-md hover:scale-110 transition-all duration-200">
                                    {purchasedItem._id === item._id ? <Countdown date={endTime} intervalDelay={1000} precision={3} onComplete={() => setPurchasedItem(null)} renderer={(props) => <span>{props.days ? props.days.toString() + 'd' : ''} {props.hours.toString()} : {props.minutes.toString().padStart(2, '0')} : {props.seconds.toString().padStart(2, '0')}</span>} /> : '---'}
                                </button> :
                                <button onClick={() => handlePayment(item)} className="w-[100px] h-[30px] flex items-center justify-center gap-1 rounded-lg bg-slate-800 text-sm shadow-md hover:scale-110 transition-all duration-200">
                                    <Image src="/imgs/icons/star.png" width={12} height={12} />
                                    <span>{item.price}</span>
                                </button>
                        }
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Boost;