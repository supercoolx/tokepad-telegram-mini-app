import { useLocation } from "react-router-dom";

import Link from "@/components/Link";

const Footer = () => {
    const { pathname } = useLocation();

    return (
        <div className="fixed w-[calc(100vw-24px)] left-3 bottom-3 flex justify-between">
            <Link to="/ref" className={`flex flex-col items-center justify-center w-16 h-16 gap-1 border rounded-md ${ pathname === '/ref' ? 'bg-blue-400/20' : 'bg-white/5 hover:bg-blue-400/20'} border-white/10 transition-all duration-300`}>
                <img src="/imgs/footer/ref.png" alt="" className="w-6 h-6" />
                <span className="text-xs">Ref</span>
            </Link>
            <Link to="/task" className={`flex flex-col items-center justify-center w-16 h-16 gap-1 border rounded-md ${ pathname === '/task' ? 'bg-blue-400/20' : 'bg-white/5 hover:bg-blue-400/20'} border-white/10 transition-all duration-300`}>
                <img src="/imgs/footer/task.png" alt="" className="w-6 h-6" />
                <span className="text-xs">Tasks</span>
            </Link>
            <Link to="/" className={`flex flex-col items-center justify-center w-16 h-16 gap-1 border rounded-md ${ pathname === '/' ? 'bg-blue-400/20' : 'bg-white/5 hover:bg-blue-400/20'} border-white/10 transition-all duration-300`}>
                <img src="/imgs/footer/tap.png" alt="" className="w-6 h-6" />
                <span className="text-xs">Tap</span>
            </Link>
            <Link to="/boost" className={`flex flex-col items-center justify-center w-16 h-16 gap-1 border rounded-md ${ pathname === '/boost' ? 'bg-blue-400/20' : 'bg-white/5 hover:bg-blue-400/20'} border-white/10 transition-all duration-300`}>
                <img src="/imgs/footer/boost.png" alt="" className="w-6 h-6" />
                <span className="text-xs">Boost</span>
            </Link>
            <Link to="/wallet" className={`flex flex-col items-center justify-center w-16 h-16 gap-1 border rounded-md ${ pathname === '/wallet' ? 'bg-blue-400/20' : 'bg-white/5 hover:bg-blue-400/20'} border-white/10 transition-all duration-300`}>
                <img src="/imgs/footer/wallet.png" alt="" className="w-6 h-6" />
                <span className="text-xs">Wallet</span>
            </Link>
        </div>
    )
}

export default Footer;