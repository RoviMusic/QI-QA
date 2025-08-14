export const routerConfig ={
    public: [
        '/'
    ],
    protectedPatterns: [
        '/dolibarr',
        '/analytics',
        '/dashboard',
        '/developer',
        '/ecommerce',
        '/tools'
    ],
    redirects: {
        afterLogin: '/dolibarr',
        afterLogout: '/',
        unauthorized: '/'
    }
}