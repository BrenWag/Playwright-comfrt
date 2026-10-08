# Comfrt — Reporte de escenarios y plan de pruebas

## Alcance
Este plan cubre el flujo de compra de Comfrt desde la home hasta el checkout, con foco en navegación, catálogo, PDP, carrito, validación de formulario, edge cases y regresiones.

## Escenarios cubiertos

### 1. Home y descubrimiento
- Carga correcta de la home
- Banner principal visible
- Menú principal y categorías del sitio accesibles
- CTA y links principales visibles
- Navegación a una colección desde la home

### 2. Catálogo y búsqueda
- Visualización de productos destacados
- Imagen, nombre, precio y marca visibles
- Acceso a colección desde dentro del home
- Verificación de estados vacíos o de búsqueda sin resultados
- Validación de filtros y ordenamiento si el catálogo lo ofrece

### 3. Product Detail Page (PDP)
- Evidencia de nombre, precio, descuento y stock
- Variante de color seleccionable
- Variante de talla seleccionable
- Acciones de wishlist y carrito visibles
- Botón de compra habilitado solo cuando la combinación es válida

### 4. Carrito
- Agregar producto al carrito desde PDP
- Aumento y decremento de cantidad
- Eliminación de ítems
- Totales recalculados
- Recuperación del estado ante recarga
- Prevención de duplicado por doble click o reintento

### 5. Checkout
- Acceso al checkout desde carrito
- Validación de campos obligatorios
- Email, teléfono, zip y formulario de dirección
- Selección de método de envío
- Método de pago
- Confirmación de compra y mensajes finales

### 6. Casos negativos
- Formulario incompleto
- Email o teléfono inválidos
- Cupón inválido
- Pago rechazado o error del gateway
- Carrito vacío
- Producto sin stock o variante agotada
- Error de red o doble submit

### 7. Edge cases y regresiones
- Popup promocional interceptando clics
- Recarga durante checkout
- Navegación hacia atrás y reintento
- Mobile y desktop
- Teclado solamente / accesibilidad básica

## Plan de pruebas

### Suite 1: Home y navegación
- Verificar que la home carga y muestra contenido principal
- Validar que el menú y las categorías responden
- Confirmar que hay CTA visibles para navegación hacia producto o colección

### Suite 2: PDP y variantes
- Abrir una PDP real del sitio
- Verificar nombre, precio, stock, imágenes y descripcion
- Probar cambio de variante y tamaño
- Confirmar que el botón de compra se habilita solo con selección válida

### Suite 3: Carrito y totales
- Agregar producto
- Repetir la acción para verificar no duplicado
- Modificar cantidad y eliminar item
- Validar subtotal, envío y total final
- Probar persistencia del carrito al recargar

### Suite 4: Checkout y validación
- Completar un flujo feliz con datos válidos
- Validar bloqueo de campos vacíos
- Probar errores de formulario y mensajes visibles
- Confirmar los pasos del checkout y el resumen final
- Verificar confirmación de orden y mensaje de éxito

### Suite 5: Regressiones y UX
- Popup de marketing y overlays
- Botón de carrito inhabilitado, estado de carga, y mensajes de error
- Falla de red o pago en pendiente
- Recarga y navegación interna
- Accesibilidad con teclado y mobile

## Segunda etapa agregada

### Nuevos escenarios cubiertos
- Carrito vacío y estados de seguridad antes del checkout
- Checkout con datos incompletos y validación de mensajes de error
- Intento de cupon inválido cuando el campo existe
- Navegación por teclado en home y PDP
- Revisión de UX con overlays promocionales y estados intermedios

### Archivos creados
- specs/comfrt/home.spec.ts
- specs/comfrt/product.spec.ts
- specs/comfrt/checkout.spec.ts
- specs/comfrt/second-stage.spec.ts
- specs/comfrt/test-plan-report.md

## Ejecución sugerida
1. Instalar dependencias: npm install
2. Ejecutar smoke de home: npx playwright test specs/comfrt/home.spec.ts
3. Ejecutar suite ampliada: npx playwright test specs/comfrt
4. Ver reportes: npx playwright show-report
