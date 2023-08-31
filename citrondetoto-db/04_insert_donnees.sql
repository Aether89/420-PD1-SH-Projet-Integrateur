INSERT INTO employe (nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal_employe)
VALUES
	('Admin', 'AD', 'patate', '819-123-4567', 'a1a1a1'),
	('Martin', 'Félix', 'patate', '819-123-4567', 'a1a1a1'),
	('Beauchamp', 'Michaël', 'patate', '819-123-4567', 'a1a1a1'),
	('Deschamps', 'Réal', 'patate', '819-123-4567', 'a1a1a1')
;

INSERT INTO compte_employe (id_compte_employe, id_employe, courriel_compte_employe, password_hash, password_salt, is_active, is_admin)
VALUES
    
	('admin','5','patate@hotmail.com','UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==', 'HLq2XxQQdDT/Fj0pRI3JNA==', true, true), -- mot de passe: topsecret
	('mbeauchamp', '7','patate@hotmail.com','awWtuonrel/c/0RQUWwtpGImwxXbc3UdHdeA5zxPEGYqSaUkSI7BVBtackat/Sl8fbfLQT+l1GnpuEnYrrahrQ==', '0LGCgCjpPkVtnSdoxAR+lA==', false, true), -- mot de passe: 12345
	('fmartin', '6','patate@hotmail.com', '+kO83Ef3p1h/tayEycPEweCSCmk7AiRPGVm3Z3wYuTlAA76+Pat+cU1aiSt7KXKCincnR/nVv5kBufs6WQnehAg==', 'rBpPyjYASr6l2ISaN+SRgA==', false, true), -- mot de passe: 12345
	('rdeschamps', '8','patate@hotmail.com', 'LzqpL1XBJu21LOlc3W16tFR28zkHI/kodATWW4SigT9Hig0zg6Vgy829Dzv2lp/Um6vS6jbyB7Mh40PErpjRkg==', '3R5CRzUpe5vpjqMjvKYQbQ==', true, true) -- mot de passe: 12345
;