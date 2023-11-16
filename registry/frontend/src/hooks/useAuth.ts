import {useEffect, useState} from "react";

export default function useAuth():[any]{
    const [userInfo, setUserInfo] = useState(null);

    useEffect(()=> {
        const fetchFromLogin = async () => {

                const response = await fetch('/userinfo')
            if (response.ok) {
                console.log('------------------')
                const rsp = await response.json()
                setUserInfo(rsp)
            }
            else{
                setUserInfo(null)
                console.log('----------00000000000--------')
            }
        };
        fetchFromLogin()
    });
    return [userInfo]
}