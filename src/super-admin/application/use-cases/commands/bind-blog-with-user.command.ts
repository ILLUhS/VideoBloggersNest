export class BindBlogWithUserCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}
