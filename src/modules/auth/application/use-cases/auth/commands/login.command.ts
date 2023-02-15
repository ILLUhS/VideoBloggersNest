export class LoginCommand {
  constructor(
    public readonly userId: string,
    public readonly login: string,
    public readonly deviceName: string,
    public readonly ip: string,
  ) {}
}
