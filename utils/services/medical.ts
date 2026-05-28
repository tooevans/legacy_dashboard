import db from "@/lib/db"
import { format } from "date-fns"

export const getVitalSigns = async (id: string) => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const data = await db.vitalSigns.findMany({
        where: {
            patient_id: id,
            created_at: {
                gte: sevenDaysAgo,
            },
        },
        select: {
            created_at: true,
            systolic: true,
            diastolic: true,
            pulse: true,
        },
        orderBy: {
            created_at: "asc",
        },
    })

    const formatVitals = data?.map((record) => ({
        label: format(new Date(record.created_at), "dd MMM"),
        systolic: record.systolic,
        diastolic: record.diastolic,
    }))

    const formattedData = data.map((record) => {
        const heartRate = record.pulse
            .split("-")
            .map((rate) => parseInt(rate.trim()))

        return {
            label: format(new Date(record.created_at), "dd MMM"),
            value1: heartRate[0],
            value2: heartRate[1],
        }
    })

    {/* const totalSystolic = data?.reduce((sum, acc) => sum + acc.systolic, 0)
    const totalDiastolic = data?.reduce((sum, acc) => sum + acc.diastolic, 0)

    const totalValue1 = formattedData?.reduce((sum, acc) => sum + acc.value1, 0)
    const totalValue2 = formattedData?.reduce((sum, acc) => sum + acc.value2, 0)

    const count = data?.length

    const averageSystolic = totalSystolic / data?.length
    const averageDiastolic = totalDiastolic / data?.length

    const averageValue1 = totalValue1 / count
    const averageValue2 = totalValue2 /count

    const average = `${averageSystolic.toFixed()} / ${averageDiastolic.toFixed()} mmHg`
    const averagePulse = `${averageValue1.toFixed()} - ${averageValue2.toFixed()} bpm` */}

    return {
        data: formatVitals,
        // average,
        heartRateData: formattedData,
        // averagePulse,

    }
}