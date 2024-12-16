import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import ProfileOptions from './ProfileOptions'; // Import the ProfileOptions component

type PopAvatarProps = {
    url: string; // Define the url prop type
};

const PopAvatar: React.FC<PopAvatarProps> = ({ url }) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Avatar>
                    <AvatarImage src={url} alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback> {/* Use a fallback if the image doesn't load */}
                </Avatar>
            </PopoverTrigger>
            <PopoverContent>
                <ProfileOptions /> {/* Display the ProfileOptions inside the popover */}
            </PopoverContent>
        </Popover>
    );
};

export default PopAvatar;
