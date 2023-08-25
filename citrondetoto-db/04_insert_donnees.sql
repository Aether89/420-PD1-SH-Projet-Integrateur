DELETE FROM user_account;

INSERT INTO user_account (user_account_id, user_full_name, is_admin, is_active, password_hash, password_salt)
VALUES
	('admin', 'Administrateur', true, true, 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==', 'HLq2XxQQdDT/Fj0pRI3JNA=='), -- mot de passe: topsecret
	('mbeauchamp', 'Michaël Beauchamp', false, true, 'awWtuonrel/c/0RQUWwtpGImwxXbc3UdHdeA5zxPEGYqSaUkSI7BVBtackat/Sl8fbfLQT+l1GnpuEnYrrahrQ==', '0LGCgCjpPkVtnSdoxAR+lA=='), -- mot de passe: 12345
	('fmartin', 'Félix Martin', false, true, '+kO83Ef3p1h/tayEycPEweCSCmk7AiRPGVm3Z3wYuTlAA76+Pat+cU1aiSt7KXKCincnR/nVv5kBufs6WQnehAg==', 'rBpPyjYASr6l2ISaN+SRgA=='), -- mot de passe: 12345
	('rdeschamps', 'Réal Deschamps', true, true, 'LzqpL1XBJu21LOlc3W16tFR28zkHI/kodATWW4SigT9Hig0zg6Vgy829Dzv2lp/Um6vS6jbyB7Mh40PErpjRkg==', '3R5CRzUpe5vpjqMjvKYQbQ==') -- mot de passe: 12345
;