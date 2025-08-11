import { TokenData } from '../../type/sharedTypes';

/**
 * @interface UseCaseInterface
 * @description Defines the contract for all use cases in the application
 * @template InputT - The type of the input data
 * @template ResultT - The type of the result data
 */
export default interface UseCaseInterface<InputT, ResultT> {
  /**
   * Executes the use case with the provided input
   * @param input - The input data for the use case
   * @returns A promise that resolves to the result of the use case
   * @throws {Error} - When the use case execution fails
   */
  execute(input: InputT, token: TokenData): Promise<ResultT>;
}
