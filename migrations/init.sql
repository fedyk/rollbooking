CREATE TABLE roles
(
  id serial PRIMARY KEY,
  "name" varchar(32) NOT NULL,
  description text NOT NULL,  
  CONSTRAINT roles_name_key UNIQUE (name)
);

CREATE TABLE users
(
  id serial,
  email varchar(254) NOT NULL,
  username varchar(32) NOT NULL,
  first_name varchar(32),
  last_name varchar(32),
  "password" varchar(64) NOT NULL,
  logins integer NOT NULL DEFAULT 0,
  last_login integer,
  CONSTRAINT users_id_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_logins_check CHECK (logins >= 0)
);

CREATE TABLE roles_users
(
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  role_id integer REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX user_id_idx ON roles_users (user_id);
CREATE INDEX role_id_idx ON roles_users (role_id);

CREATE TABLE user_tokens
(
  id serial,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_agent varchar(40) NOT NULL,
  token character varying(32) NOT NULL,
  created integer NOT NULL,
  expires integer NOT NULL,
  CONSTRAINT user_tokens_id_pkey PRIMARY KEY (id),
  CONSTRAINT user_tokens_token_key UNIQUE (token)
);

INSERT INTO roles (name, description) VALUES 
  ('login', 'Login privileges, granted after account confirmation'),
  ('admin', 'Administrator role, granted to manage application'),
  ('root', 'Login privileges, grant to all operations');
