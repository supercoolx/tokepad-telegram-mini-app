import { useLayoutEffect, createContext, useContext } from "react";
import { useMiniApp, useInitData } from "@telegram-apps/sdk-react";

import API from "@/libs/API";

interface AppContextData {
}

const AppContext = createContext<AppContextData | null>(null);

const AppProvider = ({ children }: { children: JSX.Element }) => {
    const app = useMiniApp();
    const initData = useInitData();

    useLayoutEffect(() => {
        API.post('/auth/login', {
            userid: initData?.user?.id,
            username: initData?.user?.username,
            firstname: initData?.user?.firstName,
            lastname: initData?.user?.lastName,
            is_premium: initData?.user?.isPremium,
            inviter: initData?.startParam,
        }).then((res) => {
            localStorage.setItem('token', `Bearer ${res.data.token}`);
            console.log('User logined:', initData?.user?.username);
        })
        .catch(error => {
            console.error(error.message);
            app.close();
        });
    }, []);

    return (
        <AppContext.Provider value={{}}>
            {  children }
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext);
export default AppProvider;