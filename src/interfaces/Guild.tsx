export default interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
}

export interface AllGuildsResponse {
  data: Guild[];
}
