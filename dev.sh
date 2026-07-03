#!/bin/bash
# dev.sh — Inicia el frontend y el backend al mismo tiempo.
# Uso: ./dev.sh

# Colores
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
BLUE='\033[0;34m'
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
  trap - SIGINT SIGTERM # Evitar recursión infinita
  echo -e "\n${YELLOW}[dev]${NC} Deteniendo servidores..."
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM

# Función para liberar puertos
free_port() {
  local port=$1
  if command -v fuser >/dev/null 2>&1; then
    if fuser $port/tcp >/dev/null 2>&1; then
      echo -e "${YELLOW}[dev]${NC} Puerto $port ocupado. Terminando procesos..."
      fuser -k -9 $port/tcp >/dev/null 2>&1
      sleep 1
    fi
  elif command -v lsof >/dev/null 2>&1; then
    local pids=$(lsof -t -i:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
      echo -e "${YELLOW}[dev]${NC} Puerto $port ocupado. Terminando procesos..."
      kill -9 $pids 2>/dev/null
      sleep 1
    fi
  fi
}

# Backend
free_port 8000
echo -e "${MAGENTA}[backend]${NC} Iniciando uvicorn..."
(
  source "$VENV_PATH"
  cd "$BACKEND_DIR"
  uvicorn app.main:app --reload --use-colors 2>&1 | awk -v prefix="\033[0;35m[back]\033[0m " '{print prefix $0; fflush()}'
) &
BACKEND_PID=$!

# Frontend
free_port 5173
echo -e "${BLUE}[frontend]${NC} Iniciando bun dev..."
(
  cd "$FRONTEND_DIR"
  FORCE_COLOR=1 bun run dev 2>&1 | awk -v prefix="\033[0;34m[front]\033[0m " '{print prefix $0; fflush()}'
) &
FRONTEND_PID=$!

echo -e "${CYAN}[dev]${NC} Servidores corriendo. Presiona ${YELLOW}Ctrl+C${NC} para detener ambos.\n"

# Esperar a que ambos terminen
wait $BACKEND_PID $FRONTEND_PID
