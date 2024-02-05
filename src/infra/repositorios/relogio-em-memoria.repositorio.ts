import { Injectable } from "@nestjs/common";
import ExpedienteEntidade from "src/dominio/entidades/expediente.entidade";
import { ReologioRepositorio } from "src/dominio/repositorio/relogio.repositorio";
import ExtraiAnoMesIso8601Utils from "src/dominio/utilidades/extrai-ano-mes-iso8601";
import ExtraiDataIso8601Utils from "src/dominio/utilidades/extrai-data-iso8601";
import ExtraiHorarioIso8601Utils from "src/dominio/utilidades/extrai-horario-iso8601";

interface Data {
  anoMes: string;
  expedientes: {
    dia: string,
    pontos: string[]
  }[]
}

@Injectable()
class RelogioEmMemoriaRepositorio implements ReologioRepositorio {
  private memoria: Record<string, Data> = {} 

  public async baterHorario (momento: string): Promise<string[]> {
    const anoMes = ExtraiAnoMesIso8601Utils(momento)
    const dia = ExtraiDataIso8601Utils(momento)
    const horario = ExtraiHorarioIso8601Utils(momento)

    if (!this.memoria[anoMes]) {
      this.memoria[anoMes] = {
        anoMes,
        expedientes: []
      }
    }

    let expediente = this.memoria[anoMes].expedientes.find(expediente => expediente.dia === dia)
    if (!expediente) {
      expediente = { dia, pontos: [horario] }
      this.memoria[anoMes].expedientes.push(expediente)
    } else {
      expediente.pontos.push(horario)
      expediente.pontos.sort()
    }

    return Array.from(expediente.pontos)
  }

  public async buscarPontosDoDia (data: string): Promise<string[]> {
    const anoMes = data.substring(0, 7)

    if (!this.memoria[anoMes] ||
        !this.memoria[anoMes].expedientes ||
        this.memoria[anoMes] .expedientes.length === 0
    ) {
      return []
    }

    const expedientes = this.memoria[anoMes].expedientes
    const expediente = expedientes.find(expediente => expediente.dia === data)
    if (!expediente || !expediente.pontos) {
      return []
    }

    return Array.from(expediente.pontos)
  }

  async buscarExpedientesDoMes(anoMes: string): Promise<ExpedienteEntidade[] | undefined> {
    // FIX: Retornar uma cópia ao invés da referência
    return this.memoria[anoMes]?.expedientes
  }
}

export default RelogioEmMemoriaRepositorio
