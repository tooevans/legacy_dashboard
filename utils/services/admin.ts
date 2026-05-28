import db from "@/lib/db"
import { daysOfWeek } from ".."
import { processAppointments } from "./patient"
import { success } from "zod"
import { AvailableDoctors } from "@/components/available-doctor"

export async function getAdminDashboardStats() {
    try {
        const todayDate = new Date().getDay()
        const today = daysOfWeek[todayDate]

        const [totalPatient, totalDoctors, appointments, doctors] = await Promise.all([
            db.doctor.count(),
            db.patient.count(),
            db.appointment.findMany({
                include: {
                    patient: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            gender: true,
                            date_of_birth: true,
                            img: true,
                            colorCode: true,
                        },
                    },
                    doctor: {
                        select: {
                            name: true,
                            specialization: true,
                            img: true,
                            colorCode: true,
                        },
                    },
                },
                orderBy: { appointment_date: "desc" },
            }),
            db.doctor.findMany({
                where: {
                    working_days: {
                        some: { day: { equals: today, mode: "insensitive"}},
                    },
                },
                select: {
                    id: true,
                    name: true,
                    specialization: true,
                    img: true,
                    colorCode: true,
                },
                take: 5,
            }),
        ])

        const { appointmentCounts, monthlyData } = await processAppointments(appointments)

        const last5Records = appointments.slice(0, 5)

        return {
            success: true,
            status: 200,
            totalPatient,
            totalDoctors,
            appointmentCounts,
            availableDoctors: doctors,
            monthlyData,
            totalAppointments: appointments.length,
            last5Records,
        }
    } catch (error) {
        return { error: true, message: "Something went wrong" }
    }
}