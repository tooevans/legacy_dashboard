"use server"

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema"
import { clerkClient } from "@clerk/nextjs/server"
import { success } from "zod";

export async function createNewPatient(data: any, pid: string) {
    try {
        const validateData = PatientFormSchema.safeParse(data);

        if (!validateData.success) {
            return {
                success: false,
                error: true,
                msg: "Provide all required fields."
            };
        }

        const patientData = validateData.data
        let patient_id = pid

        if(pid === "new-patient") {
            const client = await clerkClient()

            const user = await client.users.createUser({
                emailAddress: [patientData.email],
                password: patientData.phone,
                firstName: patientData.first_name,
                lastName: patientData.last_name,
                publicMetadata: { role: "patient" },
            });

            patient_id = user?.id
        } else {

            const client = await clerkClient()

            await client.users.updateUser(pid, {
                publicMetadata: { role: "patient" },
            });
        }

        await db.patient.create({
            data: {
                ...patientData,
                id: patient_id,
            },
        });

        return { success: true, error: false, msg: "Patient created successfully" };
    } catch (error: any) {
        console.error(error)
        return { success: false, error: true, msg: error?.message }
    }
}

export async function updatePatient(data: any, pid: string) {
    try {
        const validateData = PatientFormSchema.safeParse(data);

        if (!validateData.success) {
            return {
                success: false,
                error: true,
                msg: "Provide all required fields."
            };
        }

        const patientData = validateData.data

       
        const client = await clerkClient()

        await client.users.updateUser(pid, {
            firstName: patientData.first_name,
            lastName: patientData.last_name,
        });

        await db.patient.update({
            data: {
                ...patientData,
            },
            where: { id: pid }
        });

        return { success: true, error: false, msg: "Patient updated successfully" };
    } catch (error: any) {
        console.error(error)
        return { success: false, error: true, msg: error?.message }
    }
}