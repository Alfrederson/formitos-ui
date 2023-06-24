<script>
    import { goto } from "$app/navigation"
    import { doLogin } from "../../store/user"
    import IconError from "../../components/IconError.svelte";

    let form = {
        email : "",
        password : ""
    }
    let busy = false
    let error = ""

    async function tentarLogar(){
        if(busy) return;
        busy = true
        error = ""
        try{
            await doLogin(form)
            goto("/forminhos")
        }catch(e){
            // @ts-expect-error
            error = e.err ?? "Alguma coisa deu errado e não sei o que mostrar."
        }
        busy = false
    }
</script>

<div class="modal modal-open modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Login</h3>
    <div class="modal-body">
        {#if error}
            <div class="alert alert-error">
                <IconError/>
                <span>{error}</span>
            </div>
        {/if}
        <p class="py-4">E-mail:</p>
        <input type="text" placeholder="E-mail" class="input input-bordered w-full" bind:value={form.email}/>
        <p class="py-4">Senha:</p>
        <input type="password" placeholder="Senha" class="input input-bordered w-full" bind:value={form.password}/>
    </div>
    <div class="modal-action">
        <a href="/" class="btn btn-outline">Cancelar</a>
        <button class="btn" on:click={tentarLogar}>Logar</button>
    </div>
  </div>
</div>