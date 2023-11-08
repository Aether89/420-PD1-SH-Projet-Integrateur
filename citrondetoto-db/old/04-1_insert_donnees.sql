INSERT INTO employe (nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal, is_archive)
VALUES
	('Admin', 'AD', 'Administrateur', '888-888-888', 'H0H0H0', false),
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
