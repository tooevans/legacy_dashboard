"use server"

import { DiagnosisFormData } from "@/components/dialogs/add-diagnosis";
import { DiagnosisPatientData } from "@/components/dialogs/add-patient-diagnosis";
import db from "@/lib/db";
import { DiagnosisPatientSchema, DiagnosisSchema } from "@/lib/schema";
import { success } from "zod";

export const addDiagnosis = async (
    data: DiagnosisFormData,
    appointmentId: string
) => {
    try {
        const validatedData = DiagnosisSchema.parse(data)

        let medicalRecord = null

        if (!validatedData.medical_id) {
            medicalRecord = await db.medicalRecords.create({
                data: {
                    patient_id: validatedData.patient_id,
                    doctor_id: validatedData.doctor_id,
                    appointment_id: Number(appointmentId),
                },
            })
        }

        const med_id = validatedData.medical_id || medicalRecord?.id

        await db.diagnosis.create({
            data: {
                ...validatedData,
                medical_id: Number(med_id),
            },
        })

        return {
            success: true,
            message: "Diagnosis added successfully",
            status: 200,
        }
    } catch (error) {
        console.log(error)
        return {
            error: "Failed to add data."
        }
    }
}

export const addDiagnosisPatient = async (
    data: DiagnosisPatientData,
    appointmentId: string
) => {
    try {
        const validatedData = DiagnosisPatientSchema.parse(data)

        let medicalRecord = null

        if (!validatedData.medical_id) {
            medicalRecord = await db.medicalRecords.create({
                data: {
                    patient_id: validatedData.patient_id,
                    doctor_id: validatedData.doctor_id,
                    appointment_id: Number(appointmentId),
                },
            })
        }

        const med_id = validatedData.medical_id || medicalRecord?.id

        await db.diagnosis.create({
            data: {
                ...validatedData,
                medical_id: Number(med_id),
            },
        })

        return {
            success: true,
            message: "Diagnosis added successfully",
            status: 200,
        }
    } catch (error) {
        console.log(error)
        return {
            error: "Failed to add data."
        }
    }
}