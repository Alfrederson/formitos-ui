import { req } from "./server"
import { writable } from "svelte/store";

const cache = new Map()
/**
 * Retorna uma tupla com um resultado de uma query e uma função para reatualizá-la.
 * @param {string} url
 */
export function cachedQuery( url ){
    let query = cache.get(url)
    if(query)
        return query;

    let store = writable({
        carregando : true,
        carregado  : false,
        data       : undefined,
        error      : ""
    })

    let updater = async function(){
        try{
            let result = await req(url, {})
            store.update( state => {
                state.carregando = false
                state.carregado  = true
                state.data       = result
                state.error      = ""
                return state
            })
        }catch(e){
            store.update( state => {
                state.carregando = false
                state.carregado  = true
                state.data       = undefined
                //@ts-expect-error
                state.error      = e
                return state
            })
        }
    }

    let tuple = [store,updater]
    cache.set(url,tuple)

    updater()
    return tuple    
}