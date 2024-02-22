const regexValidation = {
	NOME_USUARIO: /^(?=.{3,}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
	EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
	SENHA: /^(?=.*[A-Z])(?=.*[!@#$&*.])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
};

export default regexValidation;
