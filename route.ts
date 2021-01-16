import {Router} from 'https://deno.land/x/oak/mod.ts';
import {home,signup,login,logout,posting} from './controllers/blog.ts';

const router = new Router();

router
.get("/",home)
.get("/signup", signup)
.post("/signup", signup)
.get("/login", login)
.post("/login", login)
.get('/logout', logout)
.get('/posting', posting)
.post('/posting', posting)
.get(
    "/kategori", (ctx) => {
        ctx.response.body = "kategori"
    }
)
.get(
    "/tentang", (ctx) => {
        ctx.response.body = "tentang"
    }
);

export default router;