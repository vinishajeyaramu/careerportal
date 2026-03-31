CREATE TABLE IF NOT EXISTS location (
  location_id SERIAL PRIMARY KEY,
  location_title VARCHAR(225) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS category (
  category_id SERIAL PRIMARY KEY,
  category_title VARCHAR(225) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(225) NOT NULL,
  email VARCHAR(225) NOT NULL UNIQUE,
  password VARCHAR(225) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'candidate',
  first_name VARCHAR(225),
  last_name VARCHAR(225),
  phone VARCHAR(225),
  reset_token TEXT,
  reset_token_expiry BIGINT
);

CREATE TABLE IF NOT EXISTS jobpost (
  job_id SERIAL PRIMARY KEY,
  job_title VARCHAR(225) NOT NULL,
  job_location_type TEXT[] NOT NULL,
  job_category VARCHAR(225) NOT NULL,
  job_type TEXT[] NOT NULL,
  job_location VARCHAR(225) NOT NULL,
  job_experience_level INTEGER NOT NULL,
  job_technical_skills TEXT[] NOT NULL,
  job_education_qualification TEXT[] NOT NULL,
  job_description TEXT NOT NULL,
  job_interview_rounds VARCHAR(225) NOT NULL,
  job_budget VARCHAR(225) NOT NULL,
  job_create_date VARCHAR(225) NOT NULL,
  job_close_date VARCHAR(225) NOT NULL,
  job_status VARCHAR(225) NOT NULL,
  job_created_by VARCHAR(225)
);

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(225) NOT NULL,
  last_name VARCHAR(225) NOT NULL,
  email VARCHAR(225) NOT NULL,
  phone VARCHAR(225) NOT NULL,
  linkedin VARCHAR(225) NOT NULL,
  website VARCHAR(225) NOT NULL,
  resume TEXT NOT NULL,
  cover TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  job_id INTEGER NOT NULL,
  job_title VARCHAR(225) NOT NULL,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
