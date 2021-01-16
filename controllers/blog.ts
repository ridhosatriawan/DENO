import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { insert, select } from "../models/model.ts";
import TSql from "../models/sql.ts"

import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt@v1.7/create.ts";

const home = async({response, state} : {response : any, state:any}) => {
    let userLoged : string = 'TAMU';
    if((state.currentUser != undefined) && (state.currentUser != "")){
        userLoged = state.currentUser;
    }
    const dataTable = await select(
        [
            {text : TSql['KtgFindAll']},
            {text : TSql['BlogInfoFindAll']}

        ]
        );
    const home = await renderFileToString("./views/home.ejs", {
        data : {
            pemrograman : dataTable[0],
            blogInfo : dataTable[1],
            userInfo : userLoged
        },
        subview : {
            namafile : "./views/blog-main.ejs",
            showjumbo : true
        }
    });
    response.body = new TextEncoder().encode(home);
}

const signup = async({response, request, state} : {response : any,request : any, state : any}) => {
    if(!request.hasBody){
        let signupError : string = '';
        if((state.pesanError != undefined) && (state.pesanError != '')){
            signupError = 'username atau password sudah di gunakan';
        }
        let userLoged : string = 'TAMU';
        if((state.currentUser != undefined) && (state.currentUser != "")){
            userLoged = state.currentUser;
        }
        const home = await renderFileToString("./views/home.ejs", {
            data: {
                pemrograman : await select({
                    text : TSql['KtgFindInCode'],
                    args : ['js','ts','php','py']
                }),
                blogInfo : await select({
                    text  : TSql['BlogInfoFindAll']
                }),
                statusSigup : signupError,
                userInfo : userLoged
            },
            subview : {
                namafile : "./views/signup.ejs",
                showjumbo : false
            }
        });
        response.body = new TextEncoder().encode(home);
    } else {
        const body = await request.body().value;
        const parseData = new URLSearchParams(body);
        const namalengkap = parseData.get("name");
        const user = parseData.get("user");
        const password = parseData.get("pass");

        let hasil = await insert({
            text : TSql['InsUser'],
            args : [user,namalengkap,password]
        });

        if(hasil[0]== 'sukses'){
            state.pesanError = ''
            response.body = 'sukses menyimpan data';
        } else {
            state.pesanError = hasil[1];
            response.redirect('/signup');
        }
    }

}

const login = async({response, request, state, cookies} : {response : any,request : any, state : any, cookies:any})=> {
    if(!request.hasBody){
        let loginError : string = '';
        if((state.statusLogin != undefined) && (state.statusLogin != '')){
            loginError = state.statusLogin;
        }

        let userLoged : string = 'TAMU';
        if((state.currentUser != undefined) && (state.currentUser != "")){
            userLoged = state.currentUser;
        }
        const home = await renderFileToString("./views/home.ejs", {
            data: {
                pemrograman : await select({
                    text : TSql['KtgFindInCode'],
                    args : ['js','ts','php','py']
                }),
                blogInfo : await select({
                    text  : TSql['BlogInfoFindAll']
                }),
                statusLogin : loginError,
                userInfo : userLoged
            },
            subview : {
                namafile : "./views/login.ejs",
                showjumbo : false
            },
        });
        response.body = new TextEncoder().encode(home); 
    } else {
        const body = await request.body().value;
        const parseData = new URLSearchParams(body);
        const user : string= parseData.get("user") || '';
        const password = parseData.get("pass");


        let hasil = await select({
            text : TSql['SelUser'],
            args : [user,password]
        });
        

        if(hasil.length > 0){
            const payload: Payload = {
                iss: user,
                exp: setExpiration(new Date().getTime()+1000 * 60 * 60),
            };
            const header: Jose = {
                alg: "HS256",
                typ: "JWT",
            };

            const jwt = await makeJwt({ header, payload, key : Deno.env.get('JWT_KEY') || '' });
            cookies.set("jwt_saya", jwt);

            state.statusLogin = '';
            response.redirect('/');
        } else {
            state.statusLogin = 'username / password salah!';
            response.redirect('/login');
        }
    }
}

const logout = async({response, state, cookies} : {response : any, state : any, cookies:any}) => {
    state.currentUser = '';
    cookies.delete("jwt_saya");
    response.redirect('/');
}

const posting = async({response, request, state, cookies} : {response : any, request : any, state : any, cookies:any}) => {
    if(!request.hasBody){

        let userLoged : string = 'TAMU';
        if((state.currentUser != undefined) && (state.currentUser != "")){
            userLoged = state.currentUser;
        }
        const home = await renderFileToString("./views/home.ejs", {
            data: {
                pemrograman : await select({
                    text : TSql['KtgFindInCode'],
                    args : ['js','ts','php','py']
                }),
                blogInfo : await select({
                    text  : TSql['BlogInfoFindAll']
                }),
                userInfo : userLoged
            },
            subview : {
                namafile : "./views/posting.ejs",
                showjumbo : false
            },
        });
        response.body = new TextEncoder().encode(home);
    }
}

export {home,signup,login,logout,posting} ;