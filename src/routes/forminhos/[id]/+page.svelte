<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores"
    import { cachedQuery } from "../../../store/cachedQuery";
    import { user } from "../../../store/user"

    import IconInfo from "../../../components/IconInfo.svelte";
    import Alert from "../../../components/Alert.svelte";

    let [respostas, updater] = cachedQuery("/form/"+$page.params.id)

    /**
     * @type {{ id:string; user_id:number; name: string; is_public: number; }}
     */
    let form
    /**
     * @type {{answer_id: number; name:string; email:string; message: string}[]}
     */
    let answers
    let erro

    $: if($respostas.carregado){
        form = $respostas.data.form;
        answers = $respostas.data.answers;
        erro = $respostas.erro;
    }

</script>

{#if $user.logged}
    {#if $respostas.carregado}
        {#if form}
            <div class="container">
                <h1>{form.name ?? "{nome do form}"}</h1>
                <p>
                    {form.is_public == 0 ? "Form privado." : "Form público."}
                </p>
            </div>
        {/if}

        {#if answers.length > 0}
            <div class="container overflow-x-auto">
                <table class="table">
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
                            <td>{resposta.message}</td>
                            <td><a href="/forminhos/apagar/{$page.params.id}/{resposta.answer_id}">🗑️</a></td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <Alert>
                <IconInfo/>
                <span>Ainda não tem nenhuma resposta aqui.</span>
            </Alert>
        {/if}
    {/if}
{/if}