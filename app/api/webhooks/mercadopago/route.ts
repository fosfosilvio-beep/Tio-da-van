import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import fs from "fs";
import path from "path";

// Inicializa o cliente Supabase direto para API/Webhooks (sem cookies)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing.");
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper para gravação de logs
function logInfo(message: string) {
  try {
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, "execucao_2026-05-22.log");
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    fs.appendFileSync(logPath, `[${timestamp}] [INFO] [Webhook MP] ${message}\n`);
  } catch (err) {
    console.error("Erro ao gravar log:", err);
  }
}

function logError(message: string) {
  try {
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, "execucao_2026-05-22.log");
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    fs.appendFileSync(logPath, `[${timestamp}] [ERROR] [Webhook MP] ${message}\n`);
  } catch (err) {
    console.error("Erro ao gravar log:", err);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Suporta formato de simulação direta ou payload do Mercado Pago
    let paymentId = body.payment_id || body.data?.id;
    let status = body.status || "approved"; // Mercado Pago approved = pago

    // Se vier do query string
    if (!paymentId) {
      const { searchParams } = new URL(req.url);
      paymentId = searchParams.get("payment_id") || searchParams.get("data.id") || undefined;
    }

    if (!paymentId) {
      logError("Recebida requisição de webhook sem Payment ID.");
      return NextResponse.json(
        { error: "Payment ID not found in body or query parameters." },
        { status: 400 }
      );
    }

    logInfo(`Processando notificação para o pagamento: ${paymentId}`);

    // 1. Localizar a cobrança
    const { data: cobranca, error: findError } = await supabase
      .from("cobrancas")
      .select("*, motoristas(*, usuarios(*))")
      .eq("mercadopago_payment_id", paymentId)
      .single();

    if (findError || !cobranca) {
      logError(`Cobrança não encontrada no banco com o Payment ID: ${paymentId}. Erro: ${findError?.message || "Nenhum"}`);
      return NextResponse.json(
        { error: `Invoice with payment ID ${paymentId} not found.` },
        { status: 404 }
      );
    }

    if (cobranca.status === "pago") {
      logInfo(`Cobrança ${cobranca.id} já consta como Paga. Pulando processamento.`);
      return NextResponse.json({
        success: true,
        message: "Payment already processed.",
        cobranca,
      });
    }

    // 2. Processamento do pagamento
    if (status === "approved" || status === "pago") {
      const now = new Date().toISOString();

      // Atualiza cobrança para 'pago' e define data de pagamento
      const { data: updatedCobranca, error: updateError } = await supabase
        .from("cobrancas")
        .update({
          status: "pago",
          pago_em: now,
        })
        .eq("id", cobranca.id)
        .select()
        .single();

      if (updateError) {
        logError(`Erro ao atualizar status da cobrança ${cobranca.id}: ${updateError.message}`);
        return NextResponse.json(
          { error: "Database update failed." },
          { status: 500 }
        );
      }

      // Simula split de pagamento (95% / 5%)
      const valTotal = Number(cobranca.valor_total);
      const valPlat = Number(cobranca.valor_plataforma);
      const valMot = Number(cobranca.valor_motorista);

      logInfo(
        `Sucesso: Pagamento confirmado da cobrança ${cobranca.id}. Split executado: Total R$ ${valTotal.toFixed(2)} (Motorista R$ ${valMot.toFixed(2)} | Plataforma R$ ${valPlat.toFixed(2)}).`
      );

      return NextResponse.json({
        success: true,
        message: "Payment processed and split recorded successfully.",
        cobranca: updatedCobranca,
      });
    }

    logInfo(`Notificação recebida com status não processável: ${status}`);
    return NextResponse.json({
      success: true,
      message: `Notification received but status was: ${status}. No action taken.`,
    });

  } catch (error: any) {
    logError(`Erro crítico no handler de webhook: ${error?.message || error}`);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
