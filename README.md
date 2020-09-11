# A socialist social network written in Svelte + Sapper

## System dependencies

- Node.JS
- Docker or Minio

## Installation

### NodeJS dependencies

```bash
npm install && npm install --only=dev
```

### Local minio
```bash
mkdir -p $HOME/minio
docker run -d -p 9000:9000 -e MINIO_ACCESS_KEY=minioadmin \
                        -e MINIO_SECRET_KEY=minioadmin \
                        -v /mnt/data:$HOME/data minio/minio server /data
```

## Run

```bash
npm run dev
```

