import { BadRequestException, ConflictException } from '@nestjs/common';
import { BaterPontoInput, BaterPontoOutput } from '../dto/bater-ponto.dto';
import VerificaIso8601Utils from '../utilidades/verifica-iso8601';
import { differenceInHours, isWeekend } from 'date-fns';
import ExtraiDataIso8601Utils from '../utilidades/extrai-data-iso8601';
import ExtraiHorarioIso8601Utils from '../utilidades/extrai-horario-iso8601';
import { ReologioRepositorio } from '../repositorio/relogio.repositorio';

class BaterPontoCasoDeUso {
  constructor (
    private readonly repositorio: ReologioRepositorio
  ) {}
    
  private validate (input: BaterPontoInput) {
    if (!input || !input.momento) {
      throw new BadRequestException({
        mensagem: 'Campo obrigatório não informado'
      })
    }

    if (!VerificaIso8601Utils(input.momento)) {
      throw new BadRequestException({
        mensagem: 'Formato inválido, utilize ISO 8601'
      })
    }

    if (isWeekend(new Date(input.momento))) {
      throw new BadRequestException({
        mensagem: 'Sábado e domingo não são permitidos como dia de trabalho'
      })
    }
  }

  public async execute (input: BaterPontoInput): Promise<BaterPontoOutput> {
    this.validate(input)

    const data = ExtraiDataIso8601Utils(input.momento)
    const ponto = ExtraiHorarioIso8601Utils(input.momento)
    const pontos = await this.repositorio.buscarPontosDoDia(data)

    if (pontos.length >= 4) {
      throw new BadRequestException({
        mensagem: 'Apenas 4 horários podem ser registrados por dia'
      })
    }

    if (pontos.includes(ponto)) {
      throw new ConflictException({
        mensagem: 'Horário já registrado'
      })
    }

    /* 
    Organiaza os pontos com a nova batida
    */
    pontos.push(ponto)
    pontos.sort()

    /*
    Se o ponto for entrada ou saída de almoço,
    verifica horário mínimo de 1 hora
    */
    if (pontos[1] && pontos[2] &&
       (ponto === pontos[1] || ponto === pontos[2])
    ) {
      const data1 = new Date(`${data}T${pontos[1]}`)
      const data2 = new Date(`${data}T${pontos[2]}`)
      const tempoAlmoco = differenceInHours(data2, data1)
      if (tempoAlmoco < 1) {
        throw new BadRequestException({
          mensagem: 'Deve haver no mínimo 1 hora de almoço'
        })
      }
    }

    /*
    Ao fim, é criado uma nova batida no relógio ponto
    */
    const novosPontos = await this.repositorio.baterHorario(input.momento)
    return {
      dia: data,
      pontos: novosPontos
    }
  }
}

export default BaterPontoCasoDeUso;
