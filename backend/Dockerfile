FROM golang:1.26.5-alpine3.24 AS builder

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /server .

FROM alpine:3.24.1

RUN addgroup -S app \
    && adduser -S -G app app \
    && apk add --no-cache su-exec

WORKDIR /data

COPY --from=builder --chown=app:app /server /server

RUN echo '[]' > devices.json

EXPOSE 8008

CMD ["sh", "-c", "[ -f devices.json ] || echo '[]' > devices.json; chown app:app devices.json; exec su-exec app /server"]
