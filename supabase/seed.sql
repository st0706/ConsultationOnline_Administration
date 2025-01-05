INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '6f2630e0-df31-487e-a02f-03be8f1b382f', 'authenticated', 'authenticated', 'ducthanh1504@gmail.com', '$2a$10$PVFNhJaDV1B040zvGXdPJuSdlSgzbMj5vPng4DieszzOkm5e.xUsW', '2024-07-21 08:17:50.10699+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-07-21 08:19:26.196754+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-07-21 08:17:50.098721+00', '2024-07-21 08:19:26.200575+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7f60ce24-debb-47c2-a11f-0aa5e3a8474a', 'authenticated', 'authenticated', 'admin@anphat.ai.vn', '$2a$10$oh7FMjaycWevmGlEKfRf.O2YU5OPMDrTp23fNHHKqaTHFjMsDiZWO', '2024-07-20 12:07:31.854636+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-07-24 02:51:41.00137+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-07-20 12:07:31.84469+00', '2024-07-24 04:01:04.173852+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'be3e825e-5caa-47d2-9226-ea87ca1338c6', 'authenticated', 'authenticated', '1stgemini123@gmail.com', '$2a$10$YdrsBI4R.C8pW9MkdQvPuuNFkSCvXfODB0w3QibUZGyJ7NhTbk/Tu', '2024-07-25 02:20:59.87237+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-07-25 02:21:23.474961+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-07-25 02:20:59.862899+00', '2024-07-25 03:22:51.346314+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('7f60ce24-debb-47c2-a11f-0aa5e3a8474a', '7f60ce24-debb-47c2-a11f-0aa5e3a8474a', '{"sub": "7f60ce24-debb-47c2-a11f-0aa5e3a8474a", "email": "admin@anphat.ai.vn", "email_verified": false, "phone_verified": false}', 'email', '2024-07-20 12:07:31.847805+00', '2024-07-20 12:07:31.847952+00', '2024-07-20 12:07:31.847952+00', '0fa9ced3-867a-41f7-9fa6-57b589989d99'),
	('6f2630e0-df31-487e-a02f-03be8f1b382f', '6f2630e0-df31-487e-a02f-03be8f1b382f', '{"sub": "6f2630e0-df31-487e-a02f-03be8f1b382f", "email": "ducthanh1504@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-07-21 08:17:50.102561+00', '2024-07-21 08:17:50.102654+00', '2024-07-21 08:17:50.102654+00', '92e6491d-e987-4243-bff7-338a2f741383'),
	('be3e825e-5caa-47d2-9226-ea87ca1338c6', 'be3e825e-5caa-47d2-9226-ea87ca1338c6', '{"sub": "be3e825e-5caa-47d2-9226-ea87ca1338c6", "email": "1stgemini123@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-07-25 02:20:59.867538+00', '2024-07-25 02:20:59.867641+00', '2024-07-25 02:20:59.867641+00', '97f66447-2098-47d5-9144-90fe1b95dd4c');

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('ba996a90-e805-474a-9ebc-83c2dca1200f', '6f2630e0-df31-487e-a02f-03be8f1b382f', '2024-07-21 08:19:26.196939+00', '2024-07-21 08:19:26.196939+00', NULL, 'aal1', NULL, NULL, 'node', '42.117.78.147', NULL),
	('90d09a65-d698-4281-a547-3b9a3116f16d', 'be3e825e-5caa-47d2-9226-ea87ca1338c6', '2024-07-25 02:21:23.475232+00', '2024-07-25 08:15:07.064122+00', NULL, 'aal1', NULL, '2024-07-25 08:15:07.063942', 'node', '123.24.199.58', NULL);

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ba996a90-e805-474a-9ebc-83c2dca1200f', '2024-07-21 08:19:26.201369+00', '2024-07-21 08:19:26.201369+00', 'password', '8e48a02a-a7cc-4b91-9435-a8cb9bdc0f57'),
	('90d09a65-d698-4281-a547-3b9a3116f16d', '2024-07-25 02:21:23.480053+00', '2024-07-25 02:21:23.480053+00', 'password', '95d35496-5b61-4163-b8e1-c96f3a7b6ab1');

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 2, 'JIk-so49XaNxbORFls2EyA', '6f2630e0-df31-487e-a02f-03be8f1b382f', false, '2024-07-21 08:19:26.198661+00', '2024-07-21 08:19:26.198661+00', NULL, 'ba996a90-e805-474a-9ebc-83c2dca1200f'),
	('00000000-0000-0000-0000-000000000000', 13, '_sLAJTJdk2ZlQOqw9AcVeA', 'be3e825e-5caa-47d2-9226-ea87ca1338c6', true, '2024-07-25 02:21:23.477114+00', '2024-07-25 03:22:51.342423+00', NULL, '90d09a65-d698-4281-a547-3b9a3116f16d'),
	('00000000-0000-0000-0000-000000000000', 14, 'Ey3A7Yu_ftch3TrJPDUwKA', 'be3e825e-5caa-47d2-9226-ea87ca1338c6', false, '2024-07-25 03:22:51.343864+00', '2024-07-25 03:22:51.343864+00', '_sLAJTJdk2ZlQOqw9AcVeA', '90d09a65-d698-4281-a547-3b9a3116f16d');

