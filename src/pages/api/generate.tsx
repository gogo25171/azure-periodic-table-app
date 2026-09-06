// src/pages/api/generate.tsx

import { Readable } from 'node:stream';
import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/logger';

/**
 * Proxies a streamed completion from OpenAI to the browser as Server-Sent
 * Events. Uses the runtime `fetch` (Node 18+) rather than an HTTP client
 * dependency.
 */
const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.OPENAI_API_KEY) {
    logger.warn('chat', 'OPENAI_API_KEY is missing, refusing the request');
    return res.status(503).json({ error: 'not-configured' });
  }

  try {
    const openaiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!openaiResponse.ok || !openaiResponse.body) {
      logger.error(
        'chat',
        `OpenAI answered ${openaiResponse.status} ${openaiResponse.statusText}`
      );
      return res.status(502).json({ error: 'Request failed' });
    }

    // Set headers to enable Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the OpenAI response stream directly to the client
    const stream = Readable.fromWeb(openaiResponse.body as any);
    stream.on('error', (error) => {
      logger.error('chat', 'Error while streaming the OpenAI response', error);
      res.end();
    });
    stream.pipe(res);
  } catch (error) {
    logger.error('chat', 'The OpenAI request failed', error);
    res.status(500).json({ error: 'Request failed' });
  }
};

export default handleRequest;
