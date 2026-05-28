"use server"

import { ReviewFormValues } from "@/components/dialogs/review-form"
import db from "@/lib/db"
import { ReviewSchema } from "@/lib/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { success } from "zod"

export async function deleteDataById(
    id: string,
    deleteType: "doctor" | "staff" | "patient"
) {
    try {
        switch (deleteType) {
            case "doctor" :
                await db.doctor.delete({ where: { id: id } })
            
            case "staff" :
                await db.staff.delete({ where: { id: id } })

            case "patient" :
                await db.patient.delete({ where: { id: id } })
        }

        if (deleteType === "staff" || deleteType === "patient" || deleteType === "doctor" ) {
            const client = await clerkClient()
            await client.users.deleteUser(id)
        }

        return {
            success: true,
            status: 200,
            message: "Delete SUccessfully",
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Internal server error"
        }
    }
}

export async function createReview(values: ReviewFormValues) {
    try {
        const validatedFields = ReviewSchema.parse(values)

        await db.rating.create({
            data: {
                ...validatedFields,
            }
        })

        return {
            success: true,
            message: "Review created Successfully",
            status: 200,
        }
        
    } catch (error) {
        return {
            success: false,
            message: "Internal Server error",
            status: 500,
        }
    }
}