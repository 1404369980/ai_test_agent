// 生成Mock数据的脚本
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 从数组中随机选择一个元素
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// 生成指定范围内的随机整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成随机邮箱
function generateRandomEmail(prefix = 'user') {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'qq.com', '163.com', 'hotmail.com', 'icloud.com']
  const randomNum = randomInt(0, 9999)
  return `${prefix}${randomNum}@${randomChoice(domains)}`
}

// 预定义的真实数据组合 - 中国数据
const chinaDataSets = [
  { province: '北京', city: '北京', postalCode: '100000', areaCode: '010', address: '北京市朝阳区建国路88号', phonePrefix: '138' },
  { province: '北京', city: '北京', postalCode: '100010', areaCode: '010', address: '北京市海淀区中关村大街1号', phonePrefix: '139' },
  { province: '上海', city: '上海', postalCode: '200000', areaCode: '021', address: '上海市浦东新区陆家嘴环路1000号', phonePrefix: '150' },
  { province: '上海', city: '上海', postalCode: '200120', areaCode: '021', address: '上海市黄浦区南京东路100号', phonePrefix: '151' },
  { province: '广东', city: '广州', postalCode: '510000', areaCode: '020', address: '广州市天河区天河路123号', phonePrefix: '152' },
  { province: '广东', city: '深圳', postalCode: '518000', areaCode: '0755', address: '深圳市南山区科技园南路123号', phonePrefix: '153' },
  { province: '广东', city: '深圳', postalCode: '518001', areaCode: '0755', address: '深圳市福田区深南大道1001号', phonePrefix: '155' },
  { province: '浙江', city: '杭州', postalCode: '310000', areaCode: '0571', address: '杭州市西湖区文三路456号', phonePrefix: '156' },
  { province: '浙江', city: '杭州', postalCode: '310012', areaCode: '0571', address: '杭州市上城区解放路88号', phonePrefix: '157' },
  { province: '江苏', city: '南京', postalCode: '210000', areaCode: '025', address: '南京市鼓楼区中山路321号', phonePrefix: '158' },
  { province: '江苏', city: '苏州', postalCode: '215000', areaCode: '0512', address: '苏州市工业园区星海街200号', phonePrefix: '159' },
  { province: '山东', city: '济南', postalCode: '250000', areaCode: '0531', address: '济南市历下区泉城路180号', phonePrefix: '180' },
  { province: '山东', city: '青岛', postalCode: '266000', areaCode: '0532', address: '青岛市市南区香港中路50号', phonePrefix: '181' },
  { province: '四川', city: '成都', postalCode: '610000', areaCode: '028', address: '成都市锦江区春熙路128号', phonePrefix: '182' },
  { province: '四川', city: '成都', postalCode: '610021', areaCode: '028', address: '成都市武侯区天府大道中段1号', phonePrefix: '183' },
  { province: '湖北', city: '武汉', postalCode: '430000', areaCode: '027', address: '武汉市武昌区中南路99号', phonePrefix: '184' },
  { province: '湖北', city: '武汉', postalCode: '430010', areaCode: '027', address: '武汉市江汉区解放大道688号', phonePrefix: '185' },
  { province: '陕西', city: '西安', postalCode: '710000', areaCode: '029', address: '西安市雁塔区小寨东路126号', phonePrefix: '186' },
  { province: '陕西', city: '西安', postalCode: '710001', areaCode: '029', address: '西安市碑林区南大街1号', phonePrefix: '187' },
  { province: '河南', city: '郑州', postalCode: '450000', areaCode: '0371', address: '郑州市金水区花园路88号', phonePrefix: '188' }
]

// 预定义的真实数据组合 - 美国数据
const usDataSets = [
  { state: 'California', city: 'Los Angeles', postalCode: '90001', areaCode: '310', address: '123 Main Street, Los Angeles, CA', phonePrefix: '310' },
  { state: 'California', city: 'San Francisco', postalCode: '94102', areaCode: '415', address: '456 Market Street, San Francisco, CA', phonePrefix: '415' },
  { state: 'New York', city: 'New York', postalCode: '10001', areaCode: '212', address: '789 Broadway, New York, NY', phonePrefix: '212' },
  { state: 'New York', city: 'Buffalo', postalCode: '14201', areaCode: '716', address: '321 Elm Street, Buffalo, NY', phonePrefix: '716' },
  { state: 'Texas', city: 'Houston', postalCode: '77001', areaCode: '713', address: '654 Oak Avenue, Houston, TX', phonePrefix: '713' },
  { state: 'Texas', city: 'Dallas', postalCode: '75201', areaCode: '214', address: '987 Pine Road, Dallas, TX', phonePrefix: '214' },
  { state: 'Florida', city: 'Miami', postalCode: '33101', areaCode: '305', address: '147 Ocean Drive, Miami, FL', phonePrefix: '305' },
  { state: 'Florida', city: 'Orlando', postalCode: '32801', areaCode: '407', address: '258 Disney Way, Orlando, FL', phonePrefix: '407' },
  { state: 'Illinois', city: 'Chicago', postalCode: '60601', areaCode: '312', address: '369 Michigan Avenue, Chicago, IL', phonePrefix: '312' },
  { state: 'Pennsylvania', city: 'Philadelphia', postalCode: '19101', areaCode: '215', address: '741 Cherry Street, Philadelphia, PA', phonePrefix: '215' },
  { state: 'Ohio', city: 'Columbus', postalCode: '43201', areaCode: '614', address: '852 High Street, Columbus, OH', phonePrefix: '614' },
  { state: 'Georgia', city: 'Atlanta', postalCode: '30301', areaCode: '404', address: '963 Peachtree Street, Atlanta, GA', phonePrefix: '404' }
]

