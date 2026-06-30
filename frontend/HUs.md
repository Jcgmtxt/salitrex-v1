# Salitrex Frontend — Historias de Usuario

> **Producto**: Salitrex — Sistema de Gestión de Taller Automotriz  
> **Enfoque**: Mobile First · Dark Premium Theme  
> **Stack**: React 19 + TypeScript + Vite 8 + TanStack Router + Shadcn/UI + Tailwind v4  
> **API Base**: `http://localhost:8000/api/v1`

---

## Feature 1: Fundación y Login

### HU-01: Login de usuario
**Como** operador o administrador del taller  
**Quiero** iniciar sesión con mi email y contraseña  
**Para** acceder al sistema de gestión de forma segura  

**Criterios de Aceptación:**
- [ ] La pantalla de login se muestra como página principal cuando no hay sesión activa
- [ ] El formulario tiene campos de email y contraseña con validación en tiempo real (Zod)
- [ ] Email: formato válido requerido. Contraseña: mínimo 8 caracteres
- [ ] Al enviar credenciales válidas (`POST /auth/login` — OAuth2PasswordRequestForm), se recibe `access_token`, `name`, `email`, `role`
- [ ] El token JWT se almacena en localStorage y se inyecta automáticamente como `Authorization: Bearer <token>` en todas las peticiones siguientes
- [ ] Se almacenan en estado global (Zustand): `name`, `email`, `role` del usuario autenticado
- [ ] Si las credenciales son inválidas, se muestra mensaje de error claro sin recargar la página
- [ ] Tras login exitoso, se redirige al Dashboard (`/dashboard`)
- [ ] Si el token expira o es inválido (401), se redirige automáticamente al login

**Endpoint**: `POST /api/v1/auth/login`  
**Request**: `application/x-www-form-urlencoded` — `username` (email), `password`  
**Response**: `{ access_token, token_type, name, email, role }`

---

### HU-02: Shell de la aplicación (Layout principal)
**Como** usuario autenticado  
**Quiero** ver una interfaz con navegación clara adaptada a mi dispositivo  
**Para** moverme entre las secciones de la aplicación de forma rápida  

**Criterios de Aceptación:**
- [ ] **Mobile (< 768px)**: Bottom navigation bar fija con iconos + labels para: Dashboard, Clientes, Entradas, Pintura
- [ ] **Desktop (≥ 768px)**: Sidebar colapsable a la izquierda con los mismos ítems + sección de Configuración
- [ ] El header muestra el nombre del usuario logueado y un botón de cerrar sesión
- [ ] El ítem de menú activo se resalta visualmente
- [ ] La estética es dark premium (fondo oscuro, acentos vibrantes, bordes sutiles, tipografía moderna)
- [ ] Todas las rutas bajo el layout están protegidas: si no hay token, redirige a `/login`
- [ ] El menú de "Configuración" (usuarios, config pintura) solo es visible para usuarios con `role: admin`

**Notas técnicas:**  
- Implementar como `_authenticated.tsx` layout route en TanStack Router  
- Usar `Sheet` de Shadcn para menú hamburguesa en mobile como alternativa

---

### HU-03: Logout
**Como** usuario autenticado  
**Quiero** cerrar mi sesión  
**Para** proteger mi cuenta cuando dejo de usar el sistema  

**Criterios de Aceptación:**
- [ ] Botón de logout visible en el header (desktop) y en el menú (mobile)
- [ ] Al hacer click, se limpia el token y datos del usuario del store y localStorage
- [ ] Se redirige inmediatamente a la pantalla de login
- [ ] Tras logout, cualquier intento de navegar a rutas protegidas redirige al login

---

## Feature 2: CRM — Clientes

### HU-04: Listar clientes
**Como** operador del taller  
**Quiero** ver la lista de todos los clientes registrados  
**Para** encontrar rápidamente la información de un cliente  

**Criterios de Aceptación:**
- [ ] Se muestra una lista/tarjetas de clientes al entrar a `/clients`
- [ ] Cada ítem muestra: nombre, tipo de documento, número de identidad, teléfono, cantidad de vehículos
- [ ] Los datos se obtienen de `GET /crm/clients`
- [ ] Se muestra skeleton/loading mientras se cargan los datos
- [ ] Si no hay clientes, se muestra un empty state con CTA "Registrar primer cliente"
- [ ] En mobile: lista vertical con tarjetas compactas. En desktop: tabla con columnas

