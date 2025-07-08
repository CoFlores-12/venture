import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; 
import { connectToMongoose } from '@/src/lib/db';
import User from '@/src/models/user';

export async function GET(request) {
  try {
    //Conectamos a la base de datos
    await connectToMongoose();

    //Obtener el token de autorización del encabezado de la solicitud
    const authHeader = request.headers.get('Authorization');

    //Verificar si el encabezado de autorización existe y tiene el formato 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado. No se proporcionó token.' },
        { status: 401 }
      );
    }

    // Extraer el token (la parte después de 'Bearer ')
    const token = authHeader.split(' ')[1];

    //Verificar el token y el rol del usuario
    let decodedToken;
    try {
      // Verificar el token usando la clave secreta JWT definida en tus variables de entorno
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Si la verificación falla (token inválido o expirado)
      return NextResponse.json(
        { success: false, error: 'Token inválido o expirado.' },
        { status: 401 }
      );
    }

    // Asegurarse de que el token decodificado tenga un rol y que sea 'admin' o 'superadmin'
    if (!decodedToken.role || (decodedToken.role !== 'admin' && decodedToken.role !== 'superadmin')) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado. Se requiere rol de administrador.' },
        { status: 403 }
      );
    }

    // Si el usuario está autorizado, obtener todos los usuarios de la base de datos
    // Usamos .select('-password') para asegurarnos de que el campo de contraseña
    // no se incluya en la respuesta
    const users = await User.find({}).select('-password');

    //Retornar la lista de usuarios
    return NextResponse.json(
      {
        success: true,
        message: 'Usuarios obtenidos exitosamente.',
        users: users,
      },
      { status: 200 }
    );

  } catch (error) {
    //Manejo de cualquier otro error inesperado
    console.error('Error al listar usuarios:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}