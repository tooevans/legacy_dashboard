"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { addVitalPatientPage } from "@/app/actions/appointment"
import { VitalsPatientSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CustomInput } from "@/components/custom-input"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"

interface AddVitalPatientPageProps {
    patientId: string
    doctorId: string
    medicalId?: string
    appointmentId: string
}

export type VitalSignsPatientPageData = z.infer<typeof VitalsPatientSchema>

export const VitalsPage = ({patientId,doctorId,medicalId,appointmentId} : AddVitalPatientPageProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<VitalSignsPatientPageData>({
        resolver: zodResolver(VitalsPatientSchema) as any,
        defaultValues: {
            patient_id: patientId,
            medical_id: medicalId,
            systolic: undefined,
            diastolic: undefined,
            pulse: undefined,
            sugars: undefined,

        },
    })

    const handleSubmit = async (data: VitalSignsPatientPageData) => {
        try {
            setIsLoading(true)

            const res = await addVitalPatientPage(data, doctorId, appointmentId)

            if (res.success) {
                router.refresh()
                toast.success(res.msg)
                form.reset()
            } else {
                toast.error(res.msg)
            }

            
            
        } catch (error) {
            toast.error("Failed to add vital signs")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus size={20} className="text-gray-800" /> Add Vital Signs
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add vitals</DialogTitle>
                        <DialogDescription>
                            Add vital signs for patient
                        </DialogDescription>
                    </DialogHeader>

                    <Field {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-8"
                        >
                            

                                <div className="flex items-center gap-4">
                                    <CustomInput
                                        type="input"
                                        control={form.control}
                                        name="systolic"
                                        label="Systolic"
                                        placeholder="Systolic BP"
                                    /> 
                                    <CustomInput
                                        type="input"
                                        control={form.control}
                                        name="diastolic"
                                        label="Diastolic"
                                        placeholder="Diastolic"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                     
                                    <CustomInput
                                        type="input"
                                        control={form.control}
                                        name="pulse"
                                        label="Pulse (BPM)"
                                        placeholder="Pulse"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <CustomInput
                                        type="input"
                                        control={form.control}
                                        name="sugars"
                                        label="Blood Sugars"
                                        placeholder="Blood sugar"
                                    /> 
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Submitting" : "Submit"}
                                </Button>

                            
                        </form>
                    </Field>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}