**Endpoint**: `GET /api/v1/crm/clients`  
**Response**: `[{ id, name, document_type, identity_number, email, phone, cars: [...], created_at }]`

---

### HU-05: Buscar clientes
**Como** operador del taller  
**Quiero** buscar clientes por nombre, documento o teléfono  
**Para** encontrar un cliente específico sin recorrer toda la lista  

**Criterios de Aceptación:**
- [ ] Campo de búsqueda visible en la parte superior de la lista de clientes
- [ ] La búsqueda se ejecuta al escribir (debounce 300ms) usando `GET /crm/clients/search?query=...`
- [ ] Los resultados reemplazan la lista completa mientras se busca
- [ ] Si no hay resultados, se muestra mensaje "No se encontraron clientes para '...'"
- [ ] Al limpiar el campo de búsqueda, se restaura la lista completa

**Endpoint**: `GET /api/v1/crm/clients/search?query={term}`

---

### HU-06: Registrar nuevo cliente
**Como** operador del taller  
**Quiero** registrar un nuevo cliente con sus datos  
**Para** tener un registro antes de recibir su vehículo  

**Criterios de Aceptación:**
- [ ] Botón "Nuevo Cliente" visible en la vista de clientes (FAB en mobile, botón en header en desktop)
- [ ] Formulario en modal/drawer con campos: Nombre*, Tipo de Documento* (CC/CE/NIT/Pasaporte), Número de Identidad*, Teléfono*, Email (opcional)
- [ ] Validación Zod: nombre mín. 3 chars, identidad mín. 3 chars, teléfono mín. 3 chars, email formato válido si se proporciona
- [ ] Al guardar exitosamente (`POST /crm/clients`), se cierra el modal, se muestra toast de éxito, y la lista se refresca (invalidar query)
- [ ] Si el número de identidad ya existe (409/400), se muestra error "Cliente con esta identificación ya existe"
- [ ] El botón de guardar se deshabilita mientras se envía la petición

**Endpoint**: `POST /api/v1/crm/clients`  
**Body**: `{ name, document_type, identity_number, email?, phone }`

---

### HU-07: Editar cliente
**Como** operador del taller  
**Quiero** actualizar los datos de un cliente existente  
**Para** mantener la información actualizada  

**Criterios de Aceptación:**
- [ ] Botón de editar disponible en cada tarjeta/fila de cliente
- [ ] Se abre el mismo formulario de HU-06 precargado con los datos actuales
- [ ] Solo los campos modificados se envían (`PUT /crm/clients/{id}`, todos los campos son opcionales en el update)
- [ ] Al guardar, se cierra el modal, toast de éxito, lista se refresca
- [ ] Si hay error de validación del backend, se muestra el mensaje de error

**Endpoint**: `PUT /api/v1/crm/clients/{client_id}`  
**Body**: `{ name?, document_type?, identity_number?, email?, phone? }`

---

### HU-08: Eliminar cliente
**Como** administrador del taller  
**Quiero** eliminar un cliente del sistema  
**Para** mantener la base de datos limpia  

**Criterios de Aceptación:**
- [ ] Botón de eliminar visible **solo para usuarios con rol admin**
- [ ] Al hacer click, se muestra diálogo de confirmación: "¿Eliminar al cliente {nombre}? Esta acción no se puede deshacer"
- [ ] Al confirmar, se envía `DELETE /crm/clients/{id}` y se refresca la lista
- [ ] Toast de éxito "Cliente eliminado"
- [ ] Si el usuario no es admin y de alguna forma llega al endpoint, el backend retorna 403

**Endpoint**: `DELETE /api/v1/crm/clients/{client_id}` (requiere rol admin)

---

### HU-09: Ver detalle de cliente
**Como** operador del taller  
**Quiero** ver toda la información de un cliente incluyendo sus vehículos  
**Para** tener contexto completo antes de atenderlo  

