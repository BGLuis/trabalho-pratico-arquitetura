# Trabalho Prático Arquitetura

Este projeto contém uma API desenvolvida em Node.js (NestJS) com Prisma e banco
de dados PostgreSQL, além de infraestrutura de monitoramento com Prometheus e
Grafana, e testes de carga utilizando o k6. Toda a aplicação e suas dependências
são gerenciadas via Docker.

## Pré-requisitos

Certifique-se de ter os seguintes componentes instalados na sua máquina:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Como executar o projeto

1. Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o
   comando abaixo para construir a imagem da API e subir todos os serviços em
   segundo plano:

   ```bash
   docker compose up -d --build
   ```

2. Após os containers subirem e inicializarem, os seguintes serviços estarão
   disponíveis:
   - **API (NestJS)**: [http://localhost:3000](http://localhost:3000)
   - **PostgreSQL**: porta `5432`
   - **Prometheus**: [http://localhost:9090](http://localhost:9090)
   - **Grafana**: [http://localhost:3001](http://localhost:3001)

   _O container da API executa automaticamente a criação/sincronização das
   tabelas no banco de dados através do comando `prisma db push` antes de
   iniciar._

### Acessando o Grafana

Para visualizar os dashboards de monitoramento no Grafana, acesse
[http://localhost:3001](http://localhost:3001). Utilize as credenciais padrão
definidas na configuração:

- **Usuário**: `admin`
- **Senha**: `admin`

## Como executar os testes de carga (k6)

O projeto inclui uma suíte de testes de carga pré-configurada utilizando o
**k6**.

1. Certifique-se de que a API e os demais serviços estejam rodando.
2. Para rodar os testes, execute o docker-compose específico para o k6 na raiz
   do projeto:

   ```bash
   docker compose -f docker-compose.k6.yml up
   ```

Isso fará com que o k6 inicie um container temporário, execute o script de teste
de carga localizado em `./k6/scripts/test-load.js` e exiba o relatório de
desempenho no terminal.

## Como parar os serviços

Para parar os containers e removê-los, execute o comando abaixo na raiz do
projeto:

```bash
docker compose down -v
```
