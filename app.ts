//import modul
import {Application, send} from 'https://deno.land/x/oak/mod.ts';
import router from './route.ts';
import userMidleware from './userMidleware.ts'
import "https://deno.land/x/dotenv@v0.5.0/load.ts";

//new instane ke variable
const app = new Application();
app.use(userMidleware);


//definisikan midleware app
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}`
    });
  });
  

//service server
console.log('secvice berjalan di port 8000');
await app.listen({port:8000});
