-- 创建产品数据库
CREATE DATABASE IF NOT EXISTS product_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户数据库
CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建购物车数据库
CREATE DATABASE IF NOT EXISTS cart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建订单数据库
CREATE DATABASE IF NOT EXISTS order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建支付数据库
CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建物流数据库
CREATE DATABASE IF NOT EXISTS shipping_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建退货数据库
CREATE DATABASE IF NOT EXISTS return_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建主数据库
CREATE DATABASE IF NOT EXISTS wayfair_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用主数据库
USE wayfair_db;

-- 创建服务配置表
CREATE TABLE IF NOT EXISTS service_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(100) NOT NULL UNIQUE,
  service_url VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入服务配置
INSERT INTO service_config (service_name, service_url) VALUES
  ('product-service', 'http://product-service:3001'),
  ('user-service', 'http://user-service:3002'),
  ('cart-service', 'http://cart-service:3003'),
  ('order-service', 'http://order-service:3004'),
  ('payment-service', 'http://payment-service:3005'),
  ('shipping-service', 'http://shipping-service:3006'),
  ('return-service', 'http://return-service:3007')
ON DUPLICATE KEY UPDATE service_url = VALUES(service_url);

-- 创建审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  user_id VARCHAR(36),
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_service_name (service_name),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- 创建系统配置表
CREATE TABLE IF NOT EXISTS system_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认系统配置
INSERT INTO system_config (config_key, config_value, description) VALUES
  ('site_name', 'Wayfair Clone', '网站名称'),
  ('site_url', 'http://localhost:3100', '网站 URL'),
  ('admin_url', 'http://localhost:3200', '管理后台 URL'),
  ('currency', 'USD', '默认货币'),
  ('timezone', 'UTC', '时区'),
  ('max_upload_size', '52428800', '最大上传文件大小（字节）'),
  ('smtp_host', 'smtp.example.com', 'SMTP 主机'),
  ('smtp_port', '587', 'SMTP 端口'),
  ('smtp_user', 'noreply@example.com', 'SMTP 用户'),
  ('smtp_password', '', 'SMTP 密码')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);
