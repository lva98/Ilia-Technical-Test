import ExpedienteEntidade from "../entidades/expediente.entidade"

/**
 * Abstração para acessar os dados do relógio ponto
 */
export interface ReologioRepositorio {
  /**
   * Registra o 'momento' que o usuário bateu o ponto
   * 
   * @param momento - Uma string que representa o momento ISO 8601 em que o ponto foi batido. 
   * @returns Todos os horários cadastrados no relógio do dia em específico
   */
  baterHorario (momento: string): Promise<string[]>

  /**
   * Busca todos os pontos batidos no dia solicitado
   * 
   * @param data - Formato yyyy-MM-dd
   * @returns Todos os horários cadastrados no relógio do dia em específico
   */
  buscarPontosDoDia (data: string): Promise<string[]>


  /**
   * Retorna o expediente mensal
   * 
   * @param anoMes - Formato yyyy-MM
   * @returns Expediente mensal
   */
  buscarExpedientesDoMes (anoMes: string): Promise<ExpedienteEntidade[]>
}
