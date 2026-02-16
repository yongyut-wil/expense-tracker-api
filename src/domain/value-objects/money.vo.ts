/**
 * Money Value Object
 * Represents a monetary amount in the domain (stored as integer cents/satang)
 */
export class Money {
  private constructor(public readonly amount: number) {
    this.validate(amount);
  }

  /**
   * Factory method to create a Money value object
   */
  static create(amount: number): Money {
    return new Money(Math.round(amount));
  }

  /**
   * Creates Money from zero
   */
  static zero(): Money {
    return new Money(0);
  }

  /**
   * Validates the amount
   */
  private validate(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Amount must be a valid number');
    }

    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (use cents/satang)');
    }

    if (amount > Number.MAX_SAFE_INTEGER) {
      throw new Error('Amount is too large');
    }
  }

  /**
   * Adds two Money values
   */
  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  /**
   * Subtracts Money value
   */
  subtract(other: Money): Money {
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Subtraction would result in negative amount');
    }
    return new Money(result);
  }

  /**
   * Checks if greater than other Money
   */
  greaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  /**
   * Checks if less than other Money
   */
  lessThan(other: Money): boolean {
    return this.amount < other.amount;
  }

  /**
   * Checks if two Money values are equal
   */
  equals(other: Money): boolean {
    if (!other) return false;
    return this.amount === other.amount;
  }

  /**
   * Returns string representation
   */
  toString(): string {
    return this.amount.toString();
  }

  /**
   * Converts to decimal (dividing by 100 for display)
   */
  toDecimal(): number {
    return this.amount / 100;
  }
}