INSERT INTO "public"."Appointment" ("id", "status", "appointmentType", "priority", "description", "resourceType", "start", "end", "subject", "cancellationDate", "specialty", "reason", "virtualService", "supportingInformation", "created", "note", "participant") VALUES
	('836461a7-037e-496a-ad61-8f115fe80066', 'proposed', '{"text": "walkin", "coding": [{}]}', '{"text": "callback", "coding": [{}]}', 'dfsdfs', 'Appointment', 1719995040553, 1720630800000, '{"reference": "1ec622a3-ea9a-444e-b7ee-0dcfe01ac703", "identifier": {"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}, "DEFAULT_REFERENCE": {"type": "", "display": "", "reference": ""}}', NULL, '[{"text": "234324", "coding": [{}]}, {"text": "r34r", "coding": [{}]}, {"text": "dsfsf", "coding": [{}]}]', '[{"concept": {"text": "", "coding": [{}]}, "reference": {"type": "", "display": "", "reference": ""}}]', '[{"sessionKey": "cvsdf", "channelType": [{"code": "zoom", "system": "http://hl7.org/fhir/virtual-service-type", "display": "Zoom web conferencing"}], "additionalInfo": null, "maxParticipants": 2}]', '[{"type": "", "display": "", "reference": "dsfdsf"}]', 1720458000000, '{"text": "dfdsfdsf"}', '[{"type": [{"coding": {"code": "ADM", "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType", "display": "admitter"}}], "actor": {"reference": "6eacc407-ceb7-4cc8-ae3b-f0b4f2faeb58"}, "period": {"end": 1722358800000, "start": 1721840400000}, "status": "Declined", "require": null, "required": "false"}]');

INSERT INTO "public"."profiles" ("id", "name", "image", "email") VALUES
	('6f2630e0-df31-487e-a02f-03be8f1b382f', 'ducthanh1504@gmail.com', NULL, 'ducthanh1504@gmail.com'),
	('7f60ce24-debb-47c2-a11f-0aa5e3a8474a', 'admin@anphat.ai.vn', NULL, 'admin@anphat.ai.vn'),
	('be3e825e-5caa-47d2-9226-ea87ca1338c6', '1stgemini123@gmail.com', NULL, '1stgemini123@gmail.com');

