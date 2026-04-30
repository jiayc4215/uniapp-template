# 实践项目

<script setup>
import { withBase } from "vitepress"
</script>

一些已经落地的小项目。

<div class="practice-grid">
  <article class="practice-card">
    <h2>即客二维码解码</h2>
    <p>专业的二维码全能处理工具，支持解析和生成二维码。</p>
    <img :src="withBase('/app1.jpg')" alt="即客二维码解码小程序码" />
  </article>
</div>

<style>
.practice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 28px;
}

.practice-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.practice-card h2 {
  margin: 0;
  border-top: 0;
  padding-top: 0;
  font-size: 22px;
}

.practice-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.practice-card img {
  width: 160px;
  height: 160px;
  margin-top: 4px;
  border-radius: 8px;
  background: #ffffff;
  object-fit: contain;
}

@media (max-width: 960px) {
  .practice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
