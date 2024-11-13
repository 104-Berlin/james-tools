import { useEffect, useState } from "react"
import { getCurrentUser, updateCurrentUser, User } from "../api/User";
import axios from "axios";
import { FileInput, Label } from "flowbite-react";
import EditField from "../components/EditField";


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
            console.log("Current user: ", res);
            setUser(res.data);
        });
    }, []);

    return (
        <div>
            {user ? (
                <div className="flex p-4 flex-col items-center">
                    <div className="max-w-md space-y-4 p-8 rounded-lg border-2">
                        <h1>Welcome, {user.username}!</h1>
                        <h2>Your email is {user.email}</h2>
                        <EditField value={user.firstName} onChange={(value) => {
                            updateCurrentUser({ firstName: value }).then(() => {
                                setUser({ ...user, firstName: value } as User);
                            });
                        }} />
                        <EditField value={user.lastName} onChange={(value) => {
                            updateCurrentUser({ lastName: value }).then(() => {
                                setUser({ ...user, lastName: value } as User);
                            });
                        }} />
                        <img src={user.profilePicture ?? "empty_pp.webp"} className="aspect-square w-full object-cover" />

                        <div className="flex w-full items-center justify-center">
                            <Label
                                htmlFor="dropzone-file"
                                className="flex h-8 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                Edit
                                <FileInput id="dropzone-file" onChange={handleImageChange} className="hidden" />
                            </Label>
                        </div>

                        <div className="flex w-full items-center justify-center">
                            <Label
                                htmlFor="camera-file"
                                className="flex h-8 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                Camera
                                <input id="camera-file" type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                            </Label>
                        </div>
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    )
}
