import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Inicializa o Mercado Pago com sua CHAVE SECRETA (Access Token)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const payment = new Payment(client);

/**
 * Endpoint para receber notificações (Webhooks) do Mercado Pago.
 * @param request A requisição POST enviada pelo Mercado Pago.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("========= WEBHOOK MERCADO PAGO RECEBIDO =========");
    console.log("Tipo de evento:", body.action);
    console.log("Dados recebidos:", body.data);
    
    // -------------------------------------------------------------------------
    // LÓGICA DE NEGÓCIO - A SER IMPLEMENTADA
    // -------------------------------------------------------------------------
    //
    // 1. Verifique se a notificação é do tipo 'payment.updated' ou similar.
    //
    if (body.type === 'payment') {
        const paymentId = body.data.id;
        console.log(`Buscando detalhes do pagamento: ${paymentId}`);

        // 2. Busque os detalhes completos do pagamento usando o ID recebido.
        //    Isso é crucial para segurança e para obter o status atualizado.
        // const paymentDetails = await payment.get({ id: paymentId });

        // console.log("Detalhes do Pagamento:", paymentDetails);

        // 3. Verifique se o pagamento foi aprovado ('approved').
        //
        // if (paymentDetails.status === 'approved') {
        //   
        //   // 4. Identifique o usuário/empresa no seu sistema.
        //   //    Você pode ter salvo o ID do usuário no momento da criação do pagamento
        //   //    usando o campo 'external_reference'.
        //   //    const empresaId = paymentDetails.external_reference;
        //   
        //   // 5. Atualize o status da assinatura do usuário no Firestore.
        //   //    Ex: Mude o campo 'planoId' para o novo plano ou 'statusPlano' para 'ativo'.
        //   console.log(`[SUCESSO] Pagamento aprovado para ${paymentId}. Atualizar banco de dados aqui.`);
        //
        // } else {
        //   console.log(`[INFO] Status do pagamento: ${paymentDetails.status}`);
        // }
    }
    
    console.log("=================================================");

    // -------------------------------------------------------------------------
    // É ESSENCIAL retornar uma resposta de sucesso (200 OK) para o Mercado Pago.
    // Se não for retornado, o Mercado Pago continuará tentando enviar a notificação.
    // -------------------------------------------------------------------------
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("❌ Erro no webhook do Mercado Pago:", err);
    return NextResponse.json(
      {
        error: true,
        message: err.message,
      },
      { status: 400 }
    );
  }
}
