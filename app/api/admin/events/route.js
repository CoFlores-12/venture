import { NextResponse } from 'next/server';

// Simulate database storage for event petitions
let eventPetitions = [
  {
    id: 1,
    userId: "USR001",
    userName: "María González",
    eventName: "Concierto de Verano 2024",
    status: "pending",
    createdAt: "2024-01-15",
    rtn: "0801-1990-12345",
    location: "Plaza Central, Tegucigalpa",
    schedule: "20:00 - 23:00",
    dates: ["2024-02-15", "2024-02-16"],
    tickets: [
      { label: "VIP", value: 1500 },
      { label: "General", value: 800 },
      { label: "Estudiante", value: 400 }
    ],
    description: "Un espectacular concierto al aire libre con los mejores artistas nacionales e internacionales."
  },
  {
    id: 2,
    userId: "USR002",
    userName: "Carlos Mendoza",
    eventName: "Feria Cultural Indígena",
    status: "pending",
    createdAt: "2024-01-14",
    rtn: "0801-1985-67890",
    location: "Parque La Leona, Tegucigalpa",
    schedule: "10:00 - 18:00",
    dates: ["2024-03-20"],
    tickets: [
      { label: "Entrada General", value: 200 }
    ],
    description: "Celebración de la cultura indígena con artesanías, música tradicional y gastronomía local."
  },
  {
    id: 3,
    userId: "USR003",
    userName: "Ana Rodríguez",
    eventName: "Festival de Cine Independiente",
    status: "approved",
    createdAt: "2024-01-13",
    rtn: "0801-1992-11223",
    location: "Cine Variedades, San Pedro Sula",
    schedule: "19:00 - 22:00",
    dates: ["2024-02-10", "2024-02-11", "2024-02-12"],
    tickets: [
      { label: "Pase Diario", value: 300 },
      { label: "Pase Completo", value: 800 }
    ],
    description: "Muestra de cine independiente nacional e internacional con proyecciones especiales."
  },
  {
    id: 4,
    userId: "USR004",
    userName: "Luis Herrera",
    eventName: "Expo Tecnología 2024",
    status: "rejected",
    createdAt: "2024-01-12",
    rtn: "0801-1988-44556",
    location: "Centro de Convenciones, Tegucigalpa",
    schedule: "09:00 - 17:00",
    dates: ["2024-04-05", "2024-04-06"],
    tickets: [
      { label: "Profesional", value: 1200 },
      { label: "Estudiante", value: 600 },
      { label: "Público General", value: 400 }
    ],
    description: "Exposición de las últimas tecnologías y innovaciones en el sector tecnológico."
  }
];

// GET - Retrieve all event petitions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let filteredPetitions = eventPetitions;
    
    // Filter by status if provided
    if (status) {
      filteredPetitions = eventPetitions.filter(petition => petition.status === status);
    }
    
    return NextResponse.json({
      success: true,
      data: filteredPetitions,
      total: filteredPetitions.length,
      pending: eventPetitions.filter(p => p.status === 'pending').length,
      approved: eventPetitions.filter(p => p.status === 'approved').length,
      rejected: eventPetitions.filter(p => p.status === 'rejected').length
    });
    
  } catch (error) {
    console.error('Error fetching event petitions:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Create new event petition
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userName, eventName, rtn, location, schedule, dates, tickets, description } = body;

    // Validate required fields
    if (!userId || !userName || !eventName || !rtn || !location || !schedule || !dates || !tickets || !description) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Create new petition
    const newPetition = {
      id: eventPetitions.length + 1,
      userId,
      userName,
      eventName,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      rtn,
      location,
      schedule,
      dates,
      tickets,
      description
    };

    eventPetitions.push(newPetition);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Solicitud de evento creada exitosamente',
        data: newPetition
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating event petition:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 