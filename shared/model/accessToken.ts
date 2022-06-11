interface AccessToken {
    _id?: any;
    userId: any;
    clientId: any;
    token: string;
    salt: string;
    created: Date;
}

export { AccessToken };
