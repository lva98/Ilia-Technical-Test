import RelogioEmMemoriaRepositorio from "./relogio-em-memoria.repositorio"

describe('Relógio em meória repositório', () => {
  let relogioRepositorio: RelogioEmMemoriaRepositorio

  beforeEach(() => {
    relogioRepositorio = new RelogioEmMemoriaRepositorio()
  })

  it('Deve cadastrar 4 pontos em ordem', async () => {
    await relogioRepositorio.baterHorario('2024-01-01T08:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T12:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T14:00:00')
    const pontos = await relogioRepositorio.baterHorario('2024-01-01T18:00:00')
    expect(pontos).toEqual(['08:00:00', '12:00:00', '14:00:00', '18:00:00'])
  })

  it('Deve cadastrar 4 pontos fora de ordem e ordená-los', async () => {
    await relogioRepositorio.baterHorario('2024-01-01T14:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T12:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T08:00:00')
    const pontos = await relogioRepositorio.baterHorario('2024-01-01T18:00:00')
    expect(pontos).toEqual(['08:00:00', '12:00:00', '14:00:00', '18:00:00'])
  })

  it('Deve retornar uma lista vazia quando não é cadastrado ponto', async () => {
    const pontos = await relogioRepositorio.buscarPontosDoDia('2024-01-01')
    expect(pontos).toEqual([])
  })

  it('Deve retornar a lista de pontos cadastrada no dia especificado', async () => {
    await relogioRepositorio.baterHorario('2024-01-01T14:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T12:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T08:00:00')
    await relogioRepositorio.baterHorario('2024-01-01T18:00:00')
    const pontos = await relogioRepositorio.buscarPontosDoDia('2024-01-01')
    const pontosVazio = await relogioRepositorio.buscarPontosDoDia('2024-01-02')
    expect(pontos).toEqual(['08:00:00', '12:00:00', '14:00:00', '18:00:00'])
    expect(pontosVazio).toEqual([])
  })
})