import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

function localApiPlugin() {
  return {
    name: 'vite-plugin-local-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const urlStr = req.url || '';
        if (urlStr.startsWith('/api/')) {
          try {
            const urlObj = new URL(urlStr, 'http://localhost:5173');
            const pathname = urlObj.pathname;
            
            let filePath = path.resolve(process.cwd(), '.' + pathname + '.js');
            if (!fs.existsSync(filePath)) {
              filePath = path.resolve(process.cwd(), '.' + pathname + '/index.js');
            }

            if (fs.existsSync(filePath)) {
              const handlerModule = await server.ssrLoadModule(filePath);
              const handler = handlerModule.default || handlerModule;

              if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
                let bodyStr = '';
                req.on('data', (chunk: any) => { bodyStr += chunk.toString(); });
                req.on('end', async () => {
                  try {
                    req.body = bodyStr ? JSON.parse(bodyStr) : {};
                  } catch {
                    req.body = {};
                  }
                  req.query = Object.fromEntries(urlObj.searchParams.entries());
                  
                  res.status = (code: number) => {
                    res.statusCode = code;
                    return res;
                  };
                  res.json = (data: any) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                  };

                  await handler(req, res);
                });
                return;
              } else {
                req.query = Object.fromEntries(urlObj.searchParams.entries());
                res.status = (code: number) => {
                  res.statusCode = code;
                  return res;
                };
                res.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };

                await handler(req, res);
                return;
              }
            }
          } catch (err) {
            console.error('Local API Handler Error:', err);
          }
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss(), localApiPlugin()];
  try {
    // @ts-expect-error optional source tags script
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {
    /* ignore optional file */
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
            'vendor-motion': ['framer-motion'],
            'vendor-supabase': ['@supabase/supabase-js'],
          },
        },
      },
    },
  };
})