**Criterios de Aceptación:**
- [ ] Click en un cliente de la lista navega a `/clients/{id}`
- [ ] Se muestra la información completa del cliente: nombre, documento, teléfono, email, fecha de registro
- [ ] Se muestra la lista de vehículos asociados (viene en la response de `GET /crm/clients/{id}` → campo `cars[]`)
- [ ] Cada vehículo muestra: placa, marca, modelo, año, color, tamaño
- [ ] Botón para agregar vehículo directamente desde esta vista (HU-10)
- [ ] Botón para volver a la lista de clientes

**Endpoint**: `GET /api/v1/crm/clients/{client_id}`  
**Response**: `{ id, name, ..., cars: [{ id, license_plate, brand, model, year, color, size, client_name }] }`

---

## Feature 3: CRM — Vehículos

### HU-10: Registrar vehículo
**Como** operador del taller  
**Quiero** registrar un vehículo asociado a un cliente  
**Para** poder crear entradas de servicio para ese vehículo  

**Criterios de Aceptación:**
- [ ] Accesible desde: vista de detalle de cliente (precarga `client_id`) y desde lista general de vehículos
- [ ] Formulario con campos: Placa*, Marca*, Modelo*, Año*, Color*, Tamaño* (small/medium/large/extra_large), Cliente* (selector si se accede desde lista general)
- [ ] Validación Zod: placa mín. 3 chars, marca/modelo/color mín. 3 chars, año numérico
- [ ] La placa es única — si ya existe (409/400), mostrar error
- [ ] Al guardar (`POST /crm/cars`), toast de éxito y refrescar la lista
- [ ] El select de tamaño muestra labels amigables: Pequeño, Mediano, Grande, Extra Grande

**Endpoint**: `POST /api/v1/crm/cars`  
**Body**: `{ client_id, license_plate, brand, model, year, color, size }`

---

### HU-11: Listar vehículos
**Como** operador del taller  
**Quiero** ver todos los vehículos registrados  
**Para** buscar un vehículo independientemente del cliente  

**Criterios de Aceptación:**
- [ ] Vista accesible desde navegación o como sub-sección de Clientes
- [ ] Se muestra lista con: placa, marca, modelo, año, color, nombre del dueño (`client_name`)
- [ ] Datos de `GET /crm/cars`
- [ ] En mobile: tarjetas con la placa como título principal
- [ ] En desktop: tabla ordenable

**Endpoint**: `GET /api/v1/crm/cars`

---

### HU-12: Editar vehículo
**Como** operador del taller  
**Quiero** actualizar los datos de un vehículo  
**Para** corregir información errónea  

**Criterios de Aceptación:**
- [ ] Botón de editar en cada vehículo (tarjeta o fila)
- [ ] Formulario precargado con los datos actuales
- [ ] Campos editables: placa, marca, modelo, año, color (no se cambia el `client_id`)
- [ ] `PUT /crm/cars/{id}` — todos los campos opcionales

**Endpoint**: `PUT /api/v1/crm/cars/{car_id}`

---

### HU-13: Eliminar vehículo
**Como** administrador del taller  
**Quiero** eliminar un vehículo del sistema  
**Para** limpiar registros obsoletos  

**Criterios de Aceptación:**
- [ ] Solo visible para rol admin
- [ ] Diálogo de confirmación con la placa del vehículo
- [ ] `DELETE /crm/cars/{id}` — toast de éxito, refrescar lista

**Endpoint**: `DELETE /api/v1/crm/cars/{car_id}` (requiere rol admin)

---

## Feature 4: Entradas (Income)

### HU-14: Listar entradas de servicio
**Como** operador del taller  
**Quiero** ver todas las entradas de vehículos al taller  
**Para** tener visibilidad del trabajo pendiente y completado  

**Criterios de Aceptación:**
- [ ] Vista en `/income` mostrando lista de entradas
- [ ] Cada entrada muestra: placa del vehículo, nombre del cliente, fecha de entrada, fecha de salida acordada, estado (indicador visual si tiene `exit_date_time` o no), cantidad de fotos
- [ ] Filtro por nombre de cliente (`client_name` query param)
- [ ] Paginación con `skip` y `limit` (scroll infinito en mobile o paginación en desktop)
- [ ] Las entradas sin fecha de salida se marcan visualmente como "En taller"
- [ ] Skeleton loading mientras cargan los datos

