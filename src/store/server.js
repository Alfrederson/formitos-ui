
const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * Faz uma requisição no servidor.
 * @param {string} url
 * @param {Record<string, any>} options
 */
async function req(url, options){
    // ve se tem um token aqui.
    let headers = new Headers()

    let token = localStorage.getItem("token")
    if(token){
        headers.append("Authorization","Bearer "+token)
    }

    if(options.body){
        headers.append('Content-Type','application/json')
        options.body = JSON.stringify(options.body)
    }

    let requestOptions = {
        ...options,
        headers
    }

    let response = await fetch(BASE_URL + url, requestOptions)
    if(response.status !== 200){
        let text = await response.json()
        throw text
    }
    let obj = await response.json()
    return obj
}

let busy = false, erro = "";
/**
 * @param {{ (): Promise<void>; (): any; }} func
 */
async function busyMutex( func ){
    if(busy) return;
    busy = true;
    try{
        await func()
    }catch(e){
        // @ts-ignore
        erro = e
    }
    busy = false
}


export { req, busy, erro, busyMutex }