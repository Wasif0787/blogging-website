import React from 'react';
import { User } from '../app/types/user';
import { updateUser } from '../app/utils/userDatabase';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UserTableProps {
    users: User[] | null;
    onUpdate: () => void;
    canEditStatus: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onUpdate, canEditStatus }) => {
    const router = useRouter();

    if (!users || users.length === 0) {
        return <div className="text-gray-500">No users available.</div>;
    }

    const handleStatusChange = async (user: User, newStatus: string) => {
        if (!canEditStatus) return;

        const updatedUser = { ...user, status: newStatus };
        const { error } = await updateUser(updatedUser);

        if (error) {
            console.error("Error updating user status:", error);
            toast.error("Error updating user status");
        } else {
            onUpdate();
            toast.success("User status updated successfully");
        }
    };

    return (
        <div className="p-4 overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg shadow-md bg-white text-nowrap   ">
                <thead>
                    <tr className="bg-green-50 text-gray-700">
                        <th className="px-4 py-2 font-semibold text-left">Name</th>
                        <th className="px-4 py-2 font-semibold text-left">Bio</th>
                        <th className="px-4 py-2 font-semibold text-left">Email</th>
                        <th className="px-4 py-2 font-semibold text-left">Type</th>
                        <th className="px-4 py-2 font-semibold text-left">Profile Picture</th>
                        <th className="px-4 py-2 font-semibold text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr
                            key={user.id}
                            className={`${user.status === "approved" ? "bg-green-100 hover:bg-green-200" :
                                user.status === "pending" ? "bg-yellow-100 hover:bg-yellow-200" :
                                    "bg-red-100 hover:bg-red-200"}`}
                        >
                            <td
                                className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                                onClick={() => router.push(`author/${user.id}`)}
                            >
                                {user.name}
                            </td>
                            <td className="px-4 py-2">{user.bio || 'No bio available'}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.type}</td>
                            <td className="px-4 py-2">
                                {user.profile_pic ? (
                                    <img
                                        src={user.profile_pic}
                                        alt={`${user.name}'s profile`}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">No picture</span>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {canEditStatus ? (
                                    <select
                                        value={user.status}
                                        onChange={(e) => handleStatusChange(user, e.target.value)}
                                        className="form-select min-w-28 max-w-32 px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                ) : (
                                    <span>{user.status}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Toaster />
        </div>
    );
};

export default UserTable;
