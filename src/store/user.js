import { req } from "./server"
import { writable } from "svelte/store";

/**
 * @typedef {import('./user').UserClaims} UserClaims
 * @typedef {import('./user').LoginData} LoginData
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
    tryingToLogIn: false,
    tryingToRefresh: false,
    claims: {},
}

/** @type {import("svelte/store").Writable<UserStore>} */
const user = writable(initialValues)

/**
 * @param {LoginData} data 
 */
async function doLogin(data){
    if(user.tryingToLogIn)
        return;
    user.update( user =>{
        user.tryingToLogIn = true
        return user
    })
    const {email, password} = data
    let result = await req("/auth/signin",{
        method : 'POST',
        body   : {email, password}
    })
    if(result.tok){
        localStorage.setItem("token", result.tok)
        user.update( user => {
            user.logged = true
            user.tryingToLogIn = false
            user.claims = parseJWT( result.tok )
            return state
        })
    }else{
        localStorage.removeItem("token")
        user.set({...initialValues})
    }
}

async function checkIfLogged(){
    if(user.tryingToRefresh)
        return;
    user.update( user=>{
        user.tryingToRefresh = true
        return user
    })
    let result = await req("/auth/refresh",{
        method : 'POST'
    })
    // ieaeaaaarhhhh
    if(result.tok){
        localStorage.setItem("token", result.tok)
        user.update( user =>{
            user.tryingToRefresh=false
            user.logged=true
            user.claims = parseJWT( result.tok )
            return user
        })
    }else{
        localStorage.removeItem("token")
        user.set({...initialValues})
    }
}

export { user, doLogin, checkIfLogged }