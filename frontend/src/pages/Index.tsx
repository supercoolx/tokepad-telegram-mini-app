import { useEffect, useState } from "react";
import API from "@/libs/API";
import { useInitData } from "@telegram-apps/sdk-react";

import Image from "@/components/ui/Image";
import TapEffect, { TapEffectProps } from "@/components/ui/TapEffect";

const Home = () => {
    const user = useInitData()!.user!;
    const [point, setPoint] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [earnPerTap, setEarnPerTap] = useState(1);
    const [loseEnergyPerTap, setLoseEnergyPerTap] = useState(1);
    const [addEnergyPerSecond, setAddEnergyPerSecond] = useState(1);
    const [earnPerSecond, setEarnPerSecond] = useState(0);
    const [maxEnergy, setMaxEnergy] = useState(500);

    const [effects, setEffects] = useState<TapEffectProps[]>([]);
    
    useEffect(() => {
        API.get(`/users/get/${user.id}`).then(res => {
            setPoint(res.data.point);
            setEnergy(res.data.energy);
            setMaxEnergy(res.data.maxEnergy);
            setLoseEnergyPerTap(res.data.loseEnergyPerTap);
            setAddEnergyPerSecond(res.data.addEnergyPerSecond);
            setEarnPerTap(res.data.earnPerTap);
        }).catch(console.error);

        API.get('/users/boost/getmy/' + user.id).then(res => {
            if (res.data.success) {
                const boost = res.data.boosts.reduce((acc: number, boost: any) => acc + boost.item.bonus, 0);
                setEarnPerSecond(boost);
            }
        }).catch(console.error);
    }, [user]);

    useEffect(() => {
        const id = setInterval(setEnergy, 1000, prev => Math.min(prev + addEnergyPerSecond, maxEnergy));
        return () => clearInterval(id);
    }, [maxEnergy, addEnergyPerSecond]);

    useEffect(() => {
        const id = setInterval(setPoint, 1000, prev => prev + earnPerSecond);
        return () => clearInterval(id);
    }, [earnPerSecond]);

    const handleTap = (e: MouseEvent) => {
        e.preventDefault();
        if (energy < loseEnergyPerTap) return;

        const { pageX, pageY } = e;
        const newTapEffect: TapEffectProps = {
            id: Date.now(),
            left: pageX,
            top: pageY,
            text: '+' + earnPerTap
        };
        // Add the new +1 to the state array
        setEffects((prev) => [...prev, newTapEffect]);
        // Remove the +1 after 1 second
        setTimeout(() => {
            setEffects((prevPlusOnes) =>
                prevPlusOnes.filter((plusOne) => plusOne.id !== newTapEffect.id)
            );
        }, 1000); // 1 second animation time
        
        API.put('/users/tap', {userid: user.id});
        setPoint(prev => prev + earnPerTap);
        setEnergy(prev => prev - loseEnergyPerTap);
    }

    return (
        <div className="flex flex-col justify-between w-screen h-screen pb-24">
            <div className="mt-10">
                <div className="flex items-center justify-center gap-2">
                    <Image src="/imgs/icons/coin.png" width={30} height={30} />
                    <span className="text-3xl font-bold">{ point.toLocaleString() }</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-3 cursor-pointer">
                    <Image src="/imgs/icons/cup.png" width={16} height={16} />
                    <span className="text-sm font-bold text-white/50">Bronze</span>
                    <Image src="/imgs/icons/arrow.png" width={10} height={10} />
                </div>
            </div>
            <div className="relative flex items-center justify-center flex-1">
                <Image onClick={handleTap} className={`transition-all duration-200 ${energy > loseEnergyPerTap ? 'cursor-pointer' : 'cursor-not-allowed' } hover:scale-110 active:scale-100`} src="/imgs/pages/coin.png" width={200} height={200} />
                <div className="-z-10 h-[200px] w-[500px] absolute -translate-x-1/2 rotate-45 origin-right bg-gradient-to-b from-transparent via-yellow-300/50 to-transparent"></div>
            </div>
            <div className="">
                <div className="flex justify-center gap-1">
                    <Image src="/imgs/icons/energy.png" width={20} height={20} />
                    <div className="text-sm font-bold">{ energy }<span className="text-[10px] font-light">/ { maxEnergy }</span></div>
                </div>
                <div className="p-1 mx-3 mt-1 rounded-full bg-white/20">
                    <div style={{ width: energy / maxEnergy * 100 + '%' }} className="h-1.5 bg-orange-400 rounded-full transition-all duration-200" />
                </div>
            </div>
            { effects.map(effect => <TapEffect key={effect.id} left={effect.left} top={effect.top} text={effect.text} />) }
        </div>
    )
}

export default Home;