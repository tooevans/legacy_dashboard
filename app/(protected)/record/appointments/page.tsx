import { AppointmentActionOptions } from '@/components/appointment-actions';
import { AppointmentContainer } from '@/components/appointment-container';
import { AppointmentStatusIndicator } from '@/components/appointment-status-indicator';
import { Pagination } from '@/components/pagination';
import { ProfileImage } from '@/components/profile-image';
import SearchInput from '@/components/search-input';
import { Table } from '@/components/tables/table';
import { Button } from '@/components/ui/button';
import { ViewAppointment } from '@/components/view-appointment';
import { Appointment, Doctor, Patient } from '@/lib/generated/prisma/client';
import { checkRole, getRole } from '@/utils/roles';
import { getPatientAppointments } from '@/utils/services/appointment';
import { DATA_LIMIT } from '@/utils/settings';
import { auth } from '@clerk/nextjs/server';
import { format, formatDate } from 'date-fns';
import { BriefcaseBusiness, UserPen } from 'lucide-react';
import React from 'react'

const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    key: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Status",
    key: "status",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
]

interface DataProps extends Appointment {
  patient: Patient
  doctor: Doctor
}

const Appointments =  async (props: {
  searchParams?: { [key: string] : string | undefined };
}) => {
  const searchParams = await props.searchParams
  const userRole = await getRole();
  const { userId } = await auth();
  const isPatient = await checkRole("PATIENT")

  const page = (searchParams?.p || "1") as string;
  const searchQuery = searchParams?.q || "";
  const id = searchParams?.id || undefined

  let queryId: string | undefined = undefined

  if (userRole === "admin") {
    queryId = searchParams?.id
  } else if (userRole === "doctor") {
    queryId = undefined
  } else if (userRole === "patient") {
    queryId = undefined
  }

  const { data, totalPages, totalRecord, currentPage } = 
    await getPatientAppointments({
      page,
      search: searchQuery,
      id: queryId!,
    })

  
  if (!data) return null;

  const renderItem = (item: DataProps) => {

    const patient_name = `${item?.patient?.first_name} ${item?.patient?.last_name}`

    return (
      <tr key={item?.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50'>
        <td className='flex items-center gap-2 md:gap-4 py-2 xl:py-4'>
          <ProfileImage 
            url={item?.patient?.img!}
            name={patient_name}
            bgColor={item?.patient?.colorCode!}
          />
          <div>
            <h3 className='font-semibold uppercase'>{patient_name}</h3>
            <span className='text-xs md:text-sm capitalize'>
              {item?.patient?.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className='hidden md:table-cell'>
          {format(item?.appointment_date, "dd-MM-yyyy")}
        </td>

        <td className='hidden md:table-cell lowercase'>{item.time}</td>

        <td className='hidden items-center py-2 md:table-cell'>
          
          <div>
            <ProfileImage 
            url={item?.doctor?.img!}
            name={item?.doctor?.name}
            bgColor={item?.doctor?.colorCode!}
            textClassName='text-black'
          />
            <div>
              <h3 className='font-semibold uppercase'>{item.doctor?.name}</h3>
              <span className='text-xs md:text-sm capitalize'>
                {item.doctor?.specialization}
              </span>
            </div>
          </div>
        </td>

        <td className='hidden xl:table-cell'>
          <AppointmentStatusIndicator status={item.status!} />
        </td>

        <td>
          <div className='flex items-center gap-2'>
            <ViewAppointment id={item?.id.toString()} />
            <AppointmentActionOptions 
              userId={userId!}
              patientId={item?.patient_id}
              doctorId={item?.doctor_id}
              status={item?.status}
              appointmentId={item.id}
            />
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className='bg-white rounded-xl p-2 md:p-4 2xl:p-6'>
      <div className='flex items-center justify-between'>
        <div className='hidden lg:flex items-center gap-1'>
          <BriefcaseBusiness size={20} className='text-gray-600' />
          <p className='text-2xl font-semibold'>{totalRecord ?? 0}</p>
          <span className='text-gray-700 text-sm xl:text-base'>
            Total Appointments
          </span>
        </div>

        <div className='w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2'>
          <SearchInput />

          {isPatient && <AppointmentContainer id={userId!} />}

          
        </div>
        
      </div>

      <div className='mt-6'>
        <Table 
          colums={columns}
          data={data}
          renderRow={renderItem}
        />

        {data?.length > 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />
        )}
      </div>
      
    </div>
  )
}

export default Appointments