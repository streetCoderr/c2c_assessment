
CREATE DATABASE c2c_db;

\c c2c_db;

CREATE TABLE IF NOT EXISTS farmer (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone_number VARCHAR(11),
  age INTEGER,
  address VARCHAR(150),
  crops text[]
);

INSERT INTO farmer (first_name, last_name, phone_number, age, address, crops)
VALUES ('Jimoh', 'Fasaasi', '12345', 23, '13, idumota', '{"yam", "cassava", "maize"}'),
('Sule', 'Gambari', '667755', 44, '3, idi ape', '{"maize"}'),
('Jimoh', 'Mike', '566558', 31, 'Lagos', '{"cassava", "orange"}');

