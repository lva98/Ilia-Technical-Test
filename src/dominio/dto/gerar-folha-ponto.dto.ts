import ExpedienteEntidade from '../entidades/expediente.entidade';

export type GerarFolhaPontoInput = string;

export interface GerarFolhaPontoOutput {
  anoMes: string;
  horasTrabalhadas: string;
  horasExcendentes: string;
  horasDevidas: string;
  expedientes: ExpedienteEntidade[];
}
