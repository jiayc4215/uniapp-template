# Vite 开发环境配置 HTTPS

本项目已经集成 `@vitejs/plugin-basic-ssl`，并在开发服务器中开启 HTTPS，主要用于 H5 端调试需要安全上下文的能力，例如定位、部分浏览器 API、代理到 HTTPS 服务等。

## 当前依赖

根目录 `package.json` 已包含：

```json
{
  "devDependencies": {
    "@vitejs/plugin-basic-ssl": "^2.3.0"
  }
}
```

如果从空项目接入，可以执行：

```bash
pnpm add -D @vitejs/plugin-basic-ssl
```

## 项目配置

`vite.config.js` 中已注册插件：

```js
import basicSsl from "@vitejs/plugin-basic-ssl"

export default defineConfig({
  plugins: [basicSsl()],
  server: {
    https: true,
    host: "0.0.0.0",
    hmr: true,
    port: Number.parseInt(VITE_APP_PORT, 10)
  }
})
```

开发端口来自 `env/.env.*` 中的 `VITE_APP_PORT`。

## 启动

```bash
pnpm dev:h5
```

启动后访问终端输出的 `https://localhost:端口`。首次访问自签名证书时，浏览器会提示连接不受信任，开发环境选择继续访问即可。

## 局域网调试

当前 `host` 已设置为 `0.0.0.0`，同一局域网设备可以通过本机 IP 访问：

```text
https://你的局域网IP:端口
```

如果移动端浏览器提示证书不可信，这是自签名证书的正常表现。需要长期调试时，可以将插件生成的证书加入系统信任列表，或改用团队统一的本地证书方案。

## 注意事项

- `@vitejs/plugin-basic-ssl` 只适合本地开发，不要把自签名证书用于生产环境。
- 修改 `vite.config.js` 后需要重启开发服务。
- 如果证书异常，可以删除插件生成的证书缓存后重新启动开发服务。
- H5 代理配置仍然由 `VITE_APP_PROXY_ENABLE`、`VITE_APP_PROXY_PREFIX` 和 `VITE_SERVER_BASEURL` 控制。
