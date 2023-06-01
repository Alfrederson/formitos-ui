<script>
    export let color=""
</script>
<div class="alert {color && "alert-"+color} max-w-lg">
    <slot/>
</div>
  