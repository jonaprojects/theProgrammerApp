function getShuffledArray(array: string[]) {
  // Create a copy of the array to avoid mutating the original array
  const shuffledArray = array.slice();

  // Iterate over the array from the end to the beginning
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

export function getShuffledOptions(
  correctAnswer: string,
  incorrectAnswers: [string, string, string]
) {
  // Construct a new array of the options
  const optionsArray = [...incorrectAnswers, correctAnswer];

  // shuffle the array
  const shuffledOptions = getShuffledArray(optionsArray);

  // Find the new index of the correct answer
  const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);

  return [shuffledOptions, correctAnswerIndex] as [
    [string, string, string, string],
    number
  ];
}
