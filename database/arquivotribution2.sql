-- Task One - Write SQL Statements

-- 1º Query
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2º Query
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 3º Query
DELETE FROM public.account
WHERE account_id = 1;

-- 4º Query
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'AND inv_model = 'Hummer';

-- 5ª Query
SELECT public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name
FROM public.inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- 6º Query
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', 'images/vehicles/');