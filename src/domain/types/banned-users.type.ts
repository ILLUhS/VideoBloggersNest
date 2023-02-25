export type BannedUsersType = {
  id: string;
  login: string;
  isBanned: boolean;
  banDate: string | null;
  banReason: string | null;
};
