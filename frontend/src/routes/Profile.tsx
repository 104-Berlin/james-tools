import { useEffect, useState } from "react"
import { getCurrentUser, User } from "../api/User";


export default function Profile() {
    let [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getCurrentUser().then((res) => {
            console.log(res.data);
            setUser(res.data);
        })
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.username}!</h1>
                    <h2>Your email is {user.email}</h2>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    )
}