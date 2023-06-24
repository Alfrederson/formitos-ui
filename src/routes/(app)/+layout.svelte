<script>
    import { onMount } from "svelte";
    import "../../app.css"
    import { user, doLogOut, checkIfLogged } from "../../store/user"

    onMount( ()=>{
      checkIfLogged()
    })

    async function logOut(){
      await doLogOut()
    }
</script>

<div class="navbar">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl" href="/">📝 Forminho</a>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        {#if $user.checked}
          {#if $user.logged}          
            <label tabindex="0" class="btn btn-ghost">
              <b>{$user.claims.name}</b>
            </label>
            <ul tabindex="0" class="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a href="/forminhos">Seus forminhos</a></li>
              <li><button on:click={logOut}>Logout</button></li>
            </ul>
          {:else}
            <a class="btn btn-ghost" href="/signup">Criar conta</a>
            <a class="btn btn-primary" href="/login">Login</a>
          {/if}
        {/if}
      </div>
    </div>
  </div>


<div class="container mx-auto p-3">
  <div class="mx-auto max-w-6xl">
    {#if $user.checked}
      <slot/>
    {/if}
  </div>
</div>

<style lang="postcss">
    :global(html) {
      background-color: theme(colors.gray.50);
    }
</style>