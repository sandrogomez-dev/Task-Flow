# 📋 TaskFlow - Gestión de Proyectos Moderna

![TaskFlow Logo](https://img.shields.io/badge/TaskFlow-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.0.0-61dafb.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952b3.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

TaskFlow es una aplicación moderna de gestión de proyectos construida con React que combina tableros Kanban, gráficos Gantt, seguimiento de tiempo y analíticas avanzadas en una interfaz elegante y fácil de usar.

## ✨ Características Principales

### 🎯 **Gestión de Proyectos**
- ✅ Creación y gestión completa de proyectos
- ✅ Plantillas predefinidas (Software, Marketing, Diseño)
- ✅ Estados de proyecto (Activo, En Planificación, Pausado)
- ✅ Fechas de inicio y finalización

### 📋 **Tablero Kanban**
- ✅ Drag & Drop intuitivo
- ✅ Columnas personalizables
- ✅ Tarjetas de tareas con información detallada
- ✅ Filtros por prioridad y asignado

### 📊 **Gráfico Gantt**
- ✅ Vista temporal de tareas
- ✅ Dependencias entre tareas
- ✅ Seguimiento de progreso
- ✅ Fechas límite visuales

### ⏱️ **Seguimiento de Tiempo**
- ✅ Cronómetro integrado
- ✅ Registro de tiempo por tarea
- ✅ Reportes de tiempo invertido
- ✅ Estadísticas de productividad

### 📈 **Dashboard y Analíticas**
- ✅ Métricas clave del proyecto
- ✅ Gráficos de distribución
- ✅ Progreso en tiempo real
- ✅ Actividad reciente

### 🔧 **Funcionalidades Adicionales**
- ✅ Sistema de notificaciones
- ✅ Configuración personalizable
- ✅ Tema claro/oscuro
- ✅ Exportar/Importar datos
- ✅ Diseño responsive

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/taskflow.git
cd taskflow
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Inicia el servidor de desarrollo:**
```bash
npm start
```

4. **Abre tu navegador en:**
```
http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia el servidor de desarrollo
npm run dev        # Alias para npm start

# Construcción
npm run build      # Construye la aplicación para producción
npm run preview    # Vista previa de la construcción

# Testing
npm test           # Ejecuta las pruebas
npm run test:watch # Ejecuta las pruebas en modo watch

# Linting
npm run lint       # Ejecuta ESLint
npm run lint:fix   # Corrige errores de ESLint automáticamente

# Deploy
npm run deploy     # Despliega a Vercel
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── kanban/          # Componentes del tablero Kanban
│   ├── gantt/           # Componentes del gráfico Gantt
│   └── ui/              # Componentes de interfaz
├── contexts/            # Contextos de React
├── pages/               # Páginas principales
├── styles/              # Archivos de estilos
├── utils/               # Utilidades y helpers
└── App.js               # Componente principal
```

## 🎨 Tecnologías Utilizadas

- **Frontend:** React 19, Bootstrap 5
- **Drag & Drop:** @dnd-kit
- **Routing:** React Router DOM
- **Fechas:** date-fns
- **Iconos:** Font Awesome
- **Deploy:** Vercel

## 🔄 Estado del Proyecto

**Completado: 85%**

### ✅ Implementado
- [x] Páginas principales (Dashboard, Projects, Reports, Settings)
- [x] Sistema de gestión de proyectos y tareas
- [x] Tablero Kanban funcional
- [x] Gráfico Gantt básico
- [x] Seguimiento de tiempo
- [x] Sistema de notificaciones
- [x] Configuración de usuario
- [x] Exportar/Importar datos
- [x] Tema claro/oscuro
- [x] Diseño responsive

### 🚧 En Desarrollo
- [ ] Autenticación real con JWT
- [ ] Base de datos persistente
- [ ] Colaboración en tiempo real
- [ ] Aplicación PWA
- [ ] Notificaciones push

## 🎯 Uso Rápido

### 1. **Crear un Proyecto**
- Haz clic en "Crear Nuevo Proyecto" en el dashboard
- Selecciona una plantilla (Blanco, Software, Marketing, Diseño)
- Completa la información básica

### 2. **Agregar Tareas**
- Usa el botón "Nueva Tarea" en el navbar
- Completa los detalles de la tarea
- Asigna prioridad y fecha límite

### 3. **Gestionar Tareas**
- Arrastra y suelta tareas entre columnas
- Usa el cronómetro para registrar tiempo
- Revisa el progreso en el dashboard

### 4. **Ver Analíticas**
- Ve a la página "Reports" para métricas detalladas
- Filtra por proyecto y fechas
- Exporta reportes en JSON

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**SandroDevX**
- GitHub: [@SandroDevX](https://github.com/SandroDevX)

## 🙏 Agradecimientos

- React Team por el increíble framework
- Bootstrap por el sistema de diseño
- Font Awesome por los iconos
- Vercel por el hosting gratuito

---

⭐ **¡Si te gusta este proyecto, dale una estrella en GitHub!** ⭐
