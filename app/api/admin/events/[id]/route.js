import { NextResponse } from 'next/server';

// Simulate database storage for event petitions (same as main route)
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

// GET - Retrieve specific event petition
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const petitionId = parseInt(id);

    const petition = eventPetitions.find(p => p.id === petitionId);

    if (!petition) {
      return NextResponse.json(
        { success: false, error: 'Solicitud de evento no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: petition
    });

  } catch (error) {
    console.error('Error fetching event petition:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH - Update event petition status (approve/reject)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const petitionId = parseInt(id);
    const body = await request.json();
    const { status, reason } = body;

    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Estado inválido. Debe ser "approved" o "rejected"' },
        { status: 400 }
      );
    }

    const petitionIndex = eventPetitions.findIndex(p => p.id === petitionId);

    if (petitionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Solicitud de evento no encontrada' },
        { status: 404 }
      );
    }

    // Update petition status
    eventPetitions[petitionIndex] = {
      ...eventPetitions[petitionIndex],
      status,
      reviewedAt: new Date().toISOString().split('T')[0],
      reason: reason || null
    };

    return NextResponse.json({
      success: true,
      message: `Evento ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`,
      data: eventPetitions[petitionIndex]
    });

  } catch (error) {
    console.error('Error updating event petition:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event petition
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const petitionId = parseInt(id);

    const petitionIndex = eventPetitions.findIndex(p => p.id === petitionId);

    if (petitionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Solicitud de evento no encontrada' },
        { status: 404 }
      );
    }

    const deletedPetition = eventPetitions.splice(petitionIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Solicitud de evento eliminada exitosamente',
      data: deletedPetition
    });

  } catch (error) {
    console.error('Error deleting event petition:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 