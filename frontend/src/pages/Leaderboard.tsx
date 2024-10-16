import { TonConnectButton } from "@tonconnect/ui-react";

import Image from "@/components/ui/Image";

const Leaderboard = () => {
    return (
        <div className="h-[calc(100vh-90px)] overflow-y-auto">
            <div className="relative flex items-end justify-center">
                <Image src="/imgs/pages/wallet.jpg" />
                <div className="absolute bottom-0 text-[42px] font-bold text-yellow-500 translate-y-1/2" style={{ WebkitTextStroke: '1px white' }}>Connet wallet</div>
            </div>
            <div className="flex justify-center mt-40">
                <TonConnectButton />
            </div>
        </div>
    )
}

export default Leaderboard;