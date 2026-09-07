import { NextResponse } from 'next/server';
import net from 'net';

export async function GET() {
  const host = 'aws-0-ap-northeast-1.pooler.supabase.com';
  const port = 6543;

  const result = await new Promise<{ success: boolean; message: string }>((resolve) => {
    const socket = net.createConnection(port, host, () => {
      socket.end();
      resolve({ success: true, message: `Connected to ${host}:${port}` });
    });

    socket.on('error', (err) => {
      resolve({ success: false, message: `Error connecting to ${host}:${port} - ${err.message}` });
    });

    socket.setTimeout(4000, () => {
      socket.destroy();
      resolve({ success: false, message: `Timeout connecting to ${host}:${port}` });
    });
  });

  return NextResponse.json({ vercel: !!process.env.VERCEL, result });
}
