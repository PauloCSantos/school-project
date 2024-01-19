export default interface UseCaseInterface<T, R> {
  execute(input: T): Promise<R>;
}
