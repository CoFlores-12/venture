import { NextResponse } from "next/server";
import Purchase from "@/src/models/purchase";
import CryptoJS from "crypto-js";
import { connectToMongoose } from "@/src/lib/db";
import Users from "@/src/models/Users";
const secret = process.env.QR_SECRET;

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const bytes = CryptoJS.AES.decrypt(token, secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 });
    }

  await connectToMongoose();

    const { userId, purchaseId } = JSON.parse(decrypted);

    const purchase = await Purchase.findById(purchaseId);
    const user = await Users.findById(userId);

    if (!purchase) {
      return NextResponse.json({ valid: false, message: "Compra no encontrada" }, { status: 404 });
    }

    if (purchase.user.toString() !== userId) {
      return NextResponse.json({ valid: false, message: "El usuario no coincide" }, { status: 403 });
    }

    if (purchase.token !== token) {
      return NextResponse.json({ valid: false, message: "Token no coincide con el almacenado" }, { status: 403 });
    }

    return NextResponse.json({ valid: true, message: "Boleto válido", purchase, userName: user.nombre }, { status: 200 });

  } catch (error) {
    console.error("Error al validar QR:", error);
    return NextResponse.json({ error: "Error del servidor", detail: error.message }, { status: 500 });
  }
} 