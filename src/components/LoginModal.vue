<script setup>

</script>

<template>
  <div class="modal-backdrop fade show"></div>
  <div class="modal fade" id="LoginModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">登录/注册</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>Hello</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  z-index: 1060;
}

.modal-backdrop {
  z-index: 1050;
}

</style>