**Endpoint**: `GET /api/v1/income/?skip=0&limit=100&client_name=...`  
**Response**: `[{ id, car_id, income_date_time, agreed_exit_date_time, exit_date_time, notes, photos: [...], car: { license_plate, brand, ..., client_name } }]`

---

### HU-15: Registrar nueva entrada de vehículo
**Como** operador del taller  
**Quiero** registrar la entrada de un vehículo al taller con fotos  
**Para** documentar el estado del vehículo al recibirlo  

**Criterios de Aceptación:**
- [ ] Botón "Nueva Entrada" visible en la lista de entradas
- [ ] Formulario wizard de 3 pasos:
  1. **Seleccionar vehículo**: Búsqueda por placa o nombre de cliente → seleccionar de resultados. Muestra info del carro y dueño seleccionado
  2. **Detalles**: Campo de notas (textarea), fecha/hora de salida acordada (date picker, opcional)
  3. **Fotos**: Upload múltiple de fotos con selector de categoría por foto (entry/process/finished/exit). Preview de cada foto antes de enviar
- [ ] El formulario envía como `multipart/form-data`: `car_id`, `notes`, `agreed_exit_date_time`, `files[]`, `categories[]`
- [ ] Se muestra progress indicator durante el upload
- [ ] Al completar, toast de éxito y redirigir a la vista de detalle de la entrada creada
- [ ] Las fotos se suben al backend que las almacena en S3
- [ ] En mobile: el upload permite usar la cámara del dispositivo (`accept="image/*" capture="environment"`)

**Endpoint**: `POST /api/v1/income/` (multipart/form-data)  
**Form fields**: `car_id`, `notes?`, `agreed_exit_date_time?`, `files[]`, `categories[]`

---

### HU-16: Ver detalle de una entrada
**Como** operador del taller  
**Quiero** ver el detalle completo de una entrada incluyendo fotos  
**Para** revisar el estado documentado del vehículo  

**Criterios de Aceptación:**
- [ ] Vista en `/income/{id}` con toda la información de la entrada
- [ ] Sección de información: placa, cliente, fecha de entrada, fecha de salida acordada, fecha de salida real, notas
- [ ] Galería de fotos organizadas por categoría (tabs: Entrada, Proceso, Terminado, Salida)
- [ ] Las fotos se cargan usando las `presigned_url` que devuelve el backend
- [ ] Lightbox/modal al hacer click en una foto para verla en tamaño completo
- [ ] En mobile: galería horizontal con swipe por categoría
- [ ] Si hay trabajos de pintura asociados, se muestran en una sección separada

**Endpoint**: `GET /api/v1/income/{income_id}`  
**Response**: `{ ..., photos: [{ id, s3_key, category, presigned_url }], car: { ..., client_name } }`

---

### HU-17: Editar entrada de servicio
**Como** operador del taller  
**Quiero** actualizar las notas o fechas de una entrada  
**Para** registrar cambios en los acuerdos con el cliente  

**Criterios de Aceptación:**
- [ ] Botón de editar en la vista de detalle de entrada
- [ ] Se puede modificar: notas, fecha de entrada, fecha de salida acordada, fecha de salida real
- [ ] Marcar fecha de salida real = marcar el vehículo como "Entregado"
- [ ] `PATCH /income/{id}` con solo los campos modificados
- [ ] Toast de éxito y refrescar la vista

**Endpoint**: `PATCH /api/v1/income/{income_id}`  
**Body**: `{ car_id?, income_date_time?, agreed_exit_date_time?, exit_date_time?, notes? }`

---

## Feature 5: Pintura — Calculadora y Trabajos

### HU-18: Calcular precio mínimo de pintura
### listo modificar
**Como** operador del taller  
**Quiero** consultar el precio mínimo de pintura para un vehículo  
**Para** negociar con el cliente sabiendo el precio base y margen mínimo  

