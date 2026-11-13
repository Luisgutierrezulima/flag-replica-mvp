/* Banco de 12 preguntas.
   source = 'publicada': el articulo (Parrales-Bravo et al., 2026) publica el enunciado o la opcion correcta.
   source = 'reconstruida': redactada para esta replica a partir del tema del articulo.
   Las 5 preguntas del test pre/post (Apendice A del articulo) NO se usan en el juego,
   para no contaminar un futuro pre/post con material de practica.
   Contenido educativo de demostracion. No sustituye consejo medico. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FLAGData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const QUESTIONS = [
    {
      id: 'Q01', room: 'General', source: 'publicada',
      text: 'Un estudiante de software decide incorporar una caminata de 30 minutos a su rutina diaria. ¿Qué beneficio le dará a su metabolismo?',
      options: ['Cura para la cirrosis', 'Quema calorías y mejora el control del azúcar en sangre', 'Aumento inmediato de peso corporal', 'Menor necesidad de beber agua'],
      correct: 1,
      concept: 'La actividad física regular gasta energía y mejora el control de la glucosa. No cura una cirrosis ni sube el peso de inmediato.'
    },
    {
      id: 'Q02', room: 'General', source: 'reconstruida',
      text: 'Tu médico quiere saber si el hígado está inflamado o dañado. ¿Qué examen de sangre se usa?',
      options: ['Hemograma completo', 'Pruebas de función hepática (transaminasas ALT y AST)', 'Prueba de tolerancia a la lactosa', 'Examen de orina de rutina'],
      correct: 1,
      concept: 'Las transaminasas ALT y AST forman parte de las pruebas de función hepática y suelen subir cuando hay daño en las células del hígado. Un valor normal no descarta la enfermedad.'
    },
    {
      id: 'Q03', room: 'Alimentación', source: 'reconstruida',
      text: 'En la máquina expendedora de la universidad, ¿cuál es la peor opción para tu hígado?',
      options: ['Agua natural', 'Frutos secos sin sal', 'Una bebida gaseosa azucarada grande', 'Una barra de cereal integral'],
      correct: 2,
      concept: 'Las bebidas azucaradas aportan mucha azúcar líquida, que el hígado convierte en grasa con facilidad.'
    },
    {
      id: 'Q04', room: 'General', source: 'reconstruida', core: true, topic: 'fisiopatologia',
      text: '¿Cuál es uno de los mayores desafíos para detectar a tiempo el hígado graso?',
      options: ['Siempre produce un dolor muy fuerte', 'Suele no dar síntomas en las etapas tempranas', 'Solo aparece en personas mayores de 60 años', 'Se ve a simple vista en la piel'],
      correct: 1,
      concept: 'En sus etapas tempranas el hígado graso casi no da síntomas, por eso se detecta tarde si no se hacen controles.'
    },
    {
      id: 'Q05', room: 'General', source: 'reconstruida',
      text: '¿Qué significa la sigla NAFLD o EHGNA?',
      options: ['Infección viral del hígado', 'Enfermedad del hígado graso no alcohólico', 'Inflamación de la vesícula', 'Falta de enzimas digestivas'],
      correct: 1,
      concept: 'Es la acumulación de grasa en el hígado en personas que no consumen alcohol en exceso. Desde 2023 el término de consenso es MASLD (enfermedad hepática esteatósica asociada a disfunción metabólica).'
    },
    {
      id: 'Q06', room: 'Actividad física', source: 'reconstruida',
      text: 'Pasas 8 horas sentado programando. ¿Qué pequeño hábito ayuda más?',
      options: ['Quedarte sentado hasta terminar el trabajo', 'Levantarte y moverte unos minutos cada hora', 'Saltarte el almuerzo', 'Beber solo bebidas energéticas'],
      correct: 1,
      concept: 'Interrumpir el tiempo sentado con pausas activas cortas ayuda al control de la glucosa y reduce el riesgo metabólico. La OMS aconseja limitar el tiempo sedentario y reemplazarlo por actividad de cualquier intensidad.'
    },
    {
      id: 'Q07', room: 'Alimentación', source: 'reconstruida',
      text: '¿Cuál es una merienda amigable con el hígado?',
      options: ['Papas fritas de bolsa', 'Hamburguesa con doble queso', 'Fruta fresca con frutos secos', 'Bebida energética'],
      correct: 2,
      concept: 'Las frutas frescas y los frutos secos aportan fibra y grasas saludables. Los fritos y las bebidas azucaradas favorecen la grasa en el hígado.'
    },
    {
      id: 'Q08', room: 'General', source: 'reconstruida',
      text: '¿Con cuál de estas condiciones se relaciona más el hígado graso?',
      options: ['Resistencia a la insulina y obesidad', 'Miopía', 'Alergia al polen', 'Caries dental'],
      correct: 0,
      concept: 'El hígado graso suele ir de la mano con la obesidad, la resistencia a la insulina y la diabetes tipo 2.'
    },
    {
      id: 'Q09', room: 'Alimentación', source: 'reconstruida',
      text: '¿Qué bebida tiene un efecto directo más dañino sobre el hígado?',
      options: ['Agua natural', 'Infusión sin azúcar', 'Cerveza', 'Agua con limón'],
      correct: 2,
      concept: 'El alcohol daña directamente las células del hígado y empeora cualquier acumulación de grasa.'
    },
    {
      id: 'Q10', room: 'Actividad física', source: 'reconstruida',
      text: 'Según la OMS, ¿cuánta actividad física semanal se recomienda a un adulto?',
      options: ['Unos 30 minutos en total', 'Al menos 150 minutos de actividad de intensidad moderada', 'Solo los fines de semana, 2 horas', 'No hay ninguna recomendación'],
      correct: 1,
      concept: 'La OMS recomienda para adultos entre 150 y 300 minutos semanales de actividad aeróbica de intensidad moderada, o su equivalente vigorosa.'
    },
    {
      id: 'Q11', room: 'General', source: 'reconstruida', core: true, topic: 'prevencion',
      text: 'Una persona con hígado graso en etapa temprana mejora su dieta y hace ejercicio. ¿Qué puede pasar?',
      options: ['La grasa del hígado puede disminuir', 'El hígado se daña más rápido', 'No cambia nada, es irreversible', 'Aparece diabetes de inmediato'],
      correct: 0,
      concept: 'En etapas tempranas la grasa del hígado puede reducirse con dieta y actividad física. Perder cerca del 5 % del peso ya ayuda a reducirla.'
    },
    {
      id: 'Q12', room: 'General', source: 'reconstruida',
      text: '¿Cuál es una complicación grave a largo plazo si el hígado graso avanza sin control?',
      options: ['Cirrosis (cicatrización del hígado)', 'Pérdida de cabello', 'Mala visión nocturna', 'Pie plano'],
      correct: 0,
      concept: 'Si la inflamación persiste, el hígado puede cicatrizar (fibrosis) y llegar a cirrosis, una etapa avanzada.'
    },
    {
      id: 'Q13', room: 'General', source: 'reconstruida', core: true, topic: 'epidemiologia',
      text: 'Si miras a 10 adultos en el mundo, ¿en cuántos se estima que hay hígado graso?',
      options: ['En 1 de cada 100', 'En unos 3 de cada 10', 'En 9 de cada 10', 'En ninguno si no toman alcohol'],
      correct: 1,
      concept: 'Se estima que cerca del 30 % de la población adulta mundial tiene hígado graso, y la cifra va en aumento.'
    },
    {
      id: 'Q14', room: 'Actividad física', source: 'reconstruida', core: true, topic: 'riesgo',
      text: 'Un programador pasa más de 8 horas sentado y a menudo se salta el desayuno o pica de madrugada. ¿Qué pasa con su riesgo de hígado graso?',
      options: ['Disminuye, porque descansa más', 'No cambia, depende solo de la genética', 'Aumenta con el sedentarismo y las comidas irregulares', 'Solo aumenta si usa pantallas con luz azul'],
      correct: 2,
      concept: 'Pasar muchas horas sentado y tener horarios de comida irregulares se asocia con mayor riesgo de hígado graso.'
    },
    {
      id: 'Q15', room: 'General', source: 'reconstruida', core: true, topic: 'consecuencias',
      text: '¿Cuál es la principal causa de muerte en las personas con hígado graso?',
      options: ['Accidentes de tránsito', 'Enfermedades cardiovasculares', 'Infecciones respiratorias', 'Alergias graves'],
      correct: 1,
      concept: 'Las enfermedades cardiovasculares son la principal causa de muerte en personas con hígado graso. También hay mayor riesgo de complicaciones del hígado.'
    }
  ];
  return { QUESTIONS: QUESTIONS };
});
