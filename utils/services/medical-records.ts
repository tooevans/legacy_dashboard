import db from "@/lib/db"
import { Prisma } from "@/lib/generated/prisma/client"
import { auth } from "@clerk/nextjs/server"

export async function getMedicalRecords({
    page,
    limit,
    search,
} : {
    page: number | string
    limit?: number | string
    search?: string
}) {
    try {

        const { userId } = await auth()

        if (!userId) {
            return {
                success: false,
                message: "Unauthorized",
                status: 401,
            }
        }



        const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page)
        const LIMIT = Number(limit) || 10
        const SKIP = (PAGE_NUMBER - 1) * LIMIT

        const patient = await db.patient.findUnique({
            where: {
                user_id: userId,
            },
        })

        if (!patient) {
            return {
                success: false,
                status: 403,
                message: "Forbidden"
            }
        }

        const where: Prisma.MedicalRecordsWhereInput = {
            patient_id: patient.id,
            
            ...(search && {
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
                    { patient_id: { contains: search, mode: "insensitive" } },
                ],
            }), 
            
        }

        const [data, totalRecords] = await Promise.all([
            db.medicalRecords.findMany({
                where: where,
                include: {
                    patient: {
                        select: {
                            first_name: true, 
                            last_name: true, 
                            date_of_birth: true, 
                            img: true, 
                            colorCode: true,
                            gender: true,
                        },
                    },
                    diagnosis: {
                        include: {
                            doctor: { 
                                select:{
                                    name:true, specialization: true, img: true, colorCode: true
                                },
                            },
                        },
                    },
                    lab_test: true
                },
                skip: SKIP,
                take: LIMIT,
                orderBy: { created_at: "desc" },
            }),
            db.medicalRecords.count({ where }),
        ])

        const totalPages = Math.ceil(totalRecords / LIMIT)

        
        return {
            success: true, 
            data,
            status: 200,
            totalRecords,
            totalPages,
            currentPage: PAGE_NUMBER,
        };
    } catch (error) {
        return { success: false, message: "Internal Server Error", status: 500 }
    }
}

export async function getMyMedicalRecords() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const patient = await prisma.patient.findUnique({
        where: {
            user_id: userId,
        },
    })

    if (!patient) {
        throw new Error("Patient not found")
    }

    const records = await prisma.medicalRecords.findMany({
        where: {
            patient_id: patient.id,
        },
        include: {
            diagnosis: true,
            vitals: true,
            appointment: {
                select: {
                    id: true,
                    appointment_date: true,
                    status: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    })

    return records
}