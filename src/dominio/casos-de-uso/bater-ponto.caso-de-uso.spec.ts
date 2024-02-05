import { BadRequestException, ConflictException } from "@nestjs/common"
import { ReologioRepositorio } from "../repositorio/relogio.repositorio"
import BaterPontoCasoDeUso from "./bater-ponto.caso-de-uso"

describe('Bater ponto caso de uso', () => {
  let repositorio: jest.Mocked<ReologioRepositorio>

  beforeAll(() => {
    repositorio = {
      baterHorario: jest.fn(),
      buscarPontosDoDia: jest.fn(),
      buscarExpedientesDoMes: jest.fn()
    }
  })

  it('Disparar erro ao não informar entrada', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    await expect(casoDeUso.execute({ momento: undefined }))
      .rejects
      .toThrow(BadRequestException)

    await expect(casoDeUso.execute(undefined))
      .rejects
      .toThrow(BadRequestException)
  })

  it('Disparar erro ao informar entrada inválida', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    await expect(casoDeUso.execute({ momento: 'ABCDEFGH' }))
      .rejects
      .toThrow(BadRequestException)
  })

  it('Não deve cadastrar horário sábado ou domingo', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    await expect(casoDeUso.execute({ momento: '2024-01-06T00:00:00' }))
      .rejects
      .toThrow(BadRequestException)
  })

  it('Não deve permitir cadastrar o mesmo horário', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    repositorio.buscarPontosDoDia.mockResolvedValue(['08:00:00'])
    await expect(casoDeUso.execute({ momento: '2024-01-04T08:00:00' }))
      .rejects
      .toThrow(ConflictException)
  })

  it('Não deve haver mais que 4 pontos cadastros por dia', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    repositorio.buscarPontosDoDia.mockResolvedValue(['08:00:00', '12:00:00', '13:00:00', '18:00:00'])
    await expect(casoDeUso.execute({ momento: '2024-01-05T00:00:00' }))
      .rejects
      .toThrow(BadRequestException)
  })

  it('Disparar erro ao tentar cadastrar menos que uma 1 de intervalo de almoço', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    repositorio.buscarPontosDoDia.mockResolvedValue(['08:00:00', '12:00:00'])
    await expect(casoDeUso.execute({ momento: '2024-01-05T12:10:00' }))
      .rejects
      .toThrow(BadRequestException)
  })

  it('Deve permitir cadastrar 1 hora de almoço', async () => {
    const casoDeUso = new BaterPontoCasoDeUso(repositorio) 
    repositorio.buscarPontosDoDia.mockResolvedValue(['08:00:00', '12:00:00'])
    repositorio.baterHorario.mockResolvedValue(['08:00:00', '12:00:00', '13:00:00'])
    expect(await casoDeUso.execute({ momento: '2024-01-05T13:00:00' }))
      .toStrictEqual({
        dia: '2024-01-05',
        pontos: ['08:00:00', '12:00:00', '13:00:00']
      })
  })
})