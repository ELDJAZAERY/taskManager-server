export const resetPasswordMail = (
  identificator: string,
  oodCode: string,
  host: string
): string => `
Salutations,
Afin de re-initialzer votre mot de passe, merci de cliquer sur ce lien ou de l'ouvrir dans votre navigateur web.

${host}/user/reset-password?identificator=${identificator}&oodCode=${oodCode}

`;
