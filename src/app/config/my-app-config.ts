export default {

    //Definir JSON para OICD
    oicd:{
        clientId:'0oacqbajga6RwgX9B5d7', //referencia id cliente  
        issuer:'https://dev-62129287.okta.com/oauth2/default', //referencia emisor
        redirectUri:'http://localhost:4200/login/callback',//referencia redireccion
        scopes: ['openid', 'profile', 'email']
    }

}
