-- public."class" definition
-- Drop table
-- DROP TABLE "class";
CREATE TABLE "class" (
  id serial4 NOT NULL,
  full_name varchar NOT NULL,
  short_name varchar NULL,
  CONSTRAINT class_pk PRIMARY KEY (id)
);

-- public.departments definition
-- Drop table
-- DROP TABLE departments;
CREATE TABLE departments (
  id int4 NOT NULL DEFAULT nextval('account_id_seq' :: regclass),
  full_name varchar NOT NULL,
  address varchar NULL,
  phone varchar NULL,
  short_name varchar NOT NULL
);

CREATE INDEX departments_id_idx ON public.departments USING btree (id, full_name, short_name, phone, address);

-- public."role" definition
-- Drop table
-- DROP TABLE "role";
CREATE TABLE "role" (
  id serial4 NOT NULL,
  "name" varchar NOT NULL,
  role_code varchar NOT NULL,
  CONSTRAINT role_pk PRIMARY KEY (id)
);

-- public.student definition
-- Drop table
-- DROP TABLE student;
CREATE TABLE student (
  acc_id int4 NOT NULL,
  class_id int4 NOT NULL,
  academic_year varchar NOT NULL
);

-- public.teacher definition
-- Drop table
-- DROP TABLE teacher;
CREATE TABLE teacher (
  acc_id int4 NOT NULL,
  "position" varchar NOT NULL,
  CONSTRAINT teacher_pk PRIMARY KEY (acc_id)
);

-- public.accounts definition
-- Drop table
-- DROP TABLE accounts;
CREATE TABLE accounts (
  id int4 NOT NULL DEFAULT nextval('account_id_seq' :: regclass),
  email varchar NULL,
  "password" varchar NULL,
  register_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login timestamp NULL,
  role_id int4 NOT NULL,
  "name" varchar NOT NULL,
  birthday timestamp NULL,
  department_id int4 NULL,
  gender varchar NULL,
  sid varchar NULL,
  CONSTRAINT account_pk PRIMARY KEY (id),
  CONSTRAINT account_fk FOREIGN KEY (role_id) REFERENCES "role"(id)
);