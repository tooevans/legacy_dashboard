"use server";

import { VitalSignsPatientData } from "@/components/dialogs/add-patient-vitals";
import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import db from "@/lib/db"
import { AppointmentStatus } from "@/lib/generated/prisma/client"
import { AppointmentSchema, VitalSignsSchema, VitalsPatientSchema } from "@/lib/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { success } from "zod";


export async function appointmentAction(
    id: string | number,
    status: AppointmentStatus,
    reason: string
) {
   
   try {
    const appointment = await db.appointment.updateMany({
        where: { 
            id: Number(id),
            NOT: {
                status: "COMPLETED",
            },
        },
        data: {
            status,
            reason,
        },
    })

    if (!appointment) {
        return {
            success: false,
            error: true,
            msg: "No appointment",
        }
    }

    if (appointment.count === 0) {
        return {
            success: false,
            error: true,
            msg: "Completed appointments cannot be modified."
        }
    }

    await db.appointment.update({
        where: { id: Number(id) },
        data: {
            status,
            reason,
        },
    });

    return {
        success: true,
        error: false,
        msg: `Appointment ${status.toLowerCase()} successfully`,
    }
   } catch (error) {
    console.log(error)
    return {success: false, msg: "Internal server error"}
   } 
}


export async function createNewAppointment(data: any) {
   try {

    const validatedData = AppointmentSchema.safeParse(data)

    if (!validatedData.success) {
        return { success: false, msg: "Invalid data" }
    }

    const validated = validatedData.data

    const appointmentDate = new Date(data.appointment_date)
    const today = new Date()
    

    today.setHours(0, 0, 0, 0)
    appointmentDate.setHours(0, 0, 0, 0)

    if (appointmentDate < today) {
        return {
            success:  false,
            message: "Date has passed",
        }
    }



    await db.appointment.create({
        data: {
            patient_id: data.patient_id,
            doctor_id: validated.doctor_id,
            time: validated.time,
            type: validated.type,
            appointment_date: new Date(validated.appointment_date),
            note: validated.note,
        },
    });

    return {
        success: true,
        message: "Booked successfully"
    }

   } catch (error) {
    console.log(error)
    return {success: false, msg: "Internal server error"}
   } 
}


export async function addVitalSigns(
    data: VitalSignsFormData,
    appointmentId: string,
    doctorId: string,
) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return { success: false, msg: "Unauthorized" }
        }

        const validatedData = VitalSignsSchema.parse(data)

        let medicalRecord = null

        if(!validatedData.medical_id) {
            medicalRecord = await db.medicalRecords.create({
                data: {
                    patient_id: validatedData.patient_id,
                    appointment_id: Number(appointmentId),
                    doctor_id: doctorId,
                },
            })
        }

        const med_id = validatedData.medical_id || medicalRecord?.id

        await db.vitalSigns.create({
            data: {
                ...validatedData,
                medical_id: Number(med_id!),
            },
        })

        return {
            success: true,
            msg: "Added successfully",
        }

    } catch (error) {
        return { success: false, msg: "Internal server error" }
    }
}

export async function addVitalPatient(
    data: VitalSignsPatientData,
    appointmentId: string,
    doctorId: string,
) {




    try {
        const { userId } = await auth()

        if (!userId) {
            return { success: false, msg: "Unauthorized" }
        }

        const validatedData = VitalsPatientSchema.parse(data)

        let medicalRecord = null

        if(!validatedData.medical_id) {
            medicalRecord = await db.medicalRecords.create({
                data: {
                    patient_id: validatedData.patient_id,
                    appointment_id: Number(appointmentId),
                    doctor_id: doctorId,
                },
            })
        }

        const med_id = validatedData.medical_id || medicalRecord?.id

        await db.vitalSigns.create({
            data: {
                ...validatedData,
                medical_id: Number(med_id!),
            },
        })

        return {
            success: true,
            msg: "Added successfully",
        }

    } catch (error) {
        
        return { success: false, msg: "Internal server error" }
    }
}

export async function addVitalPatientPage(
    data: VitalSignsPatientData,
    appointmentId: string,
    doctorId: string,
) {




    try {
        const { userId } = await auth()

        if (!userId) {
            return { success: false, msg: "Unauthorized" }
        }

        const validatedData = VitalsPatientSchema.parse(data)

        let medicalRecord = null

        if(!validatedData.medical_id) {
            medicalRecord = await db.medicalRecords.create({
                data: {
                    patient_id: validatedData.patient_id,
                    appointment_id: Number(appointmentId),
                    doctor_id: doctorId,
                },
            })
        }

        const med_id = validatedData.medical_id || medicalRecord?.id

        await db.vitalSigns.create({
            data: {
                ...validatedData,
                medical_id: Number(med_id!),
            },
        })

        return {
            success: true,
            msg: "Added successfully",
        }

    } catch (error) {
        
        return { success: false, msg: "Internal server error" }
    }
}