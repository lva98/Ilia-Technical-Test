import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import RelogioEmMemoriaRepositorio from "../repositorios/relogio-em-memoria.repositorio";
import BaterPontoCasoDeUso from "src/dominio/casos-de-uso/bater-ponto.caso-de-uso";
import GerarFolhaPontoCasoDeUso from "src/dominio/casos-de-uso/gerar-folha-ponto.caso-de-uso";

@Controller('/v1/')
export default class V1Controlador {
  constructor (
    private readonly relogioEmMemoria: RelogioEmMemoriaRepositorio
  ) {}

  @Post('batidas/')
  @HttpCode(201)
  async v1Batidas (@Body() body: any) {
    const baterPontoCasoDeUso = new BaterPontoCasoDeUso(this.relogioEmMemoria)
    return await baterPontoCasoDeUso.execute(body)
  }

  @Get('folhas-de-ponto/:anoMes')
  async v1FolhasDePonto (@Param('anoMes') anoMes: string) {
    const gerarFolhaPontoCasoDeUso = new GerarFolhaPontoCasoDeUso(this.relogioEmMemoria)
    return await gerarFolhaPontoCasoDeUso.execute(anoMes)
  }
}
