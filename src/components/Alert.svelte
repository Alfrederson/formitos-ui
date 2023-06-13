<script>
    export let color=""
</script>
<div class="alert {color && "alert-"+color} max-w-lg mx-auto">
    <slot/>
</div>
  