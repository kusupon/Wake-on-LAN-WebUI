FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN [ -f devices.json ] || echo '[]' > devices.json

RUN go build -o server .

EXPOSE 8008

CMD ["./server"]