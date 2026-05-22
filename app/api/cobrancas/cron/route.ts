import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import fs from "fs";
import path from "path";

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
    fs.appendFileSync(logPath, `[${timestamp}] [INFO] [Cron Cobranças] ${message}\n`);
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
    fs.appendFileSync(logPath, `[${timestamp}] [ERROR] [Cron Cobranças] ${message}\n`);
  } catch (err) {
    console.error("Erro ao gravar log:", err);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    logInfo("Executando varredura preventiva de cobranças (Simulação de Cron diário)...");

    // 1. Obter todos os alunos com vínculo ativo
    const { data: alunos, error: errorAlunos } = await supabase
      .from("alunos")
      .select("*, motoristas(*)")
      .eq("status_vinculo", "ativo");

    if (errorAlunos || !alunos) {
      logError(`Erro ao buscar alunos ativos: ${errorAlunos?.message}`);
      return NextResponse.json({ error: "Failed to fetch active students." }, { status: 500 });
    }

    logInfo(`Encontrados ${alunos.length} alunos com vínculo ativo.`);

    const referenciaMes = "2026-06"; // Simulando geração preventiva para o próximo mês (Junho 2026)
    const criadas: any[] = [];
    const jaExistentes: string[] = [];

    // 2. Para cada aluno, verificar se já existe cobrança para o mês de referência
    for (const aluno of alunos) {
      if (!aluno.motorista_id) {
        logInfo(`Aluno ${aluno.nome} (${aluno.id}) está sem motorista associado. Ignorando.`);
        continue;
      }

      const { data: cobrancaExistente, error: errorCobranca } = await supabase
        .from("cobrancas")
        .select("id")
        .eq("aluno_id", aluno.id)
        .eq("referencia_mes", referenciaMes)
        .maybeSingle();

      if (cobrancaExistente) {
        logInfo(`Cobrança para o aluno ${aluno.nome} referente a ${referenciaMes} já existe: ${cobrancaExistente.id}`);
        jaExistentes.push(aluno.nome);
        continue;
      }

      // 3. Gerar nova cobrança com split de 95% para motorista e 5% para plataforma
      const valorTotal = 450.00; // Valor padrão de mensalidade simulada
      const valorPlataforma = valorTotal * 0.05; // 5% comissão
      const valorMotorista = valorTotal * 0.95; // 95% repasse

      // Vencimento em 3 dias a partir de hoje (Simulando preventivo)
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 3);
      const vencimentoStr = dataVencimento.toISOString().substring(0, 10);

      // IDs de simulação do Mercado Pago
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const mpPaymentId = `mp_pay_${randomId}`;
      const pixCopiaCola = `00020101021226870014br.gov.bcb.pix2565pix-prod.mercadopago.com/qr/v2/${mpPaymentId}`;

      const { data: novaCobranca, error: insertError } = await supabase
        .from("cobrancas")
        .insert({
          motorista_id: aluno.motorista_id,
          pai_id: aluno.pai_id,
          aluno_id: aluno.id,
          valor_total: valorTotal,
          valor_plataforma: valorPlataforma,
          valor_motorista: valorMotorista,
          status: "pendente",
          mercadopago_payment_id: mpPaymentId,
          pix_copia_cola: pixCopiaCola,
          vencimento: vencimentoStr,
          referencia_mes: referenciaMes,
        })
        .select()
        .single();

      if (insertError) {
        logError(`Erro ao criar cobrança para o aluno ${aluno.nome}: ${insertError.message}`);
        continue;
      }

      logInfo(
        `Cobrança criada para o aluno ${aluno.nome}. Valor R$ ${valorTotal.toFixed(2)} (Ref: ${referenciaMes}, Vecto: ${vencimentoStr}, Payment ID: ${mpPaymentId}). Split registrado: 95% / 5%.`
      );
      criadas.push(novaCobranca);
    }

    return NextResponse.json({
      success: true,
      message: `Cron executed. Created ${criadas.length} new invoices. ${jaExistentes.length} already existed.`,
      criadas,
      jaExistentes,
    });

  } catch (error: any) {
    logError(`Erro crítico no Cron de Cobranças: ${error?.message || error}`);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
