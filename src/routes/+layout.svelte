<script>
    import "../app.css"
    import { onMount } from "svelte";
    import { user, checkIfLogged } from "../store/user"

    onMount( ()=>{
      checkIfLogged()
    })

</script>

<div class="navbar bg-secondary text-neutral-content">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl" href="/landing">Forminho</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        {#if $user.logged}
          <li><a href="/forminhos">Seus forminhos</a></li>
          <li><b>{$user.claims.name}</b></li>
        {:else}
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Criar conta</a></li>
        {/if}
      </ul>
    </div>
  </div>


<div class="container mx-auto p-3">
  <div class="mx-auto max-w-6xl">
    <slot/>
  </div>
</div>

<style lang="postcss">
    :global(html) {
      background-color: theme(colors.gray.50);
    }
</style>