import {useEffect, useState} from "react";

export default function useAuth():[any]{
    const [userInfo, setUserInfo] = useState(null);

    useEffect(()=> {
        const fetchFromLogin = async () => {

                const response = await fetch('/user-info')
            if (response.ok) {
                const rsp = await response.json()
                setUserInfo(rsp)
            }
            else{
                setUserInfo(null)
            }
        };
        fetchFromLogin()
    });
    return [userInfo]
}