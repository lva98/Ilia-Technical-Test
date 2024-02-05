import { Module } from "@nestjs/common";
import V1Controlador from "./controladores/v1.controlador";
import RelogioEmMemoriaRepositorio from "./repositorios/relogio-em-memoria.repositorio";

@Module({
  controllers: [V1Controlador],
  providers: [RelogioEmMemoriaRepositorio]
})
export default class InfraModule {}
