<script>
    export let title = "...";
</script>
<div class="modal modal-open modal-bottom sm:modal-middle">
    <div class="modal-box">
        <div class="modal-header">
            <h3 class="font-bold text-lg">{title}</h3>
        </div>
        <slot/>
    </div>
</div>