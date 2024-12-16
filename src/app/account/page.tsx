"use client"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useUserStore from "../hooks/useUserStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SkeletonCard from "../../components/SkeletonCard"
import { updateUser } from "../utils/userDatabase"
import toast, { Toaster } from "react-hot-toast"
import { uploadProfileImage } from "../utils/storage"
import { usePageTitle } from "../hooks/usePageTitle";
import Header from "../../components/Header";

const AccountPage = () => {
    usePageTitle("Medium: Account")
    const { user, loading, setUser } = useUserStore()
    const router = useRouter()

    // Form state
    const [name, setName] = useState(user?.name || "")
    const [bio, setBio] = useState(user?.bio || "")
    const [type, setType] = useState(user?.type || "reader")
    const [profile, setProfile] = useState(user?.profile_pic || "https://picsum.photos/200")
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [isValid, setIsValid] = useState(false)
    const [updating, setUpdating] = useState<boolean>(false)
    const [status, setStatus] = useState(user?.status || "approved")

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/home")
            } else {
                setIsValid(true)
                setName(user?.name)
                setBio(user?.bio || "")
                setType(user?.type)
                setProfile(user?.profile_pic || "https://picsum.photos/200")
                setStatus(user?.status)
            }
        }
    }, [user, loading, router])

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            if (!user) return;

            let avatarUrl = user.profile_pic; // Existing profile image URL

            // If a new image is selected, upload it
            if (profileImage) {
                const { publicUrl, error } = await uploadProfileImage(profileImage, user.auth_id); // Use utility function
                if (error) {
                    toast.error("Failed to upload image");
                    return;
                }

                // Update the avatarUrl with the new public URL
                if (publicUrl) {
                    avatarUrl = publicUrl; // Set avatarUrl to new image URL
                    setProfile(avatarUrl); // Update profile state with new image URL
                }
            }

            // Update status based on role change
            let updatedStatus = status
            if (type === "author" && user.type !== "author") {
                updatedStatus = "pending" // Set status to pending when changing to author
            } else if (type === "reader") {
                updatedStatus = "approved" // Set status to approved when reverting to reader
            }

            // Create the updated user object with the new avatarUrl
            const updatedUser = {
                ...user, // Spread in the current user data
                name, // Override with updated name
                bio,  // Override with updated bio
                type, // Override with updated role
                profile_pic: avatarUrl, // Use new avatar URL
                status: updatedStatus, // Override with updated status
            };

            // Call updateUser function with the updated user data
            const response = await updateUser(updatedUser);

            if (response.error) {
                console.error("Error updating user:", response.error);
                toast.error("Error updating user");
            } else {
                setUpdating(false);
                toast.success("Profile updated successfully");
                setUser(response.user); // Update the user in Zustand store after successful update
            }
        } catch (error) {
            console.log(error);
            toast.error("An unexpected error occurred while updating profile");
        }
    };

    if (loading || !isValid || updating) {
        return <div className="flex justify-center items-center"><SkeletonCard /></div>
    }

    return (
        <div className="h-screen">
            <Header />
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <Card className="w-full max-w-lg  shadow-lg rounded-xl overflow-hidden">
                    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 h-36">
                        {/* Avatar inside the card */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24">
                            <Avatar className="w-full h-full rounded-full shadow-lg">
                                <AvatarImage src={profile} alt="User Avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <CardHeader className="text-center mt-16">
                        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
                        <CardDescription className="text-gray-500">Status: {status}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="grid gap-4">
                                {/* Name Input */}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        className="rounded-lg"
                                    />
                                </div>

                                {/* Bio Input */}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Your Bio"
                                        className="rounded-lg"
                                    />
                                </div>

                                {/* Profile Picture Upload */}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="profileImage">Profile Picture</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="profileImage"
                                            type="file"
                                            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                                            className="rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Role Select (only for non-admins) */}
                                {user?.type !== "admin" && (
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="role">Type</Label>
                                        <Select
                                            value={type}
                                            onValueChange={(value) => {
                                                setType(value)
                                                setStatus(value === "author" ? "pending" : "approved")
                                            }}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>

                                            <SelectContent position="popper">
                                                <SelectItem value="reader">Reader</SelectItem>
                                                <SelectItem value="author">Author</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>

                    {/* Card Footer with Actions */}
                    <CardFooter className="flex justify-between p-4">
                        <Button variant="outline" className="rounded-lg" onClick={() => router.push("/home")}>
                            Cancel
                        </Button>
                        <Button className="bg-blue-500 text-white rounded-lg" onClick={handleUpdateProfile}>
                            Update
                        </Button>
                    </CardFooter>
                </Card>

                <Toaster />
            </div>
        </div>
    )
}

export default AccountPage
