CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id
  ON ticket_attachments(ticket_id, created_at);
