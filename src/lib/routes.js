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
        afterLogin: '/dashboard',
        afterLogout: '/',
        unauthorized: '/'
    }
}