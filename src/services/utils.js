// src/services/utils.js
/**
 * 生成一个随机的IPv4地址
 * @returns {string} 随机IPv4地址
 */
export function generateRandomIP() {
  // 生成一个更合理的私有网络IP范围，例如 192.168.x.x 或 10.x.x.x
  const segment1 = Math.floor(Math.random() * 255) + 1; // 1-255
  const segment2 = Math.floor(Math.random() * 255);     // 0-255
  const segment3 = Math.floor(Math.random() * 255);     // 0-255
  const segment4 = Math.floor(Math.random() * 255);     // 0-255
  return `${segment1}.${segment2}.${segment3}.${segment4}`;
}

