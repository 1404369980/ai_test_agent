# PayKKa 交易接口测试工具

PayKKa 跨境支付软件的交易接口测试 Demo，用于测试和调试 PayKKa 支付接口。

## 功能特性

- ✅ 交易接口测试（支付、退款、查询）
- ✅ API 连接测试
- ✅ 多币种支持（USD、EUR、GBP、CNY、JPY）
- ✅ 实时请求/响应展示
- ✅ 签名生成和验证
- ✅ 响应式设计，支持移动端访问
- ✅ 美观的现代化 UI

## 快速开始

### 安装依赖

```sh
npm install
```

### 启动开发服务器（Web 访问）

```sh
npm run dev
```

启动后，你可以通过以下方式访问：

- **本地访问**: http://localhost:5173
- **局域网访问**: http://[你的IP地址]:5173
- **自动打开浏览器**: 服务器启动后会自动打开默认浏览器

### 获取本机 IP 地址

**macOS/Linux:**
```sh
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```sh
ipconfig
```

查找 `IPv4 地址`，然后在其他设备的浏览器中访问 `http://[IP地址]:5173`

### 构建生产版本

```sh
npm run build
```

构建完成后，文件将输出到 `dist` 目录，可以部署到任何静态文件服务器。

### 与 Spring Boot 项目集成

本项目设计为与 Spring Boot 后端一起打包发布。集成步骤如下：

1. **构建前端项目**
   ```sh
   npm run build
   ```

2. **复制构建文件到 Spring Boot 项目**
   - 将 `dist` 目录下的所有文件复制到 Spring Boot 项目的 `src/main/resources/static` 目录
   - 或者配置 Spring Boot 的静态资源路径指向 `dist` 目录

3. **配置 Spring Boot 静态资源处理**
   
   在 Spring Boot 配置类中添加（如果需要支持 SPA 路由）：
   ```java
   @Configuration
   public class WebMvcConfig implements WebMvcConfigurer {
       @Override
       public void addResourceHandlers(ResourceHandlerRegistry registry) {
           registry.addResourceHandler("/**")
                   .addResourceLocations("classpath:/static/");
       }
       
       @Override
       public void addViewControllers(ViewControllerRegistry registry) {
           // 支持 Vue Router 的 history 模式
           registry.addViewController("/").setViewName("forward:/index.html");
       }
   }
   ```

4. **配置 API 代理路径**
   
   前端默认使用 `/proxy/payment` 作为代理接口路径。确保 Spring Boot 后端提供对应的代理接口。
   
   如需自定义代理路径，可在构建时设置环境变量：
   ```sh
   VITE_PROXY_BASE_URL=/your/custom/path npm run build
   ```

5. **打包 Spring Boot 项目**
   ```sh
   mvn clean package
   # 或
   ./gradlew build
   ```

   打包后的 JAR 文件将包含前端静态资源，可直接运行。

### 预览生产构建

```sh
npm run preview
```

## 使用说明

1. **配置 API 信息**
   - 填写 PayKKa API 地址（默认: https://api.paykka.com）
   - 输入商户ID（Merchant ID）
   - 输入 API 密钥（API Key）

2. **填写交易信息**
   - 订单号：可手动输入或点击"生成"自动生成
   - 交易金额：输入要测试的金额
   - 选择币种和交易类型
   - 填写商品描述和回调地址（可选）

3. **执行测试**
   - 点击"测试连接"检查 API 是否可达
   - 点击"提交交易"发送交易请求
   - 在右侧查看详细的请求和响应信息

## 技术栈

- Vue 3 (Composition API)
- Vite
- 原生 JavaScript (无需额外依赖)

## 开发环境要求

- Node.js: ^20.19.0 || >=22.12.0
- npm 或 yarn

## 注意事项

- 当前版本包含模拟响应功能，用于演示和测试
- 实际使用时，请配置正确的 PayKKa API 地址和凭证
- 签名算法为简化版本，生产环境请使用 PayKKa 官方提供的签名算法
- 确保防火墙允许 5173 端口的访问（用于局域网访问）

## 推荐 IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

建议使用现代浏览器以获得最佳体验。
