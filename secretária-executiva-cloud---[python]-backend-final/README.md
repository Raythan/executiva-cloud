# Secretária Executiva Cloud - Pacote de Implantação

Este pacote contém tudo o que é necessário para implantar a aplicação Secretária Executiva Cloud usando Docker.

## Pré-requisitos

- Docker e Docker Compose instalados no seu servidor/host.

## Como Implantar

Siga os passos abaixo no diretório onde este arquivo `README.md` está localizado.

### 1. Construir e Iniciar o Serviço

O `docker-compose` cuidará de construir a imagem do Docker a partir do `Dockerfile` e iniciar o contêiner. Execute o seguinte comando:

```bash
docker-compose up --build -d
```

- `--build`: Garante que a imagem Docker seja (re)construída com base no código atual.
- `-d`: (detached mode) Executa o contêiner em segundo plano.

### 2. Acessando a Aplicação

Após a conclusão do comando, a aplicação estará disponível no seu navegador no seguinte endereço:

[http://localhost:8000](http://localhost:8000)

(Se você estiver implantando em um servidor remoto, substitua `localhost` pelo endereço IP do servidor).

### 3. Verificando os Logs (Opcional)

Se precisar verificar os logs da aplicação em execução, use o comando:

```bash
docker-compose logs -f
```

### 4. Parando a Aplicação

Para parar o serviço, execute:

```bash
docker-compose down
```

Isso irá parar e remover o contêiner, mas seus dados do banco de dados serão preservados no volume `database` local, graças à configuração no `docker-compose.yml`.
