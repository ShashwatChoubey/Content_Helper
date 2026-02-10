"use server";

import bcrypt from "bcryptjs";
import { error } from "console";
import { success } from "zod/v4";
import type { SignUpFormValues } from "~/schema/auth";
import { signUpSchema } from "~/schema/auth";
import { db } from "~/server/db"

export async function signUp(data: SignUpFormValues) {
    try {
        const validateData = await signUpSchema.parseAsync(data);

        const existingUser = await db.user.findUnique({
            where: { email: validateData.email },
        })

        if (existingUser) {
            return { error: "Email already in use" }
        }

        const hashedPassword = await bcrypt.hash(validateData.password, 10);

        await db.user.create({
            data: {
                email: validateData.email,
                password: hashedPassword
            }
        })

        return { success: "Account created succesfully" }

    } catch (error: any) {
        if (
            error?.name === "ZodError" &&
            Array.isArray(error?.errors) &&
            error.errors.lenght > 0
        ) {
            return { error: error.errors[0].mesaage }
        }

        return { error: "Something went wrong.Please try again" }
    }


}