// 预定义的真实数据组合 - 英国数据
const gbDataSets = [
  { state: 'England', city: 'London', postalCode: 'SW1A 1AA', areaCode: '20', address: '123 Oxford Street, London', phonePrefix: '20' },
  { state: 'England', city: 'Manchester', postalCode: 'M1 1AA', areaCode: '161', address: '456 Deansgate, Manchester', phonePrefix: '161' },
  { state: 'England', city: 'Birmingham', postalCode: 'B1 1AA', areaCode: '121', address: '789 New Street, Birmingham', phonePrefix: '121' },
  { state: 'Scotland', city: 'Edinburgh', postalCode: 'EH1 1AA', areaCode: '131', address: '321 Royal Mile, Edinburgh', phonePrefix: '131' },
  { state: 'Scotland', city: 'Glasgow', postalCode: 'G1 1AA', areaCode: '141', address: '654 Buchanan Street, Glasgow', phonePrefix: '141' }
]

// 预定义的真实数据组合 - 日本数据
const jpDataSets = [
  { state: 'Tokyo', city: 'Tokyo', postalCode: '100-0001', areaCode: '03', address: '1-1-1 Marunouchi, Chiyoda-ku, Tokyo', phonePrefix: '03' },
  { state: 'Osaka', city: 'Osaka', postalCode: '530-0001', areaCode: '06', address: '1-1-1 Umeda, Kita-ku, Osaka', phonePrefix: '06' },
  { state: 'Kyoto', city: 'Kyoto', postalCode: '600-0001', areaCode: '075', address: '1-1-1 Karasuma, Shimogyo-ku, Kyoto', phonePrefix: '075' },
  { state: 'Hokkaido', city: 'Sapporo', postalCode: '060-0001', areaCode: '011', address: '1-1-1 Odori, Chuo-ku, Sapporo', phonePrefix: '011' }
]

// 预定义的真实数据组合 - 法国数据
const frDataSets = [
  { state: 'Île-de-France', city: 'Paris', postalCode: '75001', areaCode: '01', address: '123 Rue de Rivoli, Paris', phonePrefix: '01' },
  { state: 'Provence-Alpes-Côte d\'Azur', city: 'Marseille', postalCode: '13001', areaCode: '04', address: '456 La Canebière, Marseille', phonePrefix: '04' },
  { state: 'Auvergne-Rhône-Alpes', city: 'Lyon', postalCode: '69001', areaCode: '04', address: '789 Rue de la République, Lyon', phonePrefix: '04' },
  { state: 'Nouvelle-Aquitaine', city: 'Bordeaux', postalCode: '33000', areaCode: '05', address: '321 Cours de l\'Intendance, Bordeaux', phonePrefix: '05' }
]

// 预定义的真实数据组合 - 新加坡数据
const sgDataSets = [
  { state: 'Central Region', city: 'Singapore', postalCode: '018956', areaCode: '65', address: '123 Orchard Road, Singapore', phonePrefix: '65' },
  { state: 'Central Region', city: 'Singapore', postalCode: '018957', areaCode: '65', address: '456 Marina Bay, Singapore', phonePrefix: '65' }
]

// 预定义的真实数据组合 - 香港数据
const hkDataSets = [
  { state: 'Hong Kong Island', city: 'Hong Kong', postalCode: '999077', areaCode: '852', address: '123 Central, Hong Kong', phonePrefix: '852' },
  { state: 'Kowloon', city: 'Kowloon', postalCode: '999077', areaCode: '852', address: '456 Tsim Sha Tsui, Kowloon', phonePrefix: '852' }
]

// 预定义的真实数据组合 - 德国数据
const deDataSets = [
  { state: 'Berlin', city: 'Berlin', postalCode: '10115', areaCode: '030', address: '123 Unter den Linden, Berlin', phonePrefix: '030' },
  { state: 'Bavaria', city: 'Munich', postalCode: '80331', areaCode: '089', address: '456 Marienplatz, Munich', phonePrefix: '089' }
]

