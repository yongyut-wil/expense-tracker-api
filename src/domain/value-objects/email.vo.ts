/**
 * Email Value Object
 * Represents a valid email address in the domain
 */
export class Email {
  private constructor(public readonly value: string) {
    this.validate(value);
  }

  /**
   * Factory method to create an Email value object
   */
  static create(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }

  /**
   * Validates email format
   */
  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (email.length > 255) {
      throw new Error('Email is too long');
    }
  }

  /**
   * Checks if two emails are equal
   */
  equals(other: Email): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  /**
   * Returns string representation
   */
  toString(): string {
    return this.value;
  }
}
