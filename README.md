# 🚀 TaskFlow - Gestión de Proyectos

## 📋 Descripción

TaskFlow es una aplicación de gestión de proyectos moderna inspirada en Asana y Trello. Permite gestionar tareas mediante tableros Kanban, visualizar cronogramas con gráficos Gantt y realizar seguimiento de tiempo en tiempo real.

## ✨ Características

- **Tableros Kanban**: Gestión visual de tareas con drag & drop
- **Gráficos Gantt**: Visualización de cronogramas y dependencias
- **Seguimiento de Tiempo**: Cronómetro integrado para tareas
- **Tiempo Real**: Colaboración simultánea (Socket.IO ready)
- **Responsive**: Diseño adaptativo para móviles y desktop
- **UI Moderna**: Interfaz construida con Bootstrap 5

## 🛠️ Tecnologías

- **Frontend**: React 19 + Bootstrap 5
- **Drag & Drop**: @dnd-kit
- **Tiempo Real**: Socket.IO (cliente)
- **Routing**: React Router DOM
- **Fechas**: date-fns
- **Testing**: Jest + Testing Library

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/taskflow.git
cd taskflow

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Build para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI generales
│   ├── kanban/         # Componentes del tablero Kanban
│   └── gantt/          # Componentes del gráfico Gantt
├── contexts/           # Context API para estado global
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Servicios y APIs
├── styles/             # Estilos globales
└── utils/              # Utilidades
```

## 🎯 Funcionalidades Principales

### Tablero Kanban
- Arrastrar y soltar tareas entre columnas
- Crear, editar y eliminar tareas
- Asignación de prioridades y fechas límite
- Etiquetas y categorías

### Gráfico Gantt
- Visualización de cronograma
- Ajuste de fechas mediante drag & drop
- Diferentes niveles de zoom (día/semana/mes)
- Barras de progreso

### Seguimiento de Tiempo
- Cronómetro en tiempo real
- Registro manual de tiempo
- Historial de tiempo por tarea

## 🌐 Deploy

### Vercel
El proyecto está configurado para deploy automático en Vercel:

1. Conecta tu repositorio a Vercel
2. Las configuraciones están en `vercel.json`
3. El deploy se ejecuta automáticamente en cada push

### Variables de Entorno
```bash
REACT_APP_SOCKET_URL=tu_servidor_websocket
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Coverage
npm test -- --coverage
```

## 🔄 Estado del Proyecto

**🚧 En Construcción**

Funcionalidades implementadas:
- ✅ Tablero Kanban completo
- ✅ Gráfico Gantt básico
- ✅ Seguimiento de tiempo
- ✅ Dashboard principal
- ✅ Navegación y layouts

Por implementar:
- 🚧 Autenticación y usuarios
- 🚧 Servidor backend y API
- 🚧 Base de datos
- 🚧 Notificaciones push
- 🚧 Colaboración en tiempo real

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión eficiente de proyectos.

---

⭐ ¡No olvides dar una estrella al proyecto si te resulta útil!
