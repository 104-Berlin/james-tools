import { useEffect, useState } from "react"
import { getCurrentUser, User } from "../api/User";
import axios from "axios";


export default function Profile() {
    let [user, setUser] = useState<User | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log("Uploading image...");
            let image = e.target.files[0];
            const formData = new FormData();
            formData.append('profileImage', image);

            axios.post('/api/user/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                const imageUrl = res.data as string;
                // Update user profile with new image URL
                setUser({ ...user, profilePicture: imageUrl } as User);
                window.location.reload();
            });
        }
    };

    useEffect(() => {
        getCurrentUser().then((res) => {
            setUser(res.data);
        });
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <div>
                        <img src={user.profilePicture} alt="avatar" style={{ width: "100px", height: "100px" }} />
                        <input type="file" onChange={handleImageChange} />
                    </div>

                    <h1>Welcome, {user.username}!</h1>
                    <h2>Your email is {user.email}</h2>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    )
}