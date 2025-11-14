import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import axios from 'axios';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Transform messages to the correct format for the AI SDK
  const formattedMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.content || '',
  }));

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

          try {
            const res = await axios.get(url);
            const data = res.data;
            const weatherData = {
              location_name: data.location.name,
              temperature_celsius: data.current.temp_c,
              condition_text: data.current.condition.text,
              condition_code: data.current.condition.code,
            };
            return weatherData;
          } catch (error) {
            throw new Error('Unable to fetch weather data');
          }
        },
      },
    },
  });

  // Create a custom stream that includes both text and tool results
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const chunk of result.fullStream) {
        if (chunk.type === 'text-delta') {
          controller.enqueue(encoder.encode(chunk.text));
        } else if (chunk.type === 'tool-result') {
          // Send tool result as a special marker
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
