export default class Id {
  private _id: string;

  constructor(id?: string) {
    if (id) {
      this.validate(id);
      this._id = id;
    } else {
      this._id = crypto.randomUUID();
    }
  }

  get id(): string {
    return this._id;
  }

  private validate(id: string): void {
    if (
      !id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new Error('ID inválido');
    }
  }
}
