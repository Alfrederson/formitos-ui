<script>
    import { page } from "$app/stores"
    import { cachedQuery } from "../../../store/cachedQuery";
    import { user } from "../../../store/user"

    import IconInfo from "../../../components/IconInfo.svelte";
    import Alert from "../../../components/Alert.svelte";

    let [respostas, updater] = cachedQuery("/form/"+$page.params.id)

    /**
     * @type {{ id:string; user_id:number; name: string; visibility: "public"|"private"; }}
     */
    let form
    /**
     * @type {{answer_id: number; name:string; email:string; message: string}[]}
     */
    let answers
    let erro

    $: if($respostas.carregado && $respostas.data){
        form    = $respostas.data.form;
        answers = $respostas.data.answers;
        erro    = $respostas.erro;
    }


    const exampleRequest = 
`curl -X POST -H "Content-Type: application/json" -d '{
"name"   : "Fulano Dital",
"message": "Enviando mensagem de contato",
"email"  : "fulano@dital.com"
}' ${import.meta.env.VITE_BASE_URL}/answer/${$page.params.id}`

</script>

<div class="container w-full overflow-x-clip">
{#if $user.logged}
    {#if $respostas.carregado}
        {#if form !== undefined}
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
<pre class="">
{exampleRequest}               
</pre>
            </div>
        {/if}

        {#if answers.length > 0}
        <div class="overflow-x-auto">
            <table class="table mx-auto w-full">
                <thead>
                    <tr>
                        <td>Nome</td>
                        <td>E-mail</td>
                        <td>Mensagem</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {#each answers as resposta}
                    <tr>
                        <td>{resposta.name}</td>
                        <td>{resposta.email}</td>
                        <td><a href="/forminhos/{$page.params.id}/{resposta.answer_id}">{resposta.message}</a></td>
                        <td><a href="/forminhos/apagar/{$page.params.id}/{resposta.answer_id}">🗑️</a></td>
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