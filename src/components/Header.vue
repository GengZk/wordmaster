<template>
  <header>
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <i class="fas fa-book-open"></i>
          <span>WordMaster</span>
        </div>
        <nav>
          <ul>
            <li><router-link to="/" class="active">首页</router-link></li>
            <li><a href="#">词汇库</a></li>
            <li><a href="#">学习计划</a></li>
            <li><a href="#">我的进度</a></li>
            <li><a href="#">设置</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script> 