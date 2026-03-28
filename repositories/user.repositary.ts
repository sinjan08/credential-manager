import { UserInterface } from "@/Interface/user.interface";
import User from "@/models/user.model";
import { CreateUserDTO } from "@/types/user.types";

/**
 * Upsert user by email
 * - Updates if exists
 * - Creates if not exists
 */
export const upsertUser = async (
    userData: CreateUserDTO
): Promise<UserInterface> => {
    try {
        // validating argument
        if (!userData || !userData.email) {
            throw new Error("Invalid user data: email is required");
        }

        const user = await User.findOneAndUpdate(
            {
                email: userData.email,
            },
            {
                $set: {
                    ...userData,
                    isDeleted: false,
                    deletedAt: null,
                },
            },
            {
                new: true,                  // return updated doc
                upsert: true,               // create if not exists
                runValidators: true,        // enforce schema validation
                setDefaultsOnInsert: true,  // apply default values on insert
            }
        );

        if (!user) {
            throw new Error("User upsert failed");
        }

        return user;
    } catch (error) {
        throw new Error("User upsert failed: " + error);
    }
};

/**
 * Login repo function
 * @param email
 */
export const loginUser = async (
    email: string
): Promise<UserInterface> => {
    try {
        // ✅ validation
        if (!email) {
            throw new Error("Invalid login data: email is required");
        }

        // ✅ find single user + include password
        const user = await User.findOne({ email, isDeleted: false, isVerified: true }).select("+password");

        // ✅ proper null check
        if (!user) {
            throw new Error("No user found for this email");
        }

        return user;
    } catch (error) {
        throw new Error("Failed to login: " + error);
    }
};


export const getUserById = async (id: string): Promise<UserInterface> => {
    try {
        if (!id) throw new Error("User id is missing");

        const user = await User.findById(id);
        if (!user) throw new Error("No user found");

        return user;
    } catch (error) {
        throw new Error("Failed to get user with id : " + id);
    }
}


export const addUser = async (data: CreateUserDTO): Promise<UserInterface> => {
    try {
        // validating input
        if (!data || !data.email) throw new Error("Invalid email is required");
        const user = await User.create(data);
        if (!user) throw new Error("Failed to create user");

        return user;
    } catch (error) {
        throw new Error("Failed to add user: " + error);
    }
}