# FLAG (réplica MVP)

Réplica mínima del juego serio **FLAG: Fatty Liver Awareness Game**, descrito en:

> Parrales-Bravo, F. et al. (2026). *FLAG: Fatty Liver Awareness Game for Liver Health Literacy in Last-Semester Software Engineering Students*. Multimodal Technologies and Interaction, 10(5), 48. https://doi.org/10.3390/mti10050048

Trabajo de la semana 13 del curso Proyecto de Investigación (Universidad de Lima). Esta réplica no es el código original. El artículo no enlaza el código fuente. Cita el prototipo web original en https://franklinparrales.es/SGHigado/ (consultado por los autores el 26-ene-2026). Aquí se reconstruyó el juego a partir de la descripción de la sección 4 del artículo.

## Cómo ejecutarlo

Es HTML5, CSS3 y JavaScript sin dependencias ni compilación, igual que el original.

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

También funciona abriendo `index.html` directamente en el navegador.

## Pruebas

```bash
node --test test/logic.test.js
```

Las pruebas cubren la lógica pura (`js/logic.js`): armado de ronda, tiempos por nivel, puntaje, logro, ranking y pista del minijuego.

## Qué replica del artículo

| Sección del artículo | Elemento | Estado en el MVP |
|---|---|---|
| 4.1 | Pantalla de bienvenida con "Misión: Hígado Sano", "Iniciar juego", "Jugar en la sala", "Cómo jugar", eslogan y Top 3 | Hecho. El Top 3 es local (localStorage) y empieza vacío |
| 4.1 | "Jugar en la sala" con código de sala | Parcial. Guarda y muestra el código. No hay reporte para docentes |
| 4.1 | "Log in" | No incluido |
| 4.2 | Dificultad Fácil e Intermedia y botón "Introducción" | Hecho |
| 4.3 | Pregunta N de 10, puntos, sala, temporizador, opciones A a D, "Responder a la misión" y "Terminar misión" | Hecho |
| 4.4 | Retroalimentación positiva ("¡Bien hecho! +1 punto") y negativa ("¡Alerta roja!") con la respuesta correcta | Hecho |
| 4.5.2 | Minijuego "Recolector de comida saludable" (corazón, comida buena y mala, "terminar y continuar") | Hecho |
| 4.5.1 | Minijuego "Crucigrama de frutas" | No incluido |
| 4.6 | Pantalla "Misión completada", puntaje total, correctas, errores y sin responder | Hecho |
| 4.6 | Logro "Hígado de Acero" y botones "Volver al inicio" y "Revisar preguntas" con reporte y "concepto correcto" | Hecho |

## Supuestos propios (el artículo no los publica)

1. **Límite de tiempo.** El artículo muestra un temporizador, pero no dice cuánto dura. Se usó 45 s en Fácil y 20 s en Intermedio.
2. **Qué cambia entre niveles.** El artículo no lo dice. Aquí solo cambia el tiempo.
3. **Puntaje.** El artículo muestra "+1 punto" por acierto y un total de 94 puntos con 9 aciertos, lo que implica otros componentes no publicados. Aquí el total es aciertos más puntos del minijuego (comida saludable suma 1 y comida dañina resta 1, con mínimo 0).
4. **Posición del minijuego.** Aparece como pausa tras la pregunta 5.
5. **Logros.** Solo "Hígado de Acero" para 9 aciertos está publicado. Los otros dos títulos son propios.
6. **Banco de preguntas.** El artículo no publica el banco de 10 preguntas. Hay 12 preguntas en `js/data.js`. Cada una lleva el campo `source`: `publicada` si el artículo publica el enunciado (solo la pregunta de la caminata de 30 minutos) y `reconstruida` si se redactó para esta réplica. En dos de ellas el artículo solo publica la respuesta correcta o el concepto (transaminasas ALT y AST, y bebida azucarada).
7. **Test pre/post.** Las 5 preguntas del Apéndice A del artículo no se usaron en el juego, para no mezclar material de práctica con el instrumento de evaluación.
8. **Idioma.** Interfaz en español. Las capturas del artículo están traducidas al inglés.
9. **Aspecto visual.** Tema oscuro con botones azul y morado, inspirado en las figuras del artículo. No es una copia gráfica.

## Aviso

El contenido educativo es de demostración y no sustituye consejo médico. Las preguntas reconstruidas no pasaron por validación de expertos, a diferencia del instrumento del artículo.

## Estructura

```
index.html        pantallas del juego
css/style.css     estilos
js/logic.js       lógica pura (probada con Node)
js/data.js        banco de preguntas
js/app.js         interfaz, temporizador y minijuego
test/             pruebas
docs/             diapositiva del workflow (PNG)
```
