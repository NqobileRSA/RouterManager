const validatePassword = (password) => {
  // Check password length
  if (password.length < 6) {
    return 'The password must contain at least 6 characters.';
  }

  // Check for at least two combinations: digits, uppercase, lowercase, special characters
  const digit = /[0-9]/;
  const upper = /[A-Z]/;
  const lower = /[a-z]/;
  const special = /[`~!@#$%^&*()\-_=+\\|[\]{};:'",<.>/?]/;

  const checks = [digit, upper, lower, special].reduce(
    (acc, regex) => acc + regex.test(password),
    0
  );

  if (checks < 2) {
    return 'The password must contain at least two of the following combinations: digits, uppercase letters, lowercase letters, and special characters.';
  }

  return null; // Password is valid
};

export { validatePassword };
