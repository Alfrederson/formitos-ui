<script>
    // interface do usuário.
    import { goto } from "$app/navigation";
    import { user } from "../../store/user";
    import { req } from "../../store/server"

    import Modal from "../../components/Modal.svelte";
    import ModalBody from "../../components/ModalBody.svelte";

    import { cachedQuery } from "../../store/cachedQuery";

    /** @typedef {{ name: string; id: string; visibility: "public" | "private"; answer_count : number }} Forminho */

    let busy = false
    let erro = ""
    let novoForminho = {
        name : "nome do novo forminho",
        visibility : "private"
    }
    // pode ser melhor usar uma variável "modo" que pode ser "deletando", "editando" ou "criando"
    let deletandoForminho = false
    let editandoForminho  = false
    let criandoForminho   = false


    let [forminhos, updater] = cachedQuery("/forms")
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
    /**
     * Manda uma requisição para deletar um form.
     */
    async function criarForminho(){
        await busyMutex(async ()=>{
            let response = await req("/form",{
                method : "POST",
                body   : {name : novoForminho.name, visibility : novoForminho.visibility}
            })
            let novaLinha = {
                id         : response.id,
                name       : novoForminho.name,
                visibility : novoForminho.visibility,
            }
            // se tiver dado certo, a gente põe ele já na lista de forms.
            forminhos.update( (/** @type {{ data: { name: string; visibility: string; id: any; }[]; }} */ forms) =>{
                forms.data.push(novaLinha)
                return forms
            })
        })
    }
    let forminhoVitima = {
        name : "",
        id   : "",
        visibility : "private"
    }
    /**
     * Mostra o modal de deletar um form.
     * @param {Forminho} forminho
     */
    function deletarForminho(forminho){
        deletandoForminho = true;
        forminhoVitima = {...forminho}
    }
    /**
     * Mostra o modal de editar um form.
     * @param {Forminho} forminho
     */    
    function editarForminho(forminho){
        forminhoVitima = {...forminho}
        editandoForminho = true
    }
    function cancelar(){
        deletandoForminho = false
        editandoForminho  = false
    }
    async function confirmarDelecao(){
        if(!deletandoForminho)
            return;
        await busyMutex(async ()=>{
            let response = await req("/form/"+forminhoVitima.id,{ method: 'DELETE'})
            // {msg: "mensagem", extra: "extra"}
            // se não caiu no catch é porque deu certo.
            forminhos.update( (/** @type {{ data: any[]; }} */ old) => {
                old.data = old.data.filter( form => form.id !== forminhoVitima.id )
                return old
            })
        })
        deletandoForminho=false
    }
    async function confirmarEdicao(){
        if(!editandoForminho)
            return;
        await busyMutex(async ()=>{
            let response = await req("/form/"+forminhoVitima.id,{
                    method: 'PUT',
                    body : {
                        name       : forminhoVitima.name,
                        visibility : forminhoVitima.visibility
                    }
                })
            // torcer pra pessoa não ter 1 milhão de forms
            forminhos.update( (/** @type {{ data: any[]; }} */ old) => {
                for(let form of old.data){
                    if(form.id === forminhoVitima.id){
                        form.name = forminhoVitima.name,
                        form.visibility = forminhoVitima.visibility
                    }
                }
                return old                
            })
        })
        editandoForminho=false;
    }
</script>
{#if deletandoForminho}
<Modal title="Deletar esse forminho?">
    <ModalBody>
        <p class="py-4">Você quer mesmo deletar o form <b>{forminhoVitima.name}</b>?</p>
    </ModalBody>
    <div class="modal-action">
        <button class="btn btn-danger" on:click={cancelar}>NÃO</button>
        <button class="btn btn-danger" on:click={confirmarDelecao}>SIM</button>
    </div>
</Modal>
{/if}
{#if editandoForminho}
<Modal title="Editando forminho">
    <ModalBody>
        <p class="label">Novo nome:</p>
        <input class="input w-full shadow grow mb-3" placeholder="Nome do forminho" bind:value={forminhoVitima.name}/>
        <p class="label">Visibilidade:</p>
        <select class="shadow input" bind:value={forminhoVitima.visibility}>
            <option value="public">Público</option>
            <option value="private">Privado</option>
        </select>
    </ModalBody>
    <div class="modal-action">
        <button class="btn" on:click={cancelar}>Cancelar</button>
        <button class="btn" on:click={confirmarEdicao}>Confirmar</button>
    </div>
</Modal>
{/if}

{#if $user.logged}
    <div class="join mx-auto w-full max-w-2xl my-3 flex gap-2">
        <input class="input join-item shadow grow" placeholder="Nome do forminho" bind:value={novoForminho.name}/>
        <select class="join-item shadow input" bind:value={novoForminho.visibility}>
            <option value="public">Público</option>
            <option value="private">Privado</option>
        </select>
        <button class="btn join-item shadow" on:click={criarForminho}>Criar</button>
    </div>

    <div class="overflow-x-auto max-w-2xl mx-auto bg-base-100">
        {#if $forminhos.carregado}
        <table class="table table-zebra min-w-full">
            <thead>
                <tr>
                    <td>Nome</td>
                    <td>Visibilidade</td>
                    <td>Respostas</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {#each $forminhos.data as forminho}
                    <tr>
                        <td>
                            <a href="/forminhos/{forminho.id}">{forminho.name}</a>
                        </td>
                        <td>
                        {forminho.visibility == "public" ? "Público" : "Privado"}
                        </td>
                        <td>{forminho.answer_count}</td>
                        <td>
                            <button class="btn btn-ghost" on:click={ ()=> editarForminho(forminho)}>📝</button>
                            <button class="btn btn-ghost" on:click={ ()=> deletarForminho(forminho)}>🗑️</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        {/if}
    </div>
{/if}