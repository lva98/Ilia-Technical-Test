import { differenceInSeconds } from "date-fns";
import ExpedienteEntidade from "../entidades/expediente.entidade";

const CalculaExpedienteSegundosUtils = (expediente: ExpedienteEntidade): number => {
  let segundos = 0

  // Calcula primeiro turno
  if (expediente.pontos[0] && expediente.pontos[1]) {
    const data1 = new Date(`${expediente.dia}T${expediente.pontos[0]}`)
    const data2 = new Date(`${expediente.dia}T${expediente.pontos[1]}`)
    segundos += differenceInSeconds(data2, data1)
  }

  // Calcula segundo turno
  if (expediente.pontos[1] && expediente.pontos[2]) {
    const data1 = new Date(`${expediente.dia}T${expediente.pontos[2]}`)
    const data2 = new Date(`${expediente.dia}T${expediente.pontos[3]}`)
    segundos += differenceInSeconds(data2, data1)
  }

  return segundos
}

export default CalculaExpedienteSegundosUtils
