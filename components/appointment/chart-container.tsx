import { getVitalSigns } from "@/utils/services/medical"
import BloodPressureChart from "./blood-pressure-chart"
import { HeartRateChart } from "./heart-rate-chart"

export default async function ChartContainer({ id } : { id: string }) {
    const { data, heartRateData } = await getVitalSigns(id.toString())
    return (
        <>
           {/* <BloodPressureChart data={data} average={average} /> */}

            {/* <HeartRateChart data={heartRateData} average={averagePulse} /> */}
        </>
    )
}
