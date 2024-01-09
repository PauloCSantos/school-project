export default interface UserGateway<T> {
  find(id: string): Promise<T | null>;
  findAll(quantity: number, offSet: number): Promise<T[] | null>;
  create(userMaster: T): Promise<T>;
  update(userMaster: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
