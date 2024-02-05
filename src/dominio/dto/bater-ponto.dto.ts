import ExpedienteEntidade from '../entidades/expediente.entidade';

export interface BaterPontoInput {
  momento: string;
}

export type BaterPontoOutput = ExpedienteEntidade;
