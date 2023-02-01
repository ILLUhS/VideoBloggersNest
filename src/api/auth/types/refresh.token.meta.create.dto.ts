export class RefreshTokenMetaCreateDto {
  issuedAt: number;
  expirationAt: number;
  deviceId: string;
  deviceIp: string;
  deviceName: string;
  userId: string;
}
