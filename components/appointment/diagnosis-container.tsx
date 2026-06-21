import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NoDataFound } from "../no-data-found"
import { AddDiagnosis } from "../dialogs/add-diagnosis"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { checkRole, getRole } from "@/utils/roles"
import { MedicalHistoryCard } from "./medical-history-card"
import { AddPatientDiagnosis } from "../dialogs/add-patient-diagnosis"
import { error } from "console"
import { Prisma } from "@/lib/generated/prisma/client"

export const DiagnosisContainer = async ({
    patientId,
    doctorId,
    id,
} : {
    patientId: string
    doctorId: string
    id: number
}) => {

    const { userId } = await auth()

    if (!userId) redirect("/sign-in")

    const role = await getRole()

    let where: Prisma.MedicalRecordsWhereInput

    if (role === "PATIENT") {
        const patient = await db.patient.findUnique({
            where: { user_id: userId },
        })

        if (!patient) {
            return (
                <div className="text-red-500">
                    No pt profile linked to the account
                </div>
            )
        }

        where = {patient_id: patient.id }
    } else {
        where= { patient_id: patientId }
    }

    {/* const patient = await db.patient.findUnique({
        where: {
            user_id: userId
        },
    })

    if (!patient) {
        return (
            <div className="text-red-500">
                No pt profile linked to the account
            </div>
        )
    } */}

    // const appoitmentId = Number(id)

    //if (Number.isNaN(appoitmentId)) {
   //     throw new Error("Invalid appointment")
    //}

    {/* const data = await db.medicalRecords.findMany({
        where: { patient_id: patientId },
        include: {
            diagnosis: {
                include: { doctor: true },
                orderBy: { created_at: "desc" },
            },
        },
        orderBy: { created_at: "desc" },
    }) */} 

    const data = await db.medicalRecords.findMany({
        where: { patient_id: patientId },
        include: {
            diagnosis: {
                include: { doctor: true },
                orderBy: { created_at: "desc" },
            },
        },
        orderBy: { created_at: "desc" },
    })

    //const diagnosis = data?.diagnosis || null
    const diagnosis = data.flatMap(r => r.diagnosis)
    const medicalId = data.length > 0 ? data[0]?.id.toString() : undefined

    const isPatient = await checkRole("PATIENT")

    return (
        <div>
            {diagnosis?.length === 0 || !diagnosis ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <NoDataFound note="No diagnosis found" />
                    {!isPatient && (
                        <AddDiagnosis
                            key={new Date().getTime()}
                            patientId={patientId}
                            doctorId={doctorId}
                            appointmentId={id}
                            medicalId={medicalId!}
                        />
                    )}

                    {isPatient && (
                        <AddPatientDiagnosis
                            key={new Date().getTime()}
                            patientId={patientId}
                            doctorId={doctorId}
                            appointmentId={id}
                            medicalId={medicalId!}
                        />
                    )}
                </div>
            ) : (
                <section className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Medical Records</CardTitle>

                            {!isPatient && (
                                <AddDiagnosis
                                    key={new Date().getTime()}
                                    patientId={patientId}
                                    doctorId={doctorId}
                                    appointmentId={id}
                                    medicalId={medicalId!}
                                />
                            )}

                            {isPatient && (
                                <AddPatientDiagnosis
                                    key={new Date().getTime()}
                                    patientId={patientId}
                                    doctorId={doctorId}
                                    appointmentId={id}
                                    medicalId={medicalId!}
                                />
                            )}
                        </CardHeader>

                        <CardContent>
                            {diagnosis?.map((record, id) => (
                                <div className="" key={record.id}>
                                    <MedicalHistoryCard 
                                        record={record}
                                        index={id}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            )} 
        </div>
    )
}