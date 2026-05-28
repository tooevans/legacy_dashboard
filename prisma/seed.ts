const { PrismaClient } = require("@prisma/client");
const { fakerDE: faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seed() {
    console.log("Seeding data...");

    const staffRoles = ["NURSE", "LAB_TECHNICIAN", "PHARMACIST"];

    for (const role of staffRoles) {
        const mobile = faker.phone.number();

        await prisma.staff.create({
            data: {
                id: faker.string?.uuid(),
                email: faker.internet.email(),
                name: faker.name.fullName(),
                phone: mobile,
                department: faker.company.name(),
                role: role,
                status: "ACTIVE",
            },
        });
    }

    const doctor: any[] = [];
    for (let i=0;i< 10; i++) {
        const doctor = await prisma.doctor.create({
            data: {
                id: faker.string?.uuid(),
                email: faker.internet.email(),
                name: faker.name.fullName(),
                phone: faker.phone.number(),
                department: faker.company.name(),
                specialization: faker.name.jobType(),
                license_number: faker.string.uuid(),
                availability_status: "ACTIVE",
                type: i % 2 === 0 ? "FULL" : "PART", 
                working_days: {
                    create: [
                        {
                            day: "monday",
                            start_time: "08:00",
                            close_time: "17:00",
                        },
                        {
                            day: "Wednesday",
                            start_time: "08:00",
                            close_time: "17:00",
                        },
                    ]
                }
            },
        });
        doctor.push(doctor);
    }

    const patients = [];
    for (let i= 0; i < 20; i++) {
        const patient = await prisma.patient.create({
            data: {
                id: faker.string?.uuid(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
                date_of_birth: faker.date.birthDate(),
                phone: faker.phone.number(),
                gender: i % 2 === 0 ? "MALE" : "FEMALE",
                marital_status: i % 3 === 0 ? "MARRIED" : "SINGLE",
                address: faker.address.streetAddress(),
                allergies: faker.lorem.words(2),
                medical_conditions: faker.lorem.words(3),
                privacy_consent: true,
                service_consent: true,
                medical_consent: true,
            },
        });

        patients.push(patient);
    }

    //create appointmet
    for (let i = 0; i < 20; i++) {
        const doctors = doctor[Math.floor(Math.random() * doctor.length)];
        const patient = patients[Math.floor(Math.random() * patients.length)];

        await prisma.appointment.create({
            data: {
                patient_id: patient.id,
                doctor_id: doctors.id,
                appointment_date: faker.date.soon(),
                time: "10:00",
                status: i % 4 === 0 ? "PENDING" : "SCHEDULED",
                type: "Checkup",
                reason: faker.lorem.sentence(),
            },
        });
    }

    console.log("Seeding complete");

    await prisma.$disconnect();
}

    seed().catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
