CREATE TABLE IF NOT EXISTS user_permissions (
  user_id uuid PRIMARY KEY,
  can_import_product boolean DEFAULT true,
  can_import_reviews boolean DEFAULT false
);

-- mock data
INSERT INTO user_permissions (user_id, can_import_product, can_import_reviews)
VALUES
  ('00000000-0000-0000-0000-000000000001', true, true),
  ('00000000-0000-0000-0000-000000000002', true, false);