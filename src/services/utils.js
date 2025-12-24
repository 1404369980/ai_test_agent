// src/services/utils.js

/**
 * 从数组中随机选择一个元素
 * @param {Array} array - 数组
 * @returns {*} 随机选择的元素
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成一个随机的IPv4地址
 * @returns {string} 随机IPv4地址
 */
export function generateRandomIP() {
  // 生成一个更合理的私有网络IP范围，例如 192.168.x.x 或 10.x.x.x
  const segment1 = randomInt(1, 255)
  const segment2 = randomInt(0, 255)
  const segment3 = randomInt(0, 255)
  const segment4 = randomInt(0, 255)
  return `${segment1}.${segment2}.${segment3}.${segment4}`
}

/**
 * 生成随机英文名（First Name）
 * @returns {string} 随机英文名
 */
export function generateRandomFirstName() {
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry']
  return randomChoice(names)
}

/**
 * 生成随机英文姓（Last Name）
 * @returns {string} 随机英文姓
 */
export function generateRandomLastName() {
  const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore']
  return randomChoice(names)
}

/**
 * 生成随机中文姓名
 * @returns {string} 随机中文姓名
 */
export function generateRandomChineseName() {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰']
  return `${randomChoice(surnames)}${randomChoice(names)}`
}

/**
 * 生成随机邮箱
 * @param {string} prefix - 邮箱前缀，默认为 'user'
 * @returns {string} 随机邮箱地址
 */
export function generateRandomEmail(prefix = 'user') {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'qq.com', '163.com']
  const randomNum = randomInt(0, 9999)
  return `${prefix}${randomNum}@${randomChoice(domains)}`
}

/**
 * 生成随机电话
 * @param {string} format - 电话格式：'cn' 中国格式, 'us' 美国格式, 'fr' 法国格式，默认为 'cn'
 * @returns {string} 随机电话号码
 */
export function generateRandomPhone(format = 'cn') {
  if (format === 'cn') {
    // 中国手机号：11位数字，以1开头，第二位是3/4/5/6/7/8/9
    // 格式：区号(3位) + 空格 + 号码(8位)
    const prefixes = ['138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', 
                      '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
                      '130', '131', '132', '133', '134', '135', '136', '137',
                      '170', '171', '172', '173', '174', '175', '176', '177', '178', '179']
    const prefix = randomChoice(prefixes)
    // 生成8位数字后缀
    const suffix = randomInt(0, 99999999).toString().padStart(8, '0')
    return `${prefix} ${suffix}`
  } else if (format === 'us') {
    // 美国电话：+1 + 区号(3位) + 空格 + 号码(7位)
    const areaCode = randomInt(200, 999)
    const exchange = randomInt(200, 999)
    const number = randomInt(0, 9999).toString().padStart(4, '0')
    return `+1 ${areaCode} ${exchange}${number}`
  } else if (format === 'fr') {
    // 法国电话：+33 + 空格 + 区号(1位) + 空格 + 号码(8位)
    const areaCode = randomInt(1, 9)
    const phoneNumber = randomInt(0, 99999999).toString().padStart(8, '0')
    return `+33 ${areaCode} ${phoneNumber}`
  } else {
    // 默认国际格式：+国家代码 + 空格 + 号码
    const countryCode = randomInt(1, 99)
    const phoneNumber = randomInt(1000000000, 9999999999)
    return `+${countryCode} ${phoneNumber}`
  }
}

/**
 * 生成随机地址
 * @param {string} type - 地址类型：'cn' 中文地址, 'en' 英文地址，默认为 'cn'
 * @returns {string} 随机地址
 */
export function generateRandomAddress(type = 'cn') {
  const addressMap = {
    cn: [
      '北京市朝阳区建国路88号',
      '上海市浦东新区陆家嘴环路1000号',
      '广州市天河区天河路123号',
      '深圳市南山区科技园南路123号',
      '杭州市西湖区文三路456号',
      '成都市锦江区春熙路789号',
      '武汉市江汉区解放大道101号'
    ],
    en: [
      '123 Main Street',
      '456 Oak Avenue',
      '789 Pine Road',
      '321 Elm Street',
      '654 Maple Drive',
      '16 Rue Crespin du Gast',
      '123 Avenue des Champs',
      '456 Boulevard Saint-Germain',
      '789 Rue de la Paix',
      '321 Place de la République'
    ]
  }
  const addresses = addressMap[type] || addressMap.en
  return randomChoice(addresses)
}

/**
 * 生成随机国家代码
 * @returns {string} 随机国家代码
 */
export function generateRandomCountry() {
  const countries = ['CN', 'US', 'GB', 'JP', 'SG', 'HK', 'FR', 'DE', 'IT', 'ES', 'AU', 'CA']
  return randomChoice(countries)
}

/**
 * 从映射对象中根据key获取值，如果不存在则返回默认值
 * @param {Object} map - 映射对象
 * @param {string} key - 键
 * @param {string} defaultKey - 默认键
 * @returns {Array} 值数组
 */
function getValueFromMap(map, key, defaultKey = 'default') {
  return map[key] || map[defaultKey] || []
}

/**
 * 生成随机州/省
 * @param {string} country - 国家代码，用于生成对应国家的州/省
 * @returns {string} 随机州/省名称
 */
export function generateRandomState(country = 'US') {
  const stateMap = {
    'US': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia'],
    'CN': ['北京', '上海', '广东', '江苏', '浙江', '山东', '四川', '湖北'],
    'FR': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine'],
    'GB': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'JP': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido'],
    'default': ['California', 'New York', 'Guangdong', 'Tokyo', 'Île-de-France']
  }
  const states = getValueFromMap(stateMap, country)
  return randomChoice(states)
}

/**
 * 生成随机城市
 * @param {string} country - 国家代码，用于生成对应国家的城市
 * @returns {string} 随机城市名称
 */
export function generateRandomCity(country = 'US') {
  const cityMap = {
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
    'CN': ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'],
    'FR': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'],
    'GB': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow'],
    'JP': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka'],
    'default': ['New York', 'Paris', 'London', 'Tokyo', 'Beijing', 'Shanghai']
  }
  const cities = getValueFromMap(cityMap, country)
  return randomChoice(cities)
}

/**
 * 生成随机邮编
 * @returns {string} 随机邮编
 */
export function generateRandomPostalCode() {
  return randomInt(10000, 99999).toString()
}

/**
 * 生成随机区号
 * @param {string} country - 国家代码，用于生成对应国家的区号
 * @returns {string} 随机区号
 */
export function generateRandomAreaCode(country = 'CN') {
  const areaCodeMap = {
    'CN': ['010', '021', '020', '0755', '0571', '028', '027', '029'],
    'US': ['212', '310', '415', '312', '713', '404', '305'],
    'FR': ['33', '01', '02', '03', '04', '05'],
    'GB': ['44', '20', '161', '121'],
    'JP': ['81', '03', '06', '052'],
    'default': ['010', '021', '1', '44', '33', '81']
  }
  const areaCodes = getValueFromMap(areaCodeMap, country)
  return randomChoice(areaCodes)
}

