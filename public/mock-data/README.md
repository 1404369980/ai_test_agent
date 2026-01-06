# Mock 数据说明

## 文件位置
`public/mock-data/mock_data.json`

## 数据结构

### 个人信息 (personalInfo)
每条个人信息包含以下字段：
- `firstName`: 名
- `lastName`: 姓
- `email`: 邮箱
- `phone`: 电话
- `addressLine1`: 地址
- `country`: 国家代码
- `state`: 州/省
- `city`: 城市
- `postalCode`: 邮编
- `areaCode`: 区号

### 信用卡信息 (cardInfo)
每条信用卡信息包含以下字段：
- `cardNo`: 卡号（测试卡号）
- `holderName`: 持卡人姓名
- `holderEmail`: 持卡人邮箱
- `cvv`: CVV码
- `expYear`: 过期年份
- `expMonth`: 过期月份

## 使用方法

### 重新生成数据
运行以下命令重新生成mock数据：
```bash
npm run generate:mock
```

或者直接运行脚本：
```bash
node scripts/generateMockData.js
```

### 在代码中使用
可以通过以下方式加载mock数据：

```javascript
// 在浏览器中
fetch('/mock-data/mock_data.json')
  .then(res => res.json())
  .then(data => {
    console.log('个人信息:', data.personalInfo)
    console.log('信用卡信息:', data.cardInfo)
  })

// 在Node.js中
import fs from 'fs'
import path from 'path'

const mockDataPath = path.join(process.cwd(), 'public/mock-data/mock_data.json')
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'))
```

## 数据用途
这些mock数据可用于：
- 支付平台测试
- 账单信息填充
- 收货信息填充
- 信用卡信息测试
- 自动化测试场景

