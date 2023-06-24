<script>
    import { page } from "$app/stores"
    import { goto } from "$app/navigation"

    import { cachedQuery } from "../../../store/cachedQuery";
    import { user } from "../../../store/user"

    import IconInfo from "../../../components/IconInfo.svelte";
    import Alert from "../../../components/Alert.svelte";
    import Modal from "../../../components/Modal.svelte";
    import ModalBody from "../../../components/ModalBody.svelte";
    import { busy, erro, busyMutex, req } from "../../../store/server";

    let [respostas, updater] = cachedQuery("/form/"+$page.params.id)

    /**
     * @typedef {Object} Answer
     * @property {number} answer_id
     * @property {string} ip
     * @property {string} name
     * @property {string} email
     * @property {string} message
    */

    let mostrandoIntegracao = false

    /**
     * @type {{ id:string; user_id:number; name: string; visibility: "public"|"private"; }}
     */
    let form

    let apagandoResposta = false,
        respostaVitima = 0

    const apiPostRequestExample = 
`curl -X POST -H "Content-Type: application/json" -d '{
"name"   : "Fulano Dital",
"message": "Enviando mensagem de contato",
"email"  : "fulano@dital.com"
}' ${import.meta.env.VITE_BASE_URL}/answer/${$page.params.id}`

    const apiListRequestExample =
`curl -X GET ${import.meta.env.VITE_BASE_URL}/form/public/${$page.params.id}/5/0`


    /**
     * @param {number} id
     */
    function apagarResposta(id){
        apagandoResposta = true
        respostaVitima = id
    }
    function cancelaApagamentoResposta(){
        apagandoResposta=false
    }
    async function confirmaApagamentoResposta(){
        if(!apagandoResposta)
            return;
        if(busy)
            return;
        await busyMutex(async ()=>{
            let response = await req("/answer/"+$page.params.id+"/"+respostaVitima,{ method: 'DELETE'})
            if(response.err)
                return;
            // {msg: "mensagem", extra: "extra"}
            // se não caiu no catch é porque deu certo.
            respostas.update( (/** @type {{ data: { answers:Answer[] } }} */ old) => {
                old.data.answers = old.data.answers.filter( (/** @type {{ answer_id: number; }} */ resposta) => resposta.answer_id !== respostaVitima )
                return old
            })
        })
        apagandoResposta=false
    }

    // isso tinha que acontecer antes de mandar carregar as respostas...
    $: if($user.checked && !$user.logged){
        goto("/login")
    }

    $: if($respostas.carregado && $respostas.data){
        form    = $respostas.data.form;
    }

</script>

{#if apagandoResposta}
<Modal title="Deletar essa resposta?">
    <ModalBody>
        <p class="py-4">Você quer mesmo essa resposta?</p>
    </ModalBody>
    <div class="modal-action">
        <fieldset disabled={busy}>
            <button class="btn btn-danger" on:click={cancelaApagamentoResposta}>NÃO</button>
            <button class="btn btn-danger" on:click={confirmaApagamentoResposta}>SIM</button>
        </fieldset>
    </div>
</Modal>
{/if}

<div class="container w-full overflow-x-clip">
{#if $user.logged}
    {#if $respostas.carregado}
        <div>
            {#if form !== undefined}
                <button class="btn btn-primary mb-3" on:click={()=> mostrandoIntegracao = !mostrandoIntegracao}>API</button>
                {#if mostrandoIntegracao}
                    <div class="prose mb-5">
                        <h2>{form.name ?? "{nome do form}"}</h2>
                        <p>
                            {form.visibility == "private" ? "Form privado." : "Form público."}
                        </p>  
                    </div>
                    <div class="mx-auto w-full mb-5 overflow-x-auto">
                        <div class="prose mb-3">
                            <p>Para escrever:</p>
                        </div>
                        <pre class="">{apiPostRequestExample}</pre>
                        {#if form.visibility==="public"}
                        <div class="prose mb-3 mt-3">
                            <p>Para ler 5 respostas a partir da resposta 0 (primeira):</p>
                        </div>
                        <pre class="">{apiListRequestExample}</pre>
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
        {#if $respostas.data.answers}
        <div class="overflow-x-auto">
            <table class="table mx-auto w-full">
                <thead>
                    <tr>
                        <td>Mensagem</td>
                        <td>Nome</td>
                        <td>E-mail</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {#each $respostas.data.answers as resposta (resposta)}
                    <tr>
                        <td><a href="/forminhos/{$page.params.id}/{resposta.answer_id}">{resposta.message}</a></td>
                        <td>{resposta.name}</td>
                        <td>{resposta.email}</td>
                        <td><button on:click={()=>apagarResposta(resposta.answer_id)}>🗑️</button></td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        {:else}
            <Alert>
                <IconInfo/>
                <span class="ml-0 mr-auto">Ainda não tem nenhuma resposta aqui.</span>
            </Alert>
        {/if}
    {/if}
{/if}
</div>