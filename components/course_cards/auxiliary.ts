export function calculatePercentage(numerator: number, denominator: number) {
    if (denominator === 0) {
      throw new Error("Denominator cannot be zero.");
    }
  
    // Perform the division
    const result = numerator / denominator;
    
    // Convert the result to a percentage
    const percentage = result * 100;
    
    // Return the integer percentage
    return Math.round(percentage);
  }