INSERT INTO "public"."Practitioner" ("id", "identifier", "active", "name", "telecom", "gender", "birthDate", "deceasedBoolean", "deceasedDateTime", "address", "photo", "qualification", "communication", "link", "userId") VALUES
	('43646e86-8985-4e84-9843-2d01e547e82d', '[{"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}]', NULL, '[{"use": "official", "given": ["Đức Thành"], "family": "Nguyễn", "period": {}, "prefix": [], "suffix": []}]', '[{"value": "", "period": {"end": null, "start": null}}]', 'male', 1719939600000, false, NULL, '[{"line": [], "state": "", "period": {}, "country": "", "postalCode": ""}]', '[{"url": "", "title": ""}]', '[{"code": {"text": "", "coding": []}, "issuer": {"type": "", "display": "", "reference": ""}, "period": {}, "identifier": [{"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}]}]', NULL, NULL, '6f2630e0-df31-487e-a02f-03be8f1b382f'),
	('2b0e2567-17a5-4707-8137-001682704a3a', '[{"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}]', NULL, '[{"use": "official", "given": ["Phát"], "family": "An", "period": {}, "prefix": [], "suffix": []}]', '[{"value": "", "period": {"end": null, "start": null}}]', 'male', 1720026000000, false, NULL, '[{"line": [], "state": "", "period": {}, "country": "", "postalCode": ""}]', '[{"url": "", "title": ""}]', '[{"code": {"text": "", "coding": []}, "issuer": {"type": "", "display": "", "reference": ""}, "period": {}, "identifier": [{"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}]}]', NULL, NULL, '7f60ce24-debb-47c2-a11f-0aa5e3a8474a'),
	('6eacc407-ceb7-4cc8-ae3b-f0b4f2faeb58', '[{"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}]', NULL, '[{"use": "official", "given": ["Sơn Tùng"], "family": "Nguyễn", "period": {}, "prefix": [], "suffix": []}]', '[{"value": "", "period": {"end": null, "start": null}}]', 'male', 1720026000000, false, NULL, '[{"line": [], "state": "", "period": {}, "country": "", "postalCode": ""}]', '[{"url": "", "title": ""}]', '[{"code": {"text": "", "coding": []}, "issuer": {"type": "", "display": "", "reference": ""}, "period": {}, "identifier": [{"type": {"text": "", "coding": [{}]}, "value": "", "period": {}, "assigner": {"type": "", "display": "", "reference": ""}}]}]', NULL, NULL, 'be3e825e-5caa-47d2-9226-ea87ca1338c6');

INSERT INTO "public"."Staff" ("id", "staffId", "ethnicMinority", "nationality", "religion", "culturalLevel", "dojCYU", "dojCPV", "officialDojCPV", "habit") VALUES
	('43646e86-8985-4e84-9843-2d01e547e82d', '01', 'Kinh', 'Việt Nam', 'Không', '12/12', NULL, NULL, NULL, ''),
	('2b0e2567-17a5-4707-8137-001682704a3a', '02', 'Kinh', 'Việt Nam', 'Không', '12', NULL, NULL, NULL, ''),
	('6eacc407-ceb7-4cc8-ae3b-f0b4f2faeb58', '03', 'Kinh', 'Việt Nam', 'Không', '12', NULL, NULL, NULL, '');

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('hrm', 'hrm', NULL, '2024-07-21 08:49:06.970671+00', '2024-07-21 08:49:06.970671+00', false, false, NULL, NULL, NULL);
INSERT INTO
public.role_permissions (role, permission)
VALUES
  ('appointment.admin', 'appointment.delete'),
  ('appointment.admin', 'appointment.create'),
  ('appointment.admin', 'appointment.update'),
  ('appointment.admin', 'appointment.view'),
  ('appointment.moderator', 'appointment.delete'),
  ('appointment.moderator', 'appointment.create'),
  ('appointment.moderator', 'appointment.update'),
  ('appointment.moderator', 'appointment.view'),
  ('appointment.approve_level_1', 'appointment.update'),('appointment.approve_level_1', 'appointment.view'),
  ('appointment.approve_level_2', 'appointment.update'),('appointment.approve_level_2', 'appointment.view'),
  ('appointment.participant', 'appointment.view');

RESET ALL;
