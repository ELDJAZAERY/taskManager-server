export const confirMailTemplate = (
  identificator: string,
  email: string,
  host: string,
  token: string
): string => `
Salutations,

Afin de compléter votre inscription et de valider votre compte, merci de cliquer sur ce lien de validation ou de l'ouvrir dans votre navigateur web.

${host}/user/confirm-mail?identificator=${identificator}&token=${token}

`;
