# vstream-api

![Badge de Status](https://img.shields.io/badge/status-beta-blue)

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Testes](#testes)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

## Sobre

O **vstream-api** é uma API desenvolvida para interagir com videos do YouTube. Este projeto está atualmente em desenvolvimento com status Beta e tem como objetivo principal pegar informações de videos e baixar os mesmos.

## Funcionalidades

- Pegar informações sobre o video. 
- Baixar o video nos formatos selecionados.

## Tecnologias Utilizadas

- NestJs
- @distube/ytdl-core

## Instalação

Para instalar e executar este projeto localmente, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/viniciusjosedev/vstream-api.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd vstream-api
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente conforme o arquivo `.env.example`:

```bash
# SET development OR test OR production
NODE_ENV=

# BY DEFAULT IS 8080
PORT=

# JWT SETTINGS
JWT_SECRET=
JWT_EXPIRES=
JWT_PASSPHRASE=

# COOKIES (SET IN JSON FORMAT WITH SINGLE QUOTES, REQUIRED ONLY IN PRODUCTION)
COOKIES=
```

5. Inicie o servidor:
   ```bash
   npm run start
   ```
Ou se preferir, inicie com Docker:
```bash
npm run docker:up
```

## Como Usar

Após iniciar o servidor, você pode acessar a API através do endpoint:

```
http://localhost:8080/
```

Utilize ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar os endpoints disponíveis.

## Testes

Para executar os testes unitários, utilize o comando:

```bash
npm run test
```

Pra testes de integração, utilize o comando:

```bash
npm run test:e2e
```

Caso queira rodar os testes dentro do docker, utilize o comando:

```bash
npm run docker:attach
```

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests. Para maiores informações, consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Contato

Para mais informações, entre em contato com [Vinicius José](mailto:viniciusjosedev@gmail.com).

---

Este modelo de README é baseado nas melhores práticas recomendadas pela comunidade. Para mais detalhes, consulte os seguintes recursos:

- [Como fazer um bom README](https://blog.rocketseat.com.br/como-fazer-um-bom-readme/)
- [Como escrever um README incrível no seu Github - Alura](https://www.alura.com.br/artigos/escrever-bom-readme)
- [Um modelo para fazer um bom README.md - GitHub Gist](https://gist.github.com/lohhans/f8da0b147550df3f96914d3797e9fb89)

Além disso, você pode assistir ao seguinte vídeo para entender melhor como criar um README eficaz:

[Como fazer um bom README](https://www.youtube.com/watch?v=k4Rsy8GbKE0&utm_source=chatgpt.com)
