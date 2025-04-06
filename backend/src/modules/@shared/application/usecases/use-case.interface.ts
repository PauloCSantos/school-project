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
  execute(input: InputT): Promise<ResultT>;

  /**
   * Optional method to validate the input before execution
   * @param input - The input data to validate
   * @returns true if the input is valid, false otherwise
   */
  validate?(input: InputT): boolean;
}

/**
 * Standard response structure for use cases
 * @template T - The type of data in the response
 */
export interface UseCaseResponse<T> {
  /**
   * Whether the use case execution was successful
   */
  success: boolean;

  /**
   * The data returned by the use case (if successful)
   */
  data?: T;

  /**
   * Error message (if not successful)
   */
  error?: string;

  /**
   * Error code (if applicable)
   */
  errorCode?: string | number;
}

/**
 * Empty input type for use cases that don't require input
 */
export type EmptyInput = Record<string, never>;

/**
 * Base class for use cases with common functionality
 */
export abstract class BaseUseCase<InputT, ResultT>
  implements UseCaseInterface<InputT, ResultT>
{
  /**
   * Template method that defines the use case execution flow
   * @param input - The input data for the use case
   */
  public async execute(input: InputT): Promise<ResultT> {
    // Optional validation if the method is implemented
    if (this.validate && !this.validate(input)) {
      throw new Error('Invalid input');
    }

    try {
      return await this.performExecute(input);
    } catch (error) {
      // Log error details here if needed
      throw error;
    }
  }

  /**
   * The actual execution logic to be implemented by concrete use cases
   * @param input - The validated input data
   */
  protected abstract performExecute(input: InputT): Promise<ResultT>;

  /**
   * Optional method to validate input
   */
  public validate?(input: InputT): boolean;
}
