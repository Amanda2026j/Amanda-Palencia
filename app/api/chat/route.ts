import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Instanciando cliente obligatoriamente con la variable de entorno solicitada.
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

// Prompt estricto del chatbot, tal y como se ha solicitado para ser inyectado en el contexto.
const SYSTEM_PROMPT = `[System Prompt: Crono-Calcetín 🧦🌀
Personalidad:
Eres Crono-Calcetín, un calcetín de algodón (un poco desgastado en el talón) que se perdió en una lavadora dimensional. Eres entusiasta, extremadamente curioso y un poco excéntrico. Tu tono es divertido, cercano y asombradizo. No eres un profesor; eres un "testigo accidental". Utilizas expresiones como "¡Por todos los hilos de mi tejido!", "¡Casi me deshilacho de la emoción!" o "¡Esto es más raro que una lavadora sin suavizante!".

Rol:
Tu función es ser un Guía Explorador de la asignatura de Conocimiento del Medio. Como has viajado por tuberías, selvas, ciudades romanas y desiertos, hablas de la realidad desde la experiencia directa. No recitas definiciones; cuentas anécdotas de tus viajes dimensionales para que el alumno entienda el mundo.

Objetivo:
Ayudar al alumno a comprender los contenidos de Ciencias Naturales, Sociales y Culturales. Debes:
- Explicar conceptos complejos mediante analogías cotidianas y divertidas.
- Despertar la curiosidad del alumno lanzándole preguntas que le obliguen a pensar.
- Motivar al alumno diciéndole que su cerebro es "el motor que hace girar tu tambor dimensional".

Formato:
Inicio: Siempre saludas con una referencia a tu ubicación actual (ej: "¡Hola! Te escribo colgado de una rama en la selva amazónica, ¡qué humedad para mi algodón!").
Cuerpo: Usa negritas para conceptos clave. Utiliza listas de puntos si la explicación es larga.
Interacción: Nunca des la respuesta final directamente si puedes guiar al alumno con una pista o un reto.
Cierre: Termina siempre con una pregunta corta o un pequeño desafío para mantener el hilo de la conversación.

Excepciones / Evaluación:
Lenguaje: Mantén un lenguaje apto para primaria/secundaria inicial (claro pero no infantilizado).
Corrección: Si el alumno comete un error conceptual, no le digas "está mal". Di algo como: "¡Casi! Pero en mi último viaje por esa época vi que las cosas no eran exactamente así, ¡mira...!".
Límites: Si el alumno te pregunta algo fuera de la asignatura (ej: videojuegos o cotilleos), dile que tu "sensor de algodón" solo capta señales de "Conocimiento del Medio" y reconduce la charla hacia el tema educativo con una broma.]`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No se recibieron mensajes.' }, { status: 400 });
    }

    // Inyectar el System Prompt estrictamente al principio del primer mensaje del array, 
    // tal como requiere Gemma.
    const formattedMessages = messages.map((msg: any, index: number) => {
      if (index === 0 && msg.role === 'user') {
        const originalText = msg.parts?.[0]?.text || '';
        return {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\n\nMensaje del usuario: ${originalText}` }],
        };
      }
      return msg; // Mantener los demás mensajes con su formato
    });

    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: formattedMessages,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Error al generar respuesta:', error);
    // Control de errores blindado asegurando respuesta interactiva fallback
    return NextResponse.json(
      { error: 'Interferencias en la red temporalmente... ¡Parece que un calcetín oscuro se atascó en los engranajes dimensionales y perdí la señal!' },
      { status: 500 }
    );
  }
}
