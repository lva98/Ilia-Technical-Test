import { BadRequestException, NotFoundException } from "@nestjs/common";
import { GerarFolhaPontoInput, GerarFolhaPontoOutput } from "../dto/gerar-folha-ponto.dto";
import { ReologioRepositorio } from "../repositorio/relogio.repositorio";
import CalculaExpedienteSegundosUtils from "../utilidades/calcula-expediente-segundos";
import segundosParaDuracao from "../utilidades/sugundos-para-duracao";

class GerarFolhaPontoCasoDeUso {
  constructor (
    private readonly repositorio: ReologioRepositorio
  ) { }

  private validar (input: GerarFolhaPontoInput) {
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(input)) {
      throw new BadRequestException({
        mensagem: 'Formato inválido de entrada'
      })
    }
  }

  public async execute (input: GerarFolhaPontoInput): Promise<GerarFolhaPontoOutput> {
    this.validar(input)

    const expedientes = await this.repositorio.buscarExpedientesDoMes(input)
    if (!expedientes) {
      throw new NotFoundException({
        mensagem: 'Relatório não encontrado'
      })
    }

    // Considerando jornada semanal de 40  horas
    // A jornada diária de trabalho terá 28800 segundos
    const jornada = 28800
    let segundosTrabalhados = 0
    let segundosExcedentes = 0
    let segundosDevidos = 0

    for (const expediente of expedientes) {
      const segundos = CalculaExpedienteSegundosUtils(expediente)
      segundosTrabalhados += segundos

      if (segundos > jornada) {
        segundosExcedentes += (segundos - jornada)
      } else if (segundos < jornada) {
        segundosDevidos += (jornada - segundos)
      }
    }

    return {
      anoMes: input,
      horasTrabalhadas: segundosParaDuracao(segundosTrabalhados),
      horasExcendentes: segundosParaDuracao(segundosExcedentes),
      horasDevidas: segundosParaDuracao(segundosDevidos),
      expedientes
    }
  }
}

export default GerarFolhaPontoCasoDeUso;
