DROP TABLE IF EXISTS user_account;

CREATE TABLE user_account (
	user_account_id text PRIMARY KEY,
	password_hash text,
	password_salt text,
	user_full_name text,
	is_active boolean NOT NULL DEFAULT true,
	is_admin boolean NOT NULL DEFAULT false
);