**Criterios de Aceptación:**
- [ ] Vista/sección accesible desde `/paint` o desde el detalle de una entrada
- [ ] Seleccionar un vehículo (por placa o desde la entrada asociada)
- [ ] Al seleccionar, se llama `GET /paint/calculate-price/{car_id}` y se muestra:
  - Tamaño del vehículo (ej. "Mediano")
  - Área en cm² (ej. 15,000 cm²)
  - Precio por cm² (ej. $1.00)
  - Precio base (área × precio/cm²)
  - Margen mínimo (ej. 30%)
  - **Precio mínimo permitido** (destacado visualmente)
- [ ] El desglose se presenta de forma clara con formato de moneda
- [ ] En mobile: card con toda la información en stack vertical

**Endpoint**: `GET /api/v1/paint/calculate-price/{car_id}`  
**Response**: `{ car_size, area_cm2, price_per_cm2, base_price, min_allowed_price, min_margin_percent }`

---

### HU-19: Crear trabajo de pintura
**Como** operador del taller  
**Quiero** registrar un trabajo de pintura con precio negociado  
**Para** documentar el acuerdo económico con el cliente  

**Criterios de Aceptación:**
- [ ] Accesible desde la calculadora de precios o desde el detalle de una entrada
- [ ] Formulario con campos: Entrada asociada* (income_id), Tipo de pintura* (texto libre: "Metálico", "Mate", "Estándar"), Precio negociado* (numérico)
- [ ] Al escribir el precio negociado, se muestra en tiempo real:
  - Indicador verde si el precio está por encima del mínimo
  - Indicador rojo con advertencia si está por debajo: "Precio por debajo del margen mínimo ({min_margin_percent}%). Mínimo: ${min_allowed_price}"
- [ ] El botón de guardar se deshabilita si el precio es menor al mínimo
- [ ] Al guardar (`POST /paint/jobs`), se recibe la respuesta con `base_price` y `margin_percent` calculados por el backend
- [ ] Toast de éxito mostrando el margen obtenido: "Trabajo creado — Margen: {margin_percent}%"

**Endpoint**: `POST /api/v1/paint/jobs`  
**Body**: `{ income_id, paint_type, negotiated_price }`  
**Response**: `{ id, income_id, paint_type, base_price, negotiated_price, margin_percent, created_at }`

---

## Feature 6: Configuración y Administración

### HU-20: Gestión de usuarios (Admin)
**Como** administrador del taller  
**Quiero** ver, crear y gestionar las cuentas de los operadores  
**Para** controlar quién tiene acceso al sistema  

**Criterios de Aceptación:**
- [ ] Vista en `/settings/users` — solo accesible si `role === admin`
- [ ] Lista de usuarios activos: nombre, email, rol (admin/operator)
- [ ] Botón "Nuevo Usuario" con formulario: Nombre*, Email*, Contraseña*, Rol* (admin/operator)
- [ ] Validación: email válido, contraseña mín. 8 chars
- [ ] `POST /auth/register` para crear usuarios
- [ ] Editar usuario: cambiar nombre, email, contraseña, rol (`PUT /auth/users/{id}`)
- [ ] Desactivar usuario: `DELETE /auth/users/{id}` — con confirmación
- [ ] Un admin no puede eliminarse a sí mismo
- [ ] Si un usuario no-admin intenta acceder a esta ruta, se redirige al dashboard

**Endpoints**:
- `GET /api/v1/auth/users` — listar usuarios
- `POST /api/v1/auth/register` — crear usuario
- `PUT /api/v1/auth/users/{user_id}` — editar usuario
- `DELETE /api/v1/auth/users/{user_id}` — desactivar usuario

---

### HU-21: Configurar precios de pintura (Admin) 
### listo
**Como** administrador del taller  
**Quiero** configurar el precio por cm² y el margen mínimo  
**Para** actualizar los precios cuando cambien los costos de materiales  

**Criterios de Aceptación:**
- [ ] Vista en `/settings/paint-config` — solo para admin
- [ ] Formulario con: Precio por cm²* (numérico, 2 decimales), Margen mínimo %* (numérico)
- [ ] Se muestra la configuración activa actual como referencia
- [ ] Al guardar (`POST /paint/config`), se crea una nueva configuración que se marca como activa
- [ ] Toast de éxito con resumen: "Configuración actualizada: ${price}/cm², margen {margin}%"

