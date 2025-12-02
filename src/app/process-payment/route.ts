import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Inicializa o Mercado Pago com sua CHAVE SECRETA (Access Token)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    // Dados enviados pelo frontend
    const data = await request.json();

    console.log("🔹 Dados recebidos do frontend:", data);

    const body = {
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
      // Adiciona a URL para receber notificações de pagamento (Webhooks)
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
    };

    // Criação do pagamento usando o SDK oficial do Mercado Pago
    const response = await payment.create({ body });

    console.log("🔹 Resposta Mercado Pago:", response);

    // Retorna para o frontend o resultado
    return NextResponse.json({
      status: response.status,
      status_detail: response.status_detail,
      id: response.id,
      payment_method_id: response.payment_method_id,
      // Se for boleto, retorna os dados para exibir
      ...(response.payment_method_id === 'bolbradesco' && {
        boleto_url: response.transaction_details?.external_resource_url,
        boleto_barcode: response.barcode?.content,
      }),
      // Se for PIX, retorna os dados para exibir
      ...(response.payment_method_id === 'pix' && {
         qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
         qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      }),
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
