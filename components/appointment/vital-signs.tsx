import db from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { calculateBMI } from "@/utils"
import { format } from "date-fns"
import { Separator } from "../ui/separator"
import { checkRole } from "@/utils/roles"
import { AddVitalSigns } from "../dialogs/add-vital-signs"
import { AddVitalPatient } from "../dialogs/add-patient-vitals"

interface VitalSignProps {
    id: number | string
    patientId: string
    doctorId: string
    medicalId?: string
    appointmentId?: string
}

const ItemCard = ({label, value} : {label: string, value: string}) => {
    return (
        <div className="w-full">
            <p className="xl:text-base text-black font-bold text-lg">{label}</p>
            <p className="text-sm xl:text-xl font-medium text-gray-700">{value}</p>
            
        </div>
    )
}

export const VitalSigns = async ({
    id, patientId, doctorId
} : VitalSignProps) => {

    const data = await db.medicalRecords.findFirst({
        where: { appointment_id: Number(id) },
        include: {
            vital_signs: {
                orderBy: { created_at: "desc" },
            },
        },
        orderBy: { created_at: "desc" },
    })

    const vitals = data?.vital_signs || null

    const isPatient = await checkRole("PATIENT")

    return (
        <section id="vital-signs">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Vital Signs</CardTitle>

                    {!isPatient && (
                        <AddVitalSigns 
                            key={new Date().getTime()}
                            patientId={patientId}
                            doctorId={doctorId}
                            appointmentId={id!.toString()}
                            medicalId={data ? data?.id!.toString() : ""}
                        />
                    )}

                    {isPatient && (
                        <AddVitalPatient 
                            key={new Date().getTime()}
                            patientId={patientId}
                            doctorId={doctorId}
                            appointmentId={id!.toString()}
                            medicalId={data ? data?.id!.toString() : ""}
                        />
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {vitals?.map((i) => {
                        const { bmi, status, coloCode } = calculateBMI(
                            i.weight || 0, i.height || 0,
                        )

                        return <div className="space-y-4" key={i?.id}>
                            <div className="flex mt-5 items-center justify-center">
                                <ItemCard 
                                    label="Date" 
                                    value={format(i?.created_at, "dd MMM, yyyy hh:mm")}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <ItemCard 
                                    label="Blood Pressure" 
                                    value={
                                        i?.systolic && i?.diastolic 
                                        ? `${i?.systolic} / ${i?.diastolic} mmHg`
                                        : ""
                                    }
                                />
                                <ItemCard 
                                    label="Pulse" 
                                    value={
                                        i?.pulse 
                                        ? `${i?.pulse} bpm`
                                        : ""
                                    }
                                />
                                <ItemCard 
                                    label="Temperature" 
                                    value={
                                        i?.body_temperature  
                                        ? `${i?.body_temperature} °C` 
                                        : ""
                                    }
                                />
                                
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <ItemCard 
                                    label="Weight" 
                                    value={
                                        i?.weight
                                        ? `${i?.weight} kg`
                                        : ""
                                    }
                                />
                                <ItemCard 
                                    label="Height" 
                                    value={
                                        i?. height
                                        ? `${i?.height || ""} cm`
                                        : ""
                                    }
                                />

                                <div className="w-full">
                                    <div className="flex gap-x-2 items-center">
                                        <p>BMI</p>
                                        <p className="text-lg xl:text-xl font-medium">{bmi || ""}</p>
                                        <span className="text-sm font-medium" style={{ color: coloCode}}>
                                            ({status})
                                        </span>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <ItemCard 
                                    label="Sugars" 
                                    value={
                                        i?.sugars 
                                        ? `${i?.sugars} mmol/l`
                                        : ""
                                    }
                                />
                                <ItemCard 
                                    label="Respiratory Rate" 
                                    value={
                                        i?.respiratory_rate
                                        ? `${i?.respiratory_rate} bpm`
                                        : ""
                                    }
                                />

                            </div>
                            <Separator className="mt-10" />
                        </div>
                    })}
                </CardContent>
            </Card>
        </section>
    )
}