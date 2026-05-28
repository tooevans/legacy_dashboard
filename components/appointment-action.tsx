"use client"

import { AppointmentStatus } from "@/lib/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { appointmentAction } from "@/app/actions/appointment";

interface ActionProps {
    id: string | number;
    status: string;
}

export const AppointmentAction = ({ id, status } : ActionProps) => {
    const [isLoading, setLoading] = useState(false)
    const [selected, isSelected] = useState("")
    const [reason, setReason] = useState("")
    const router = useRouter()

    const handleAction = async () => {
        try {
            setLoading(true)
            const newReason = 
                reason || `Appointment has been ${selected.toLowerCase()} on ${new Date()}`;

            const resp = await appointmentAction(
                id,
                selected as AppointmentStatus,
                newReason
            )

            if (resp.success) {
                toast.success(resp.msg);

                router.refresh();
            } else if (resp.error) {
                toast.error(resp.msg);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. try again Later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="flex items-center space-x-3">
                <Button
                    variant="outline"
                    disabled={status === "PENDING" || isLoading || status === "COMPLETED"}
                    className="bg-yellow-100 text-black"
                    onClick={() => isSelected("PENDING")}
                >
                    Pending
                </Button>
                <Button
                    variant="outline"
                    disabled={status === "SCHEDULED" || isLoading || status === "COMPLETED"}
                    className="bg-blue-100 text-black"
                    onClick={() => isSelected("SCHEDULED")}
                >
                    Approve
                </Button>
                <Button
                    variant="outline"
                    disabled={status === "COMPLETED" || isLoading || status === "COMPLETED"}
                    className="bg-emerald-200 text-black"
                    onClick={() => isSelected("COMPLETED")}
                >
                    Completed
                </Button>
                <Button
                    variant="outline"
                    disabled={status === "CANCELLED" || isLoading || status === "COMPLETED"}
                    className="bg-red-200 text-black"
                    onClick={() => isSelected("CANCELLED")}
                >
                    Cancel
                </Button>
            </div>
            {selected === "CANCELLED" && (
                <>
                    <Textarea
                        disabled={isLoading}
                        className="mt-4"
                        placeholder="Enter Reason"
                        onChange={(e) => setReason(e.target.value)}
                    ></Textarea>
                </>
            )}

            {selected && (
                <div className="flex items-center justify-between mt-6 bg-red-100 p-4 rounded">
                    <p className="">Are you sure you want to perform this action? </p>
                    <Button disabled={isLoading} type="button" onClick={handleAction} >
                        Yes
                    </Button>
                </div>
            )}
        </div>
    )
}