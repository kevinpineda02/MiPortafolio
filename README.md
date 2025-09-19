# 🌟 Portafolio Personal - Kevin Pineda

> Un portafolio web moderno y elegante con tema dorado, diseñado para mostrar habilidades, proyectos y experiencia como desarrollador Full Stack.

[![Live Demo](https://img.shields.io/badge/Live-Demo-gold?style=for-the-badge&logo=github-pages)](https://kevinpineda02.github.io/portafolio/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/kevinpineda02/portafolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/kevin-pineda-7ab113384)

## 🎯 Descripción

Este portafolio personal está desarrollado con tecnologías web modernas, presentando un diseño elegante en modo oscuro con acentos dorados. Incluye secciones interactivas para mostrar información personal, habilidades técnicas, proyectos destacados y un formulario de contacto funcional.

## ✨ Características Principales

### 🎨 **Diseño y UX**
- **Tema oscuro elegante** con paleta de colores dorados
- **Diseño totalmente responsivo** (Mobile-first)
- **Animaciones suaves** y transiciones fluidas
- **Efectos visuales avanzados** con CSS moderno
- **Tipografía optimizada** con Google Fonts
- **Interfaz intuitiva** y fácil navegación

### 🚀 **Funcionalidades**
- **Efecto de escritura automática** en el título principal
- **Navegación suave** entre secciones
- **Botón scroll-to-top** animado
- **Editor de código interactivo** con sintaxis highlighting
- **Formulario de contacto funcional** con EmailJS
- **Sistema de notificaciones personalizado**
- **Barras de progreso animadas** para habilidades
- **Contador de estadísticas** con animación

### 📱 **Compatibilidad**
- **Responsive design** para todos los dispositivos
- **Optimización móvil** con gestos táctiles
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Accesibilidad mejorada** con soporte para teclado
- **Performance optimizada** con lazy loading

## 🛠️ Tecnologías Utilizadas

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Servicios
![EmailJS](https://img.shields.io/badge/EmailJS-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Deployment
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)

## 📁 Estructura del Proyecto

```
portafolio/
│
├── 📄 index.html          # Página principal con estructura HTML
├── 🎨 styles.css          # Estilos CSS con tema dorado
├── ⚡ script.js           # Funcionalidad JavaScript
├── 📂 Imagenes/           # Assets e imágenes
├── 📋 README.md           # Documentación del proyecto
└── 🚀 .github/            # Configuración de GitHub Actions (opcional)
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno
- Servidor web local (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/kevinpineda02/portafolio.git
cd portafolio
```

2. **Abrir en navegador**
```bash
# Opción 1: Abrir directamente
open index.html

# Opción 2: Servidor local con Python
python -m http.server 8000

# Opción 3: Servidor local con Node.js
npx serve .
```

3. **Acceder al portafolio**
```
http://localhost:8000
```

### Configuración del Formulario de Contacto

Para que el formulario de contacto funcione correctamente:

1. **Crear cuenta en EmailJS**
   - Registrarse en [EmailJS.com](https://www.emailjs.com/)
   - Crear un nuevo servicio de email

2. **Configurar las credenciales**
   - Obtener Public Key, Service ID y Template ID
   - Actualizar en `script.js`:
   ```javascript
   const serviceID = 'tu_service_id';
   const templateID = 'tu_template_id';
   emailjs.init('tu_public_key');
   ```

## 📸 Capturas de Pantalla

### Desktop
![Desktop View](./screenshots/desktop-view.png)

### Mobile
![Mobile View](./screenshots/mobile-view.png)

### Formulario de Contacto
![Contact Form](./screenshots/contact-form.png)

## 🎨 Paleta de Colores

```css
/* Tema Dorado Elegante */
--primary-bg: #0a0a0a;      /* Negro profundo */
--secondary-bg: #111111;     /* Negro carbón */
--card-bg: #1e1e1e;         /* Gris oscuro */
--gold-primary: #ffd700;     /* Oro brillante */
--gold-secondary: #ffed4a;   /* Oro claro */
--text-primary: #ffffff;     /* Blanco puro */
--text-secondary: #cccccc;   /* Gris claro */
```

## 📱 Secciones del Portafolio

### 🏠 **Hero Section**
- Presentación personal con efecto de escritura
- Enlaces a redes sociales
- Call-to-action buttons

### 👨‍💻 **Acerca de Mí**
- Información personal y profesional
- Editor de código interactivo
- Estadísticas y logros

### 🛠️ **Habilidades**
- Categorización por tecnologías
- Barras de progreso animadas
- Iconos representativos

### 💼 **Proyectos**
- Showcase de proyectos destacados
- Enlaces a repositorios y demos
- Tecnologías utilizadas

### 📞 **Contacto**
- Formulario funcional con validación
- Información de contacto
- Mapa de ubicación (opcional)

## 🚀 Características Técnicas Avanzadas

### JavaScript Modular
- **Arquitectura orientada a objetos** con clases ES6+
- **Gestión de eventos optimizada** con throttling/debouncing
- **Animaciones performantes** con requestAnimationFrame
- **Lazy loading** para mejorar rendimiento

### CSS Avanzado
- **Custom Properties** (CSS Variables)
- **Grid Layout** y **Flexbox** para layouts responsivos
- **Animaciones CSS** con timing functions optimizadas
- **Media queries** para múltiples breakpoints

### Optimizaciones
- **Minimización de repaints** y reflows
- **Uso eficiente de memoria** JavaScript
- **Carga asíncrona** de recursos externos
- **Compresión de imágenes** y assets

## 📈 Performance

- **Lighthouse Score**: 95+ en todas las categorías
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔧 Personalización

### Cambiar Colores del Tema
```css
:root {
  --gold-primary: #your-color;
  --gold-secondary: #your-secondary-color;
}
```

### Modificar Animaciones
```javascript
const CONFIG = {
  TYPING_SPEED: 80,
  ANIMATION_DELAY: 100,
  // ... más configuraciones
};
```

### Agregar Nuevas Secciones
1. Añadir HTML en `index.html`
2. Incluir estilos en `styles.css`
3. Implementar funcionalidad en `script.js`
4. Actualizar navegación

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Kevin Pineda**
- 🌐 Portfolio: [kevinpineda02.github.io](https://kevinpineda02.github.io/portafolio/)
- 💼 LinkedIn: [kevin-pineda-7ab113384](https://www.linkedin.com/in/kevin-pineda-7ab113384)
- 📧 Email: kevinpineda200.kp@gmail.com
- 🐱 GitHub: [@kevinpineda02](https://github.com/kevinpineda02)

## 🙏 Agradecimientos

- **Font Awesome** por los iconos increíbles
- **Google Fonts** por las tipografías elegantes
- **EmailJS** por el servicio de formularios
- **GitHub Pages** por el hosting gratuito

## 📊 Estadísticas del Proyecto

![GitHub last commit](https://img.shields.io/github/last-commit/kevinpineda02/portafolio?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/kevinpineda02/portafolio?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/kevinpineda02/portafolio?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/kevinpineda02/portafolio?style=for-the-badge)

---

<div align="center">
  <p>⭐ ¡No olvides dar una estrella al repo si te gustó! ⭐</p>
  <p>🚀 <strong>¡Construyamos algo increíble juntos!</strong> 🚀</p>
</div>