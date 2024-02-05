## Ilia Technical Test

O teste técnico da Ília consistiu no desenvolvimento de um servidor `http` de gerenciamento de cartão ponto.  Basicamente há duas rotas `/v1/folhas-de-ponto (GET)` e `/v1/batidas (POST)`, são responsáveis, respectivamente, por gerar relatório mensal do cartão ponto e criar uma nova batida. Embora seja um sistema simples, busquei utilizar arquitetura limpa para que o código seja de fácil compreensão e escalável, permitindo o aumento de sua complexidade. A pasta `dominio` é onde estão todas as regras de negócio, enquanto que a `infra` é parte específica para servidor `web` e persistência. Para simplificar o projeto, a persistencia é feita de forma local `infra/relogio-em-memoria.repositorio.ts`, entretanto, pode ser facilmente alterada para utilizar banco de dados. Já para o servidor `web` foi utilizado framework `NestJS`.

#### Disclaimer
Programei tudo em português para seguir o padrão que foi solicitado.

## Como executar o projeto
1. `git clone https://github.com/lva98/Ilia-Technical-Test`
2. `cd Ilia-Technical-Test`
3. `docker build -t ilia-technical-test .`
4. `podman run -p 3000:3000 --name ilia-technical-test -it ilia-technical-test`

## Como executar os testes
1. Para teste de integração execute `podman exec -it ilia-technical-test pnpm test:e2e`
2. Para teste unitário execute `podman exec -it ilia-technical-test pnpm test`

## Testes

### Testes unitários
Ao utilizar a arquitetura limpa houve um desacoplamento das regras de negócio, dessa forma, propiciando a criação de testes unitários no domínio da aplicação. Basicamente, os testes unitários consistem em validar as regras de negócio implementadas nos casos de uso `bater-ponto.caso-de-uso` e `gerar-folha-ponto.caso-de-uso`. Além disso, alguns testes unitários foram criados para validar `relogio-em-memoria.repositorio` que está na camada de infraestrutura.

#### Testes implementados para validar `bater-ponto.caso-de-uso`
1. Disparar erro ao não informar entrada
2. Disparar erro ao informar entrada inválida
3. Não deve cadastrar horário sábado ou domingo
4. Não deve permitir cadastrar o mesmo horário
5. Não deve haver mais que 4 pontos cadastros por dia
6. Disparar erro ao tentar cadastrar menos que uma 1 de intervalo de almoço
7. Deve permitir cadastrar 1 hora de almoço

#### Testes implementados para validar `gerar-folha-ponto.caso-de-uso`
1. Deve calcular corretamente o relatório com horas excendentes
2. Deve calcular corretamente o relatório com horas devidas

#### Testes implementados para validar `relogio-em-memoria.repositorio`
1. Deve poder cadastrar 4 pontos em ordem
2. Deve poder cadastrar 4 pontos fora de ordem e ordená-los
3. Deve retornar uma lista vazia quando não é cadastrado ponto
4. Deve retornar a lista de pontos cadastrada no dia especificado

### Testes de Integração
Os testes de integração consistiram em subir o servidor e validar o funcionamento das rotas. Sua implementação pode ser encontrada em `test/epp.e2e-spec.ts`. Basicamente são testadas as duas rotas disponíveis no servidor `web`.
1. `/v1/batidas (POST)`, cria uma nova batida, assim verificando se a rota está em funcionamento como o esperado
2. `/v1/folhas-de-ponto (GET)`, busca uma folha de ponto e verifica se a rota respondeu corretamente os valores

## Documentação API

Esse projeto seguiu a risca a documentação da `API` solicitada, assim, toda informação necessária estará descrita no arquivo `api.yaml` que pode ser aberto no `Swager Editor`.
