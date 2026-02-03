-- 创建所有数据库
CREATE DATABASE IF NOT EXISTS product_db;
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS cart_db;
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS shipping_db;
CREATE DATABASE IF NOT EXISTS return_db;

-- 使用 root 用户授予权限
GRANT ALL PRIVILEGES ON product_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON user_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON cart_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON order_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON payment_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON shipping_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON return_db.* TO 'root'@'%';

FLUSH PRIVILEGES;
