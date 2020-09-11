import { goto } from '@sapper/app';

const checkAuthorization = () => {
    if (window.sessionStorage["ACCESS_TOKEN"]) return;

    if (window.location.pathname !== "/login" || window.location.pathname !== "/register") {
        goto("/login", );
    }
};

export default checkAuthorization;