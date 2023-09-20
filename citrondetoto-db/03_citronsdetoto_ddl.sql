DROP TABLE IF EXISTS message_chat;
DROP TABLE IF EXISTS vehicule_evenement;
DROP TABLE IF EXISTS evenement;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS employe;
DROP TABLE IF EXISTS type_evenement;
DROP TABLE IF EXISTS vehicule_intervention;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS intervention;
DROP TABLE IF EXISTS vehicule_accessoire;
DROP TABLE IF EXISTS accessoire;
DROP TABLE IF EXISTS photo_chemin;
DROP TABLE IF EXISTS vehicule;
DROP TABLE IF EXISTS etat;


CREATE TABLE etat (
	id_etat serial PRIMARY KEY NOT NULL,
	nom_etat varchar(16) NOT NULL
);


CREATE TABLE vehicule (
	vin varchar(17) PRIMARY KEY NOT NULL,
	marque text,
	modele text,
	annee integer,
	id_etat integer NOT NULL REFERENCES etat (id_etat),
	couleur varchar(32) NOT NULL,
	nombre_kilometre integer NOT NULL,
	prix_annonce money NOT NULL,
	promotion money, 
	description_courte varchar(64),
	description_longue varchar(512)
);


CREATE TABLE photo_chemin (
	id_photo serial PRIMARY KEY NOT NULL,
	vin varchar(17) NOT NULL REFERENCES vehicule (vin) ON DELETE CASCADE,
	chemin varchar(128) NOT NULL
);


CREATE TABLE accessoire (
	id_accessoire serial PRIMARY KEY NOT NULL,
	nom_accessoire varchar(64) NOT NULL
);


CREATE TABLE vehicule_accessoire (
	vin varchar(17) NOT NULL REFERENCES vehicule (vin),
	id_accessoire serial NOT NULL REFERENCES accessoire (id_accessoire)
);


CREATE TABLE intervention (
	id_intervention serial PRIMARY KEY NOT NULL,
	type_intervention varchar(64) NOT NULL,
	valeur_intervention money NOT NULL,
	etat_intervention boolean NOT NULL
);


CREATE TABLE client (
	id_client serial PRIMARY KEY NOT NULL,
	nom_client varchar(64) NOT NULL,
	prenom_client varchar(64) NOT NULL,
	telephone_client varchar(16),
	courriel_client varchar (64),
	numero_civic integer,
	numero_appartement varchar(6),
	nom_rue varchar(64),
	nom_ville varchar(64),
	nom_province varchar(64),
	code_postal varchar(6),
	is_archive boolean NOT NULL
);


CREATE TABLE vehicule_intervention (
	vin varchar(17) NOT NULL REFERENCES vehicule (vin),
	id_accessoire serial NOT NULL REFERENCES intervention (id_intervention)
);


CREATE TABLE type_evenement (
	id_type_evenement serial PRIMARY KEY NOT NULL,
	nom_evenement varchar(64) NOT NULL
);


CREATE TABLE employe (
	id_employe serial PRIMARY KEY NOT NULL,
	nom_employe varchar(64)	NOT NULL,
	prenom_employe varchar(64) NOT NULL,
	poste_employe varchar(64) NOT NULL,
	telephone_employe varchar(16) NOT NULL,
	numero_civic integer,
	numero_appartement varchar(6),
	nom_rue varchar(64),
	nom_ville varchar(64),
	nom_province varchar(64),
	code_postal varchar(6),
	is_archive boolean NOT NULL
);


CREATE TABLE user_account (
	user_account_id text PRIMARY KEY,
	id_employe serial NOT NULL REFERENCES employe (id_employe),
	courriel_compte_employe varchar(64) NOT NULL,
	password_hash text NOT NULL,
	password_salt text NOT NULL,
	is_active boolean NOT NULL DEFAULT true,
	is_admin boolean NOT NULL DEFAULT false
);

CREATE TABLE evenement (
	id_evenement serial PRIMARY KEY NOT NULL,
	id_type_evenement serial NOT NULL REFERENCES type_evenement (id_type_evenement),
	id_client serial NOT NULL REFERENCES client (id_client),
	id_employe serial NOT NULL REFERENCES employe (id_employe),
	prix_evenement money,
	date_heure_evenement timestamptz NOT NULL,
	etat_vue_evenement boolean
);


CREATE TABLE vehicule_evenement (
	id_evenement serial NOT NULL REFERENCES evenement (id_evenement),
	vin varchar(17) NOT NULL REFERENCES vehicule (vin)
);


CREATE TABLE message_chat (
	id_message_chat serial PRIMARY KEY,
	id_employe serial NOT NULL REFERENCES employe (id_employe),
	id_client serial NOT NULL REFERENCES client (id_client),
	date_heure_message_chat timestamptz NOT NULL,
	contenue_message_chat text NOT NULL,
	source_message_chat boolean NOT NULL,
	lu_message_chat boolean NOT NULL
);