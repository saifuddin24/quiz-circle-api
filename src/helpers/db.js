import Cookie from "./Cookie";
const axios = require( 'axios');

const base_url = window.API_BASE_URL || 'http://localhost/quiz-circle/app/api/v1';
const db = axios.create({
    baseURL: base_url,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + Cookie.getToken()
    },
});

export default db;

class Quiz {
    static get( params ){
        return db.get( '/quiz/list', { params } );
    }

    static find( id, params ){
        return db.get( '/quiz/' + id, { params } );
    }

    static split_cat_name(){

    }
}

class User {
    static get(params){
        return db.post( '/user', { params } );
    }

    static submit_login_data( data ){
        return db.post( '/user/login', data )
    }
}

export {base_url, Quiz, User}