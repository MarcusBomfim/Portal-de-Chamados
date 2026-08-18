CREATE SEQUENCE IF NOT EXISTS ticket_protocol_sequence START WITH 1;

INSERT INTO units (name, acronym, type, address)
VALUES
  ('Central de Suporte da Saúde', 'CSS', 'SUPPORT_CENTER', 'São Vicente - SP'),
  ('UBS Central', 'UBS-CENTRAL', 'HEALTH_UNIT', 'Região Central - São Vicente'),
  ('UBS Náutica III', 'UBS-NAUTICA-III', 'HEALTH_UNIT', 'Náutica III - São Vicente'),
  ('ESF Vila Margarida', 'ESF-VILA-MARGARIDA', 'HEALTH_UNIT', 'Vila Margarida - São Vicente'),
  ('Policlínica Insular', 'POLI-INSULAR', 'HEALTH_UNIT', 'Área Insular - São Vicente')
ON CONFLICT (acronym) DO UPDATE
SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  address = EXCLUDED.address,
  active = TRUE;
