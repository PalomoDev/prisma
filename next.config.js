module.exports = {
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '*.local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '*.local-origin.dev',
                port: '',
                pathname: '**',
            },
            // Можно добавить и конкретные IP-адреса по необходимости
            // {
            //     protocol: 'http',
            //     hostname: '192.168.1.1',
            //     port: '',
            //     pathname: '**',
            // },
        ],
    },

}