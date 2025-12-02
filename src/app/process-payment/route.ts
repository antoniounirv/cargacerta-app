import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Inicializa o Mercado Pago com sua CHAVE SECRETA (Access Token)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!, // vem do .env.local
});

const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    // Dados enviados pelo frontend
    const data = await request.json();

    console.log("🔹 Dados recebidos do frontend:", data);

    // Criação do pagamento usando o SDK oficial do Mercado Pago
    // Nota: O 'token' aqui é o card token gerado pelo Brick no frontend.
    const response = await payment.create({
      body: {
        transaction_amount: Number(data.transaction_amount),
        token: data.token,
        description: data.description ?? "Pagamento CargaCerta",
        installments: data.installments,
        payment_method_id: data.payment_method_id,
        issuer_id: data.issuer_id,
        payer: {
          email: data.payer.email,
          first_name: data.payer.first_name,
          last_name: data.payer.last_name,
        },
      },
    });

    console.log("🔹 Resposta Mercado Pago:", response);

    // Retorna para o frontend o resultado
    return NextResponse.json({
      status: response.status,
      status_detail: response.status_detail,
      id: response.id,
    });
  } catch (err: any) {
    console.error("❌ Erro ao processar pagamento:", err);

    // Retorna um erro claro para o frontend
    return NextResponse.json(
      {
        error: true,
        message: err.message,
      },
      { status: 400 }
    );
  }
}
