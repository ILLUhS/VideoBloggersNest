export class DeleteSessionsExcludeCurrentCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}
