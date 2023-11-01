INSERT INTO employe (nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal, is_archive)
VALUES
	('Admin', 'AD', 'patate', '819-123-4567', 'a1a1a1', false),
	('Beauchamp', 'Michaël', 'patate', '819-123-4567', 'a1a1a1', false),
	('Martin', 'Félix', 'patate', '819-123-4567', 'a1a1a1', false),
	('Deschamps', 'Réal', 'patate', '819-123-4567', 'a1a1a1', false)
;

insert into etat(id_etat, nom_etat)
values
	(1, 'Préparation'),
	(2, 'Disponible'),
	(3, 'Vendu')
;

insert into type_evenement(nom_evenement)
values
	('reservation'),
	('pending'),
	('done')
;

insert into client (nom_client, prenom_client, telephone_client, courriel_client, numero_civic, numero_appartement, nom_rue, nom_ville, nom_province, code_postal, is_archive)
values
	('bob', 'tamer', '111', '111', '111', 1, 'larue', 'laville', 'laprovince', '111aaa', false)
;