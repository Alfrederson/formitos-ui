<script>
    import { page } from "$app/stores"
    import { cachedQuery } from "../../../../store/cachedQuery";

    import Alert from "../../../../components/Alert.svelte";

    const [resposta, updater] = cachedQuery("/answer/"+$page.params.id+"/"+$page.params.answerId)
</script>

<div class="container w-full overflow-x-clip">
{#if $resposta.carregado}
    {#if $resposta.error}
        <Alert color="error">{$resposta.error.err}</Alert>
    {/if}   
    {#if $resposta.data}
    <article class="prose">
        <div class="mb-3">
            <p><b>Nome:</b>&nbsp;{$resposta.data.name}</p>
            <p><b>E-mail:</b>&nbsp;{$resposta.data.email}</p>
            <p><b>IP:</b>&nbsp;<a href="https://ip-api.com/#{$resposta.data.ip}">{$resposta.data.ip}</a></p>
        </div>
        <p>{$resposta.data.message}</p>
    </article>        
    {/if}
{/if}
</div>