// 预定义的真实数据组合 - 澳大利亚数据
const auDataSets = [
  { state: 'New South Wales', city: 'Sydney', postalCode: '2000', areaCode: '02', address: '123 George Street, Sydney', phonePrefix: '02' },
  { state: 'Victoria', city: 'Melbourne', postalCode: '3000', areaCode: '03', address: '456 Collins Street, Melbourne', phonePrefix: '03' }
]

// 预定义的真实数据组合 - 加拿大数据
const caDataSets = [
  { state: 'Ontario', city: 'Toronto', postalCode: 'M5H 2N2', areaCode: '416', address: '123 Bay Street, Toronto, ON', phonePrefix: '416' },
  { state: 'Quebec', city: 'Montreal', postalCode: 'H3A 0G4', areaCode: '514', address: '456 Rue Sainte-Catherine, Montreal, QC', phonePrefix: '514' }
]

// 生成随机英文名（First Name）
function generateRandomFirstName() {
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mary', 'Nick', 'Olivia', 'Paul', 'Quinn', 'Rose']
  return randomChoice(names)
}

// 生成随机英文姓（Last Name）
function generateRandomLastName() {
  const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez']
  return randomChoice(names)
}

// 生成随机中文姓名
function generateRandomChineseName() {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
  const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '建华', '文', '华', '红', '建国', '建军', '志强', '秀华']
  const surname = randomChoice(surnames)
  const givenName = randomChoice(givenNames)
  return { surname, givenName, fullName: surname + givenName }
}

// 生成中国电话
function generateChinaPhone(phonePrefix) {
  const suffix = randomInt(0, 99999999).toString().padStart(8, '0')
  return `${phonePrefix} ${suffix}`
}

// 生成美国电话
function generateUSPhone(areaCode) {
  const exchange = randomInt(200, 999)
  const number = randomInt(0, 9999).toString().padStart(4, '0')
  return `+1 ${areaCode} ${exchange}${number}`
}

// 生成其他国家电话
function generateInternationalPhone(countryCode, areaCode) {
  const number = randomInt(1000000, 9999999)
  return `+${countryCode} ${areaCode} ${number}`
}

// 生成个人信息数据 - 使用真实数据组合
function generatePersonalInfo(count, countryFilter = null) {
  const personalInfoList = []
  
  // 根据国家筛选数据集
  let dataSets = []
  if (countryFilter === 'CN') {
    dataSets = chinaDataSets
  } else if (countryFilter === 'US') {
    dataSets = usDataSets
  } else if (countryFilter === 'GB') {
    dataSets = gbDataSets
  } else if (countryFilter === 'JP') {
    dataSets = jpDataSets
  } else if (countryFilter === 'FR') {
    dataSets = frDataSets
  } else if (countryFilter === 'SG') {
    dataSets = sgDataSets
  } else if (countryFilter === 'HK') {
    dataSets = hkDataSets
  } else if (countryFilter === 'DE') {
    dataSets = deDataSets
  } else if (countryFilter === 'AU') {
    dataSets = auDataSets
  } else if (countryFilter === 'CA') {
    dataSets = caDataSets
  } else {
    // 混合所有国家的数据
    dataSets = [
      ...usDataSets,
      ...gbDataSets,
      ...jpDataSets,
      ...frDataSets,
      ...sgDataSets,
      ...hkDataSets,
      ...deDataSets,
      ...auDataSets,
      ...caDataSets
    ]
  }
  
  for (let i = 0; i < count; i++) {
    // 从数据集中随机选择一个组合
    const dataSet = randomChoice(dataSets)
    
    let firstName, lastName, fullName, email, phone, address, country, state, city, postalCode, areaCode
    
    if (countryFilter === 'CN') {
      // 中国数据
      const chineseName = generateRandomChineseName()
      firstName = chineseName.surname
      lastName = chineseName.givenName
      fullName = chineseName.fullName
      email = generateRandomEmail(fullName.toLowerCase().replace(/[^\w]/g, ''))
      phone = generateChinaPhone(dataSet.phonePrefix)
      address = dataSet.address
      country = 'CN'
      state = dataSet.province
      city = dataSet.city
      postalCode = dataSet.postalCode
      areaCode = dataSet.areaCode
    } else if (dataSet.state && dataSet.city) {
      // 国际数据
      firstName = generateRandomFirstName()
      lastName = generateRandomLastName()
      fullName = `${firstName} ${lastName}`
      email = generateRandomEmail(fullName.toLowerCase().replace(' ', '.'))
      
      // 根据数据集确定国家
      if (usDataSets.includes(dataSet)) {
        country = 'US'
        phone = generateUSPhone(dataSet.areaCode)
      } else if (gbDataSets.includes(dataSet)) {
        country = 'GB'
        phone = generateInternationalPhone('44', dataSet.areaCode)
      } else if (jpDataSets.includes(dataSet)) {
        country = 'JP'
        phone = generateInternationalPhone('81', dataSet.areaCode)
      } else if (frDataSets.includes(dataSet)) {
        country = 'FR'
        phone = generateInternationalPhone('33', dataSet.areaCode)
      } else if (sgDataSets.includes(dataSet)) {
        country = 'SG'
        phone = generateInternationalPhone('65', dataSet.areaCode)
      } else if (hkDataSets.includes(dataSet)) {
        country = 'HK'
        phone = generateInternationalPhone('852', dataSet.areaCode)
      } else if (deDataSets.includes(dataSet)) {
        country = 'DE'
        phone = generateInternationalPhone('49', dataSet.areaCode)
      } else if (auDataSets.includes(dataSet)) {
        country = 'AU'
        phone = generateInternationalPhone('61', dataSet.areaCode)
      } else if (caDataSets.includes(dataSet)) {
        country = 'CA'
        phone = generateUSPhone(dataSet.areaCode) // 加拿大使用类似美国的格式
      }
      
      address = dataSet.address
      state = dataSet.state
      city = dataSet.city
      postalCode = dataSet.postalCode
      areaCode = dataSet.areaCode
    }
    
    personalInfoList.push({
      firstName,
      lastName,
      email,
      phone,
      addressLine1: address,
      country,
      state,
      city,
      postalCode,
      areaCode
    })
  }
  
  return personalInfoList
}

