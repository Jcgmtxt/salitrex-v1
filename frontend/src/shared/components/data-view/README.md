# Data View Components

Este directorio contiene los componentes reutilizables para las vistas de datos (Listados, Tablas, Grillas) del proyecto Salitrex. Sigue el principio **DRY (Don't Repeat Yourself)** y separa la lógica de estado de la presentación.

## 📦 Componentes

- **`DataLayout`**: El contenedor principal. Se encarga de coordinar la barra de búsqueda, los estados de carga (esqueletos), los estados de error, la vista vacía (`DataEmptyState`), y la paginación (`DataPagination`). 
- **`DataPagination`**: Un componente de paginación avanzado que permite navegar entre páginas (Siguiente, Anterior, Primera, Última) y elegir la cantidad de items por página (10, 20, 50, 100).
- **`DataEmptyState`**: Un componente reutilizable para mostrar un mensaje amigable cuando no hay datos o cuando una búsqueda no arroja resultados.

## 🚀 ¿Cómo usarlo en próximas HUs?

Cada vez que necesites crear una nueva vista de lista (ej: `CarsList`, `IncomesList`, `UsersList`), sigue este patrón:

### 1. Usa el hook `useListParams`
Este hook se encarga de leer y escribir en la URL (`query`, `offset`, `limit`).

### 2. Pásalo a tu Custom Hook (TanStack Query)
Pasa los parámetros a tu hook de obtención de datos para tener la información desde el backend.

### 3. Usa `DataLayout`
Envuelve tus componentes de visualización (Tabla para Desktop, Cartas para Móvil) dentro de `DataLayout`.

### Ejemplo de Implementación

```tsx
import { useCars } from "../hooks/use-cars";
import { Car } from "lucide-react";
import { CarsTable } from "./CarsTable";
import { CarsMobileList } from "./CarsMobileList";
import { useListParams } from "@/shared/hooks/use-list-params";
import { DataLayout } from "@/shared/components/data-view/DataLayout";

export function CarsList() {
    // 1. Obtener parámetros de la URL
    const listParams = useListParams();
    
    // 2. Fetch data
    const { data, isLoading, error, isPlaceholderData } = useCars(listParams.params);

    const cars = data?.items ?? [];
    const total = data?.total ?? 0;

    return (
        // 3. Envolver en DataLayout
        <DataLayout
            data={cars}
            total={total}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            error={error}
            params={listParams.params}
            setQuery={listParams.setQuery}
            setPage={listParams.setPage}
            setLimit={listParams.setLimit}
            currentPage={listParams.currentPage}
            searchPlaceholder="Buscar por placa, marca o modelo..."
            emptyState={{
                icon: Car,
                title: "No hay vehículos",
                description: "Aún no has registrado ningún vehículo en el sistema.",
                actionLabel: "Registrar vehículo",
                onAction: () => console.log("Abriendo modal..."),
            }}
        >
            {/* 4. Tus componentes de presentación */}
            <CarsTable cars={cars} />
            <CarsMobileList cars={cars} />
        </DataLayout>
    );
}
```

## ✨ Ventajas
- **Clean Code:** Reducción del 70% del código boilerplate en las vistas.
- **URL-Driven State:** Copias el link y se lo pasas a otro admin, ¡y verá exactamente la misma página y búsqueda!
- **Consistencia UI/UX:** Todas las tablas y listados de la app se ven y se comportan exactamente igual.
- **Zero-Flicker:** La paginación usa `keepPreviousData` para evitar que la tabla parpadee mientras carga la siguiente página.