**Endpoint**: `POST /api/v1/paint/config`  
**Body**: `{ price_per_cm2, min_margin_percent, is_active }`

---

### HU-22: Configurar áreas por tamaño de vehículo (Admin)
### listo
**Como** administrador del taller  
**Quiero** definir el área en cm² para cada tamaño de vehículo  
**Para** que el cálculo de precios sea preciso según el tipo de vehículo  

**Criterios de Aceptación:**
- [ ] Sección dentro de la configuración de pintura
- [ ] Tabla/lista con los 4 tamaños: Pequeño, Mediano, Grande, Extra Grande
- [ ] Cada fila muestra el tamaño y un campo editable con el área en cm²
- [ ] Guardar actualiza/crea la configuración (`POST /paint/areas`)
- [ ] Valores por defecto visibles: small=10,000, medium=15,000, large=20,000, extra_large=25,000

**Endpoint**: `POST /api/v1/paint/areas`  
**Body**: `{ size, area_cm2 }`

---

## Feature 7: Dashboard

### HU-23: Dashboard principal
**Como** operador del taller  
**Quiero** ver un resumen del estado actual del taller al iniciar sesión  
**Para** tener visibilidad inmediata del trabajo pendiente  

**Criterios de Aceptación:**
- [ ] Es la primera vista tras el login (`/dashboard`)
- [ ] **KPIs en cards**:
  - Vehículos en taller (entradas sin `exit_date_time`)
  - Clientes totales registrados
  - Entradas del día (creadas hoy)
- [ ] **Lista rápida**: últimas 5 entradas registradas con: placa, cliente, fecha, estado
- [ ] **Accesos rápidos** (botones): Nueva Entrada, Nuevo Cliente, Calcular Precio
- [ ] Los datos se obtienen combinando: `GET /income/?limit=5`, `GET /crm/clients`
- [ ] En mobile: cards apilados verticalmente, accesos rápidos como grid 2×2
- [ ] En desktop: layout de 3 columnas para KPIs, lista y accesos en fila

---

## Resumen de Cobertura de Endpoints

| Endpoint | Método | HU | Feature |
|----------|--------|----|---------|
| `POST /auth/login` | POST | HU-01 | F1: Login |
| `POST /auth/register` | POST | HU-20 | F6: Admin |
| `GET /auth/users` | GET | HU-20 | F6: Admin |
| `PUT /auth/users/{id}` | PUT | HU-20 | F6: Admin |
| `DELETE /auth/users/{id}` | DELETE | HU-20 | F6: Admin |
| `GET /crm/clients` | GET | HU-04 | F2: Clientes |
| `GET /crm/clients/search` | GET | HU-05 | F2: Clientes |
| `GET /crm/clients/{id}` | GET | HU-09 | F2: Clientes |
| `POST /crm/clients` | POST | HU-06 | F2: Clientes |
| `PUT /crm/clients/{id}` | PUT | HU-07 | F2: Clientes |
| `DELETE /crm/clients/{id}` | DELETE | HU-08 | F2: Clientes |
| `GET /crm/cars` | GET | HU-11 | F3: Vehículos |
| `GET /crm/cars/{id}` | GET | HU-12 | F3: Vehículos |
| `POST /crm/cars` | POST | HU-10 | F3: Vehículos |
| `PUT /crm/cars/{id}` | PUT | HU-12 | F3: Vehículos |
| `DELETE /crm/cars/{id}` | DELETE | HU-13 | F3: Vehículos |
| `GET /income/` | GET | HU-14 | F4: Entradas |
| `GET /income/{id}` | GET | HU-16 | F4: Entradas |
| `POST /income/` | POST | HU-15 | F4: Entradas |
| `PATCH /income/{id}` | PATCH | HU-17 | F4: Entradas |
| `GET /paint/calculate-price/{car_id}` | GET | HU-18 | F5: Pintura |
| `POST /paint/jobs` | POST | HU-19 | F5: Pintura |
| `POST /paint/config` | POST | HU-21 | F6: Admin |
| `POST /paint/areas` | POST | HU-22 | F6: Admin |

> ✅ **Cobertura: 24/24 endpoints del backend (100%)**
