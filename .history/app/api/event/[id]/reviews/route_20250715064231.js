import { NextResponse } from 'next/server';
import { connectToMongoose } from '@/src/lib/db';
import Review from '@/src/models/review';

export async function GET(_request, { params }) {
  try {
    // 1. Conectar a la base de datos
    await connectToMongoose();

    // 2. Validar si recibimos el eventId
    const { eventId } = params;
    if (!eventId) {
      return NextResponse.json(
        { error: 'El ID del evento es requerido' },
        { status: 400 }
      );
    }

    // 3. Buscar las reseñas de ese evento
    const reviews = await Review.find({ event: eventId })
      .sort({ createdAt: -1 }) // Ordena de la más reciente a la más antigua
      .lean(); // Convierte los documentos a objetos simples

    // 4. Calcular el promedio de calificaciones
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // 5. Devolver las reseñas y el promedio
    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json(
      { error: 'No se pudieron obtener las reseñas', detail: error.message },
      { status: 500 }
    );
  }
}
