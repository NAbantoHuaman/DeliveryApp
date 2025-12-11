# 🚀 Chaskys Delivery App

Chaskys es una aplicación de delivery moderna y dinámica construida con **React** y **Vite**. Diseñada para ofrecer una experiencia de usuario premium, la app soporta dos roles principales: **Cliente** y **Conductor/Repartidor**, integrando características avanzadas como rastreo en tiempo real, interacción con IA y animaciones fluidas.

## ✨ Características Principales

### 👤 Para Clientes

- **Exploración de Restaurantes**: Navegación intuitiva por categorías y listado de restaurantes.
- **Interacción con Chef IA**: Un asistente virtual para recomendaciones de comida personalizadas.
- **Carrito y Checkout**: Flujo de compra completo desde la selección de productos hasta el pago simulado.
- **Rastreo en Tiempo Real**: Visualización del estado del pedido y ubicación del repartidor en el mapa.
- **Selección de Ubicación**: Interfaz interactiva para seleccionar y guardar direcciones de entrega.

### 🛵 Para Conductores (Chaskys)

- **Dashboard de Pedidos**: Vista general de ganancias, estado en línea/fuera de línea y motivación diaria.
- **Radar de Pedidos**: Detección de nuevas órdenes cercanas con opción de aceptar o rechazar.
- **Flujo de Entrega Completo**: Gestión paso a paso del pedido: recogida, navegación al destino y confirmación de entrega.
- **Historial de Pedidos**: Registro detallado de las entregas realizadas.

## 🛠️ Tecnologías

Este proyecto utiliza un stack moderno y eficiente:

- **Core**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Mapas**: [Mapbox GL JS](https://www.mapbox.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Animaciones**: [GSAP](https://gsap.com/)
- **Linter**: ESLint

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio**

    ```bash
    git clone <url-del-repositorio>
    cd chaskys-app
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto y agrega tus claves de Mapbox:

    ```env
    VITE_MAPBOX_TOKEN=tu_token_publico_de_mapbox
    VITE_MAPBOX_STYLE=tu_estilo_de_mapbox_url
    ```

    > **Nota**: Necesitarás una cuenta en Mapbox para obtener estas claves.

4.  **Iniciar el servidor de desarrollo**
    ```bash
    npm run dev
    ```

## 📂 Estructura del Proyecto

```text
src/
├── components/       # Componentes React organizados por funcionalidad
│   ├── auth/         # Login, Registro (Cliente y Driver)
│   ├── client/       # Vistas y componentes del Cliente
│   ├── driver/       # Vistas y componentes del Conductor
│   ├── common/       # Componentes reutilizables (Splash, Headers)
│   └── profile/      # Vista de perfil compartida
├── context/          # Contextos de React (Auth, Cart, ubicación)
├── config/           # Configuraciones (Mapbox, etc.)
├── constants/        # Datos estáticos y constantes
└── App.jsx           # Componente principal y enrutamiento
```

## 📜 Scripts Disponibles

- `npm run dev`: Inician e servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run lint`: Ejecuta el linter para encontrar errores en el código.
- `npm run preview`: Vista previa local de la build de producción.
