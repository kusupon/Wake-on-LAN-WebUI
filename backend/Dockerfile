FROM golang:latest

WORKDIR /app

COPY . .

RUN go mod download

EXPOSE 8008

CMD ["air", "-c", ".air.toml"]