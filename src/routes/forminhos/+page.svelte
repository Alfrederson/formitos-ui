<script>
    import { goto } from "$app/navigation";
    import { user } from "../../store/user";
    import { req } from "../../store/server"

    import { cachedQuery } from "../../store/cachedQuery";
    import { idText } from "typescript";

    let criandoNovo = false
    let erro = ""
    let novoForminho = {
        form_name : "nome do novo forminho",
        is_public : "false"
    }

    let [forminhos, updater] = cachedQuery("/forms")

    async function criarForminho(){
        if(criandoNovo) return;
        criandoNovo = true;
        try{
            console.log(novoForminho)
            let response = await req("/form",{
                method : "POST",
                body   : novoForminho
            })
            await updater()
        }catch(e){
            // @ts-expect-error
            erro = e
            alert(erro)
        }
        criandoNovo = false;
    }
</script>

{#if $user.logged}
    <div class="join mx-auto w-full max-w-2xl my-3 flex gap-2">
        <input class="input join-item shadow grow" placeholder="Nome do forminho" bind:value={novoForminho.form_name}/>
        <select class="join-item shadow input" bind:value={novoForminho.is_public}>
            <option value="true">Público</option>
            <option value="false">Privado</option>
        </select>
        <button class="btn join-item shadow" on:click={criarForminho}>Criar</button>
    </div>


    <div class="overflow-x-auto max-w-2xl mx-auto bg-base-100">

    {#if $forminhos.carregado}
    <table class="table table-zebra min-w-full">
        <thead>
            <tr>
                <td>Nome</td>
                <td>Público?</td>
            </tr>
        </thead>
        <tbody>
            {#each $forminhos.data as forminho}
                <tr>
                    <td>
                        <a href="/forminhos/{forminho.id}">{forminho.name}</a>
                    </td>
                    <td>
                    {forminho.is_public == 0 ? "não" : "sim"}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {/if}
    </div>
{/if}