export type Rsvp = {
  id: string;
  created_at: string;
  name: string;
  attending: boolean;
  party_size: number;
  message: string | null;
  invitation_id: string | null;
};