// 生成信用卡数据
function generateCardInfo(count) {
  const testCardNumbers = [
    '4242424242424242', // Visa
    '5555555555554444', // Mastercard
    '378282246310005',  // American Express
    '6011111111111117', // Discover
    '4111111111111111', // Visa
    '4000000000000002', // Visa (declined)
    '4000000000009995', // Visa (insufficient funds)
    '4000002500003155'  // Visa (3D Secure)
  ]
  
  const cardInfoList = []
  
  for (let i = 0; i < count; i++) {
    const firstName = generateRandomFirstName()
    const lastName = generateRandomLastName()
    const holderName = `${firstName} ${lastName}`
    const holderEmail = generateRandomEmail(holderName.toLowerCase().replace(' ', '.'))
    const cardNo = randomChoice(testCardNumbers)
    const cvv = String(randomInt(100, 999)) // 100-999
    const currentYear = new Date().getFullYear()
    const expYear = String(currentYear + randomInt(1, 10)) // 未来1-10年
    const expMonth = String(randomInt(1, 12)).padStart(2, '0') // 01-12
    
    cardInfoList.push({
      cardNo,
      holderName,
      holderEmail,
      cvv,
      expYear,
      expMonth
    })
  }
  
  return cardInfoList
}

// 主函数
function generateMockData() {
  const count = 20 // 默认生成20条国际数据
  const chinaCount = 20 // 生成20条中国数据
  
  console.log(`开始生成Mock数据...`)
  
  // 生成国际个人信息数据（混合多个国家）
  const personalInfo = generatePersonalInfo(count)
  console.log(`✓ 已生成 ${personalInfo.length} 条国际个人信息数据`)
  
  // 生成中国个人信息数据
  const chinaPersonalInfo = generatePersonalInfo(chinaCount, 'CN')
  console.log(`✓ 已生成 ${chinaPersonalInfo.length} 条中国个人信息数据`)
  
  // 合并个人信息数据
  const allPersonalInfo = [...personalInfo, ...chinaPersonalInfo]
  
  // 生成信用卡数据
  const cardInfo = generateCardInfo(count)
  console.log(`✓ 已生成 ${cardInfo.length} 条信用卡数据`)
  
  // 构建导出数据
  const mockData = {
    personalInfo: allPersonalInfo,
    cardInfo,
    generatedAt: new Date().toISOString(),
    count: {
      personalInfo: allPersonalInfo.length,
      cardInfo: cardInfo.length,
      international: personalInfo.length,
      china: chinaPersonalInfo.length
    }
  }
  
  // 确保目录存在
  const outputDir = path.join(__dirname, '../public/mock-data')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`✓ 已创建目录: ${outputDir}`)
  }
  
  // 写入JSON文件
  const outputPath = path.join(outputDir, 'mock_data.json')
  const jsonContent = JSON.stringify(mockData, null, 2)
  fs.writeFileSync(outputPath, jsonContent, 'utf8')
  
  console.log(`✓ Mock数据已写入: ${outputPath}`)
  console.log(`✓ 总计: ${allPersonalInfo.length} 条个人信息 (${personalInfo.length}条国际 + ${chinaPersonalInfo.length}条中国) + ${cardInfo.length} 条信用卡数据`)
}

// 执行生成
generateMockData()
