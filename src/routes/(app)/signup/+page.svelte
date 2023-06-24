<script>
  import { goto } from "$app/navigation";
  import { doSignUp } from "../../../store/user"
  let busy = false
  let error = ""

  let form = {
      name : "",
      email : "",
      password : "",
      password2: ""
  }
  async function tentarCadastrar(){
    if(busy) return;
    busy = true
    try{
      await doSignUp(form)
      goto("/forminhos")
    }catch(e){
      //@ts-expect-error
      error = e.err ?? "Alguma coisa deu errado e não tenho mensagem para mostrar."
    }
    busy = false
  }
  import IconError from "../../../components/IconError.svelte";   
</script>

<div class="modal modal-open modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Criar conta</h3>
    <div class="modal-body">
        {#if error}
          <div class="alert alert-error">
              <IconError/>
              <span>{error}</span>
          </div>
        {/if}
        <p class="py-4">Nome:</p>
        <input type="text" required placeholder="Nome" class="input input-bordered w-full" bind:value={form.name}/>

        <p class="py-4">E-mail:</p>
        <input type="text" required placeholder="E-mail" class="input input-bordered w-full" bind:value={form.email}/>

        <p class="py-4">Senha:</p>
        <input type="password" required placeholder="Senha" class="input input-bordered w-full" bind:value={form.password}/>

        <p class="py-4">Confirmar senha:</p>
        <input type="password" required placeholder="Senha" class="input input-bordered w-full" bind:value={form.password2}/>

    </div>
    <div class="modal-action">
        <a href="/" class="btn btn-outline">Cancelar</a>
        <button class="btn" on:click={tentarCadastrar}>Cadastrar</button>
    </div>
  </div>
</div>