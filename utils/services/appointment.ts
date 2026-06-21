import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { success } from "zod";
import { auth } from "@clerk/nextjs/server"
import { tr } from "zod/v4/locales";
import { getRole } from "../roles";


export async function getAppointmentById(id: number) {
    try {

        const { userId } = await auth()

        const role = await getRole()

        if (!userId) {
            return {
                success: false,
                message: "Unauthorized",
                status: 401,
            }
        }

        if (!id) {
            return {
                success: false,
                message: "Appointment does not exist.",
                status: 404,
            };
        }

        let where: Prisma.AppointmentWhereInput = {
            id,
        }

        if (role === "patient") {
            const patient = await db.patient.findUnique({
                where: {
                    user_id: userId,
                },
            })

            if (!patient) {
                return {
                    success: false,
                    message: "Forbidden",
                    status: 403,
                }
            }

            where = {
                id,
                patient_id: patient.id,
            }
        }

        if (role === "doctor") {
            const doctor = await db.doctor.findUnique({
                where: {
                    user_id: userId,
                },
            })

            if (!doctor) {
                return {
                    success: false,
                    status: 403,
                    message: "Forbidden",
                }
            }

            where = {
                id,
                doctor_id: doctor.id,
            }
        }

        

        

        const data = await db.appointment.findFirst({
            where,
            include: {
                patient: {
                    select: { 
                        id: true, 
                        first_name: true, 
                        last_name: true,
                        date_of_birth: true,
                        gender: true,
                        img: true,
                        address: true,
                        phone: true,
                    },
                },

                doctor: {
                    select: { id: true, name: true, specialization: true, img: true },
                },
                
                appointmentType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        if (!data) {
            return {
                success: false,
                message: "Patient data not found",
                status: 200,
                data: null,
            };
        }

        return { success: true, data, status: 200 };
    } catch (error) {
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

interface AllAppointmentsProps {
    page: number | string
    limit?: number | string
    search?: string
    id?: string
}


const buildQuery = (id?: string, search?: string) => {
    const searchConditions: Prisma.AppointmentWhereInput = search 
        ? {
            OR: [
                {
                    patient: {
                        first_name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    patient: {
                        last_name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    doctor: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
            ]
        } 
        : {};

    const idConditions: Prisma.AppointmentWhereInput = id
        ? {
            OR: [{ patient_id: id }, {doctor_id: id }],
        } 
        : {};

        const combinedQuery: Prisma.AppointmentWhereInput = 
            id || search
                ? {
                    AND: [
                        ...(Object.keys(searchConditions).length > 0
                            ? [searchConditions]
                            : []),
                        ...(Object.keys(idConditions).length > 0
                            ? [idConditions]
                            : []),
                    ],
                }
                : {};

        return combinedQuery;
} 

export async function getPatientAppointments({page, limit, search}: AllAppointmentsProps) {
    try {

        const { userId } = await auth()

        if (!userId) {
            return {
                success: false,
                message: "Unauthorized",
                status: 401,
            }
        }

        const role = await getRole()

        let where: Prisma.AppointmentWhereInput = {}

        const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page)
        const LIMIT = Number(limit) || 10

        const SKIP = (PAGE_NUMBER - 1) * LIMIT

        if (role === "patient") {
            const patient = await db.patient.findFirst({
                where: {
                    user_id: userId,
                },
            })

            if (!patient) {
                return {
                    success: false,
                    message: "Forbidden",
                    status: 403,
                }
            }

            where.patient_id = patient?.id
        }

        if (role === "doctor") {
            const doctor = await db.doctor.findUnique({
                where: {
                    user_id: userId,
                },
            })

            where.doctor_id = doctor?.id
        }

        if (role === "admin") {
            where = {}
        }

        
        if (search) {
            where = {
                ...where,
                OR: [
                    {
                        doctor: {
                            name: {
                                contains: search, mode: "insensitive",
                            },
                        },
                    },
                    {
                        patient: {
                            first_name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }
        }
                
            

        const [data, totalRecord] = await Promise.all([
            db.appointment.findMany({
                where,
                skip: SKIP,
                take: LIMIT,
                select: {
                    id:true, patient_id: true, doctor_id: true, type: true, appointment_date: true, time: true, status: true,
                    patient: {
                        select: {
                            id: true, first_name: true, last_name: true, phone: true, gender: true, img: true, date_of_birth: true, colorCode: true,
                        },
                    },
                    doctor: {
                        select: {
                            id: true, name: true, specialization: true, colorCode: true, img: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
            }),
            db.appointment.count({
                where
            })
        ])

        if (!data) {
            return {
                success: false,
                message: "Patient data not found",
                status: 200,
                data: null,
            };
        }

        const totalPages = Math.ceil(totalRecord / LIMIT)

        return { 
            success: true, 
            data, 
            status: 200,
            totalPages,
            currentPage: PAGE_NUMBER,
            totalRecord,
        };
    } catch (error) {
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

export async function getAppointmentWithMedicalRecordsById(id: number) {
    try {
        const { userId } = await auth()

        const role = await getRole()

        let where: Prisma.AppointmentWhereInput = {
            id,
        }

        if (!userId) {
            return{
                success: false,
                status: 401,
                message: "Unauthorized",
            }
        }

    
        if (!id) {
            return {
                status: 404,
                success: false,
                message: "Appointment does not exist"
            };
        }

        if (role === "patient") {
            const patient = await db.patient.findUnique({
                where: {
                    user_id: userId,
                },
            })

            if (!patient) {
                return {
                    success: false,
                    message: "Forbidden",
                    status: 403,
                }
            }

            where = {
                id,
                patient_id: patient.id,
            }
        }

        if (role === "doctor") {
            const doctor = await db.doctor.findUnique({
                where: {
                    user_id: userId,
                },
            })

            if (!doctor) {
                return {
                    success: false,
                    message: "Forbidden",
                    status: 403,
                }
            }

            where = {
                id,
                doctor_id: doctor.id,
            }
        }

        const data = await db.appointment.findFirst({
            where,
            include: {
                patient: true,
                doctor: true,
                medical: {
                    include: {
                        diagnosis: true,
                        lab_test: true,
                        vital_signs: true,
                    },
                },
            },
        })

        if (!data) {
            return {
                success: false,
                message: "Data not found",
                status: 200,
            }
        }

        return { success: true, data, status: 200 }

    } catch (error) {
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

export async function getPatientMedicalRecords(patientId: string) {
    try {
        const records = await db.medicalRecords.findMany({
            where: {
                patient_id: patientId,
            },
            include: {
                patient: true,
                diagnosis: {
                    include:{
                        doctor: true,
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                },
                lab_test: true,
            },
            orderBy: {
                created_at: "desc",
            },
        })

        return {
            success: true,
            data: records,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            data: [],
        }
    }
}