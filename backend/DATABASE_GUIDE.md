# Guía de Migraciones con Alembic y SQLModel 🚀

Esta guía explica el flujo de trabajo para gestionar cambios en la base de datos de Salitrex.

## 📌 Requisitos Previos

Antes de trabajar con migraciones, asegúrate de:
1. Tener el entorno virtual activo: `source venv/bin/activate` (Mac/Linux) o `venv\Scripts\activate` (Windows).
2. Tener configurado el archivo `.env` en la carpeta `backend/`.

---

## 🛠️ Flujo 1: Crear una nueva migración (Modificaste Modelos)

Si has añadido un campo, creado una nueva tabla o cambiado un tipo de dato en tus archivos `models.py`, sigue estos pasos:

### 1. Registrar el modelo (Paso Crítico)
Alembic no adivina qué archivos existen. Debes asegurarte de que tu nuevo modelo esté importado en `backend/alembic/env.py`.
Busca la sección de imports y añade el tuyo:
```python
from app.modules.mi_modulo.models import MiModelo
```

### 2. Generar la revisión automática
Ejecuta el siguiente comando para que Alembic compare tus modelos con la base de datos actual:
```bash
alembic revision --autogenerate -m "nombre_de_la_migracion"
```
*Esto creará un nuevo archivo en `backend/alembic/versions/`.*

### 3. Revisar el archivo generado 🔍
**Nunca confíes al 100% en el autogenerate.** Abre el archivo recién creado y verifica que las funciones `upgrade` y `downgrade` reflejen exactamente lo que quieres hacer.

### 4. Aplicar los cambios
Para que las tablas se creen/actualicen realmente en tu base de datos:
```bash
alembic upgrade head
```

### 5. Poblar la base de datos (Seeders) 🌱
Para crear datos de prueba iniciales (como el usuario administrador):
```bash
python3 -m app.core.seeders
```
*Esto creará el usuario `admin@salitrex.com` con la contraseña `admin123`.*

---

## 🤝 Flujo 2: Nuevo Colaborador (Heredar migraciones)

Si un compañero acaba de clonar el proyecto o tú has bajado cambios de Git que incluyen nuevas migraciones:

### 1. Actualizar dependencias (si es necesario)
```bash
pip install -r requirements.txt
```

### 2. Sincronizar la base de datos
El colaborador **no necesita** hacer el `revision --autogenerate`. Solo debe aplicar los archivos que ya existen en la carpeta `versions/`:
```bash
alembic upgrade head
```
*Alembic detectará qué versiones le faltan y las aplicará en orden.*

---

## 💡 Comandos Útiles

- **Ver el estado actual**: ¿En qué migración estoy?
  ```bash
  alembic current
```

- **Ver el historial**: Todas las migraciones creadas.
  ```bash
  alembic history --verbose
```

- **Deshacer la última migración**:
  ```bash
  alembic downgrade -1
```

- **Ir a una versión específica**:
  ```bash
  alembic upgrade <revision_id>
```

---

## ⚠️ Notas Importantes
- **SQLModel metadata**: Alembic usa `target_metadata = SQLModel.metadata` en `env.py`. Por eso es vital que todos los modelos se importen allí; si no se importan, `SQLModel` no los conoce y Alembic pensará que las tablas deben ser borradas.
- **SQLite**: Si trabajas con SQLite, recuerda que Alembic tiene limitaciones para borrar o modificar columnas (debido a limitaciones de SQLite). En esos casos, a veces es más fácil borrar el archivo `.db` y hacer `upgrade head` desde cero si el proyecto está en etapas iniciales.
