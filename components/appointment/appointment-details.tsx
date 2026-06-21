import { format } from "date-fns"
import { SmallCard } from "../small-card"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import Link from "next/link"

interface AppointmentDetailsProps {
    id: number | string
    patient_id: string
    appointment_date: Date
    time: string
    notes?: string
}

export const AppointmentDetails = ({
    id, patient_id, appointment_date, time, notes,
} : AppointmentDetailsProps) => {
    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>Appointment Info</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex">
                    <SmallCard label="Appointment " value={`# ${id}`} />
                    <SmallCard 
                        label="Date " 
                        value={format(appointment_date, "dd MM, yyyy")} 
                    />
                    <SmallCard label="Time " value={time} />
                </div>

                <div>
                    <span>Additonal Notes</span>
                    <p className="text-sm text-gray-700">{notes || "No notes"}</p>
                </div>

                <div>
                    
                </div>
            </CardContent>
        </Card>
    )
}