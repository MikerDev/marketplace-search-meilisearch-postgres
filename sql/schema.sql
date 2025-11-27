CREATE TABLE IF NOT EXISTS listings (
    id              VARCHAR(64) PRIMARY KEY,
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    tags            TEXT[],
    city            TEXT,
    price           NUMERIC(10,2),
    rating          NUMERIC(2,1),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_trigger
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION notify_listing_change()
RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    payload = json_build_object(
      'id', OLD.id,
      'operation', TG_OP
    );
  ELSE
    payload = json_build_object(
      'id', NEW.id,
      'operation', TG_OP
    );
  END IF;

  PERFORM pg_notify('listing_changes', payload::text);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listing_change_trigger ON listings;

CREATE TRIGGER listing_change_trigger
AFTER INSERT OR UPDATE OR DELETE
ON listings
FOR EACH ROW
EXECUTE FUNCTION notify_listing_change();
