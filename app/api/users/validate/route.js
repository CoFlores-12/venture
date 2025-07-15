import { connectToMongoose } from "@/src/lib/db";
import Users from "@/src/models/Users";

export async function PUT(request) {
  try {
    const { userId, action } = await request.json();
    
    await connectToMongoose();
    let update;
    
    if (action === 'approve') {
      update = { verificado: true, rol: 'organizer' };
    } else if (action === 'reject') {
      update = { verificado: true };
    } else {
      return new Response(JSON.stringify({ error: 'Acción no válida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      update,
      { new: true }
    ).select('-passwordHash -__v');
    
    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}