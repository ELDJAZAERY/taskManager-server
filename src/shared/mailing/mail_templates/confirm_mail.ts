export const confirMailTemplate = (
  identificator: string,
  email: string,
  host: string,
  token: string
): string => `
Salutations,
Bienvenue dans la famille Atll. Nous sommes très heureux de vous avoir parmis nous.
Afin de compléter votre inscription et de valider votre compte, merci de cliquer sur ce lien de validation ou de l'ouvrir dans votre navigateur web.
A près validation, une validation manuel sera nécessaire pour que votre accès sera activé. (ca prend 2 jours du travaille)

${host}/user/confirm-mail?identificator=${identificator}&token=${token}

ATL-MAP vous remercie de votre confiance.
Cordialement.
`;
