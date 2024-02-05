import { ReologioRepositorio } from "../repositorio/relogio.repositorio"
import GerarFolhaPontoCasoDeUso from "./gerar-folha-ponto.caso-de-uso"

describe('Gerar folha ponto caso de uso', () => {
  let repositorio: jest.Mocked<ReologioRepositorio>

  beforeAll(() => {
    repositorio = {
      baterHorario: jest.fn(),
      buscarPontosDoDia: jest.fn(),
      buscarExpedientesDoMes: jest.fn()
    }
  })

  it('Deve calcular corretamente o relatório com horas excendentes', async () => {
    const casoDeUso = new GerarFolhaPontoCasoDeUso(repositorio) 
    repositorio.buscarExpedientesDoMes.mockResolvedValue([
      {
        dia: '2024-01-01',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '17:05:05']
      },
      {
        dia: '2024-01-02',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '17:05:05']
      }
    ])

    const result = await casoDeUso.execute('2024-01')
    expect(result.horasTrabalhadas).toBe('PT16H10M10S')
    expect(result.horasDevidas).toBe('PT0S')
    expect(result.horasExcendentes).toBe('PT10M10S')
  })

  it('Deve calcular corretamente o relatório com horas devidas', async () => {
    const casoDeUso = new GerarFolhaPontoCasoDeUso(repositorio) 
    repositorio.buscarExpedientesDoMes.mockResolvedValue([
      {
        dia: '2024-01-01',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '16:00:00']
      },
      {
        dia: '2024-01-02',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '16:58:10']
      }
    ])

    const result = await casoDeUso.execute('2024-01')
    expect(result.horasTrabalhadas).toBe('PT14H58M10S')
    expect(result.horasDevidas).toBe('PT1H1M50S')
    expect(result.horasExcendentes).toBe('PT0S')
  })
})