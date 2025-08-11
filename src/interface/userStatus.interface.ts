export type UserStatus = "pending" | "active" | "blocked";

export interface StatusUpdate {
  userId: string;
  status: UserStatus;
}