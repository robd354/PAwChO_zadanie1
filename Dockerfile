# Używamy obrazu node alpine z określoną wersją
FROM node:18-alpine AS deps-builder

# Zminimalizowane pakiety systemowe do pobrania curl
RUN apk add --no-cache curl

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy plik package.json oraz instalujemy zależności npm
COPY package.json package-lock.json ./
RUN npm ci

# Kopiujemy resztę źródeł
COPY . .

# Używamy obrazu node:18-alpine
FROM node:18-alpine AS runtime

# Ustawiamy autora obrazu
LABEL org.opencontainers.image.authors="Robert Dajek"

# Tworzymy nieuprzywilejowaną grupę i użytkownika
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy zbudowaną aplikację
COPY --from=deps-builder /app /app

# Przełączamy się na nieuprzywilejowanego usera
USER appuser

# Dokumentujemy port
EXPOSE 3000

# Healthcheck, który sprawdza dostępność aplikacji co 15 sekund
HEALTHCHECK --interval=15s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1

# Uruchomienie aplikacji
CMD ["node", "index.js"]
