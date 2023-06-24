import { req } from "./server"
import { writable } from "svelte/store";

/**
 * @typedef {import('./user').UserClaims} UserClaims
 * @typedef {import('./user').LoginData} LoginData
 * @typedef {import('./user').SignUpData} SignUpData
 * @typedef {import('./user').UserStore} UserStore
 */

// by chatgpt
function parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

/** @type {UserStore} */
const initialValues = {
    logged: false,
    checked:false,
    busy: false,
    claims: {},
}

/** @type {import("svelte/store").Writable<UserStore>} */
const user = (function(){
    let store = writable(initialValues)
    store.lock = function(){
        store.update( s =>{
            s.busy = true
            return s
        })
    }
    store.unlock = function(){
        store.update( s=>{
            s.busy = false
            return s
        })
    }
    return store
})()

/**
 * @param {LoginData} data 
 */
async function doLogin(data){
    if(user.busy)
        return;
    user.lock()

    const {email, password} = data
    let result = await req("/auth/signin",{
        method : 'POST',
        body   : {email, password}
    })
    if(result.tok){
        localStorage.setItem("token", result.tok)
        user.update( user => {
            user.logged=true
            user.checked=true
            user.claims = parseJWT( result.tok )
            return user
        })
    }else{
        localStorage.removeItem("token")
        user.set({...initialValues, checked : true})
    }

    user.unlock()
}

async function doSignUp(data){
    if(user.busy)
        return;
    user.lock()
    let result = await req("/auth/signup",{
        method : 'POST',
        body : {
            name    : data.name,
            email   : data.email,
            password: data.password
        }
    })

    user.unlock()
}

async function checkIfLogged(){
    console.log("Checando se logado...")
    if(user.busy)
        return;
    if(!localStorage.getItem("token")){
        user.update( user => ({
                ...user,
                busy : false,
                logged : false,
                checked : true,
                claims : {}
            })
        )
        return
    }
    user.lock()
    try{ 
        let result = await req("/auth/refresh",{
            method : 'POST'
        })
        // ieaeaaaarhhhh
        if(result.tok){
            localStorage.setItem("token", result.tok)
            user.update( user =>({
                ...user,
                busy:false,
                logged:true,
                checked:true,
                claims: parseJWT( result.tok)
            }) )
        }else{
            localStorage.removeItem("token")
            user.set({...initialValues})
        }
    }catch(e){
        // isso vai ser tipo {err : "não autenticado"}
        // console.log(e)
    }
    user.unlock()
}

function doLogOut(){
    localStorage.removeItem("token")
    user.set( {...initialValues} )
}


export { user, doLogin, doLogOut, doSignUp, checkIfLogged }