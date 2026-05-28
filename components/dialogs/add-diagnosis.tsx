"use client"

import { DiagnosisSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { CardDescription, CardHeader } from "../ui/card"
import { Field, FieldGroup } from "../ui/field"
import { CustomInput } from "../custom-input"
import { addDiagnosis } from "@/app/actions/medical"
import { toast } from "sonner"

interface AddDiagnosisProps{
    patientId: string
    doctorId: string
    appointmentId: string
    medicalId: string
}

export type DiagnosisFormData = z.infer<typeof DiagnosisSchema>

export const AddDiagnosis = ({
    patientId, doctorId, appointmentId, medicalId,
} : AddDiagnosisProps) => {

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<DiagnosisFormData>({
        resolver: zodResolver(DiagnosisSchema),
        defaultValues: {
            patient_id: patientId,
            medical_id: medicalId,
            doctor_id: doctorId,
            symptoms: "",
            diagnosis: "",
            notes: "",
            prescription: "",
        }
    })

    const handleSubmit = async (data: DiagnosisFormData) => {
        try {
            setLoading(true)

            const res = await addDiagnosis(data, appointmentId)

            if (res.success) {
                toast.success(res.message)
                router.refresh()
                form.reset()
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error("Failed to add diagnosis");
            
        } finally {
            setLoading(false)
        }
    }

    return(
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"outline"} size={"lg"} className="bg-blue-500 text-white mt-4" >
                        <Plus size={20} className="text-white"/>
                        Add Diagnosis
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[50%] 2xl:max-w-[50%]">
                    <CardHeader className="px-0">
                        <DialogTitle>New Diagnosis</DialogTitle>
                        <CardDescription>
                            Ensure correct and accurate findings are reported as this will be used in other hospitals.
                        </CardDescription>
                    </CardHeader>

                    <Field {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-6"
                        >
                            
                                <div className="flex items-center gap-4">
                                    <CustomInput
                                        type='textarea'
                                        control={form.control}
                                        name='symptoms'
                                        label="Symptoms"
                                        placeholder="Symptoms and Other findings"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <CustomInput
                                        type='textarea'
                                        control={form.control}
                                        name='diagnosis'
                                        label="Diagnosis"
                                        placeholder="Enter Diagnosis here"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <CustomInput
                                        type='textarea'
                                        control={form.control}
                                        name='prescription'
                                        label="Prescription"
                                        placeholder="Prescription here"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <CustomInput
                                        type='textarea'
                                        control={form.control}
                                        name='notes'
                                        label="Optional"
                                        placeholder="Additional notes"
                                    />

                                    <CustomInput
                                        type='textarea'
                                        control={form.control}
                                        name='follow_up-plan'
                                        label="Optional"
                                        placeholder="Follow up plan"
                                    />

                                </div>

                                <div className="flex items-center gap-4">
                                    
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-500 w-full"
                                >
                                    Submit
                                </Button>
                            
                            
                        </form>
                    </Field>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}