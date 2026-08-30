CREATE TABLE user_notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  multiplayer boolean NOT NULL DEFAULT true,
  achievements boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE push_notification_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auth_session_id uuid REFERENCES auth_sessions(id) ON DELETE SET NULL,
  expo_push_token text NOT NULL UNIQUE CHECK (
    expo_push_token ~ '^(Expo|Exponent)PushToken\\[[A-Za-z0-9_-]+\\]$'
  ),
  platform text NOT NULL CHECK (platform IN ('android', 'ios')),
  device_name text CHECK (char_length(device_name) <= 120),
  active boolean NOT NULL DEFAULT true,
  last_registered_at timestamptz NOT NULL DEFAULT now(),
  last_success_at timestamptz,
  last_error_code text,
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX push_notification_devices_user_active_idx
  ON push_notification_devices (user_id) WHERE active;
CREATE INDEX push_notification_devices_session_idx
  ON push_notification_devices (auth_session_id) WHERE active;

CREATE TABLE push_notification_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id uuid REFERENCES push_notification_devices(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('multiplayer', 'achievements')),
  expo_ticket_id text UNIQUE,
  status text NOT NULL CHECK (status IN ('ticket_ok', 'ticket_error', 'delivered', 'receipt_error')),
  error_code text,
  receipt_due_at timestamptz,
  receipt_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX push_notification_deliveries_receipt_due_idx
  ON push_notification_deliveries (receipt_due_at)
  WHERE status = 'ticket_ok' AND expo_ticket_id IS NOT NULL;

CREATE TRIGGER user_notification_preferences_set_updated_at
BEFORE UPDATE ON user_notification_preferences
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER push_notification_devices_set_updated_at
BEFORE UPDATE ON push_notification_devices
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
