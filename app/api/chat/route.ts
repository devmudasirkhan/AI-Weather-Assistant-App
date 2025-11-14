import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import axios from 'axios';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const formattedMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.content || '',
  }));

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Google Generative AI API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your .env file.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: formattedMessages,
    tools: {
      get_current_weather: {
        description: 'Get current weather for a given location using WeatherAPI.com',
        inputSchema: z.object({
          location: z.string().describe('City or place to get the weather for'),
        }),
        execute: async ({ location }) => {
          const apiKey = process.env.WEATHER_API_KEY!;
          const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;
          const res = await axios.get(url);
          const data = res.data;
          return {
            location_name: `${data.location.name}, ${data.location.country}`,
            temperature_celsius: data.current.temp_c,
            condition_text: data.current.condition.text,
            condition_code: data.current.condition.code,
            humidity: data.current.humidity,
            wind_kph: data.current.wind_kph,
            wind_dir: data.current.wind_dir,
          };
        },
      },
    },
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of result.fullStream) {
        if (chunk.type === 'text-delta') {
          controller.enqueue(encoder.encode(chunk.text));
        } else if (chunk.type === 'tool-result') {
          const toolData = JSON.stringify({
            type: 'tool-result',
            toolName: chunk.toolName,
            result: chunk.output,
          });
          controller.enqueue(encoder.encode(`\n__TOOL__${toolData}__TOOL__\n`));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
