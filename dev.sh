#!/bin/bash
# dev.sh — Inicia el frontend y el backend al mismo tiempo.
# Uso: ./dev.sh

# Colores
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV_PATH="$BACKEND_DIR/venv/bin/activate"

echo -e "${CYAN}╔══════════════════════════════════╗${NC}"
echo -e "${CYAN}║      Salitrex Dev Server         ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════╝${NC}"

# Verificar que el venv existe
if [ ! -f "$VENV_PATH" ]; then
  echo -e "${RED}[ERROR]${NC} No se encontró el virtual environment en $VENV_PATH"
  echo -e "Crea uno con: ${YELLOW}cd backend && python -m venv venv${NC}"
  exit 1
fi

# Función para matar procesos hijos al salir (Ctrl+C)
cleanup() {
  echo -e "\n${YELLOW}[dev]${NC} Deteniendo servidores..."
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM

# Backend
echo -e "${GREEN}[backend]${NC} Iniciando uvicorn..."
(
  source "$VENV_PATH"
  cd "$BACKEND_DIR"
  uvicorn app.main:app --reload
) &
BACKEND_PID=$!

# Frontend
echo -e "${GREEN}[frontend]${NC} Iniciando bun dev..."
(
  cd "$FRONTEND_DIR"
  bun run dev
) &
FRONTEND_PID=$!

echo -e "${CYAN}[dev]${NC} Servidores corriendo. Presiona ${YELLOW}Ctrl+C${NC} para detener ambos.\n"

# Esperar a que ambos terminen
wait $BACKEND_PID $FRONTEND_PID
