import { AuthError, CredentialsSignin } from "next-auth";

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();

        this.type = message;
    }
}

export class InvalidEmailPasswordError extends CredentialsSignin {
    code = "INVALID_EMAIL_PASSWORD";
}

export class InActiveAccountError extends CredentialsSignin {
    code = "INACTIVE_ACCOUNT";
}

export class InvalidParameters extends CredentialsSignin {
    code = "BAD_REQUEST";
}
export class ConflictAccountError extends CredentialsSignin {
    code = "ACCOUNT_CONFLICT";
}

