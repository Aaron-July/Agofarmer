export const createPageUrl = (page: string) => {
    const routes: Record<string, string> = {
        'Home': '/',
        'Jobs': '/jobs',
        'AddTool': '/add-tool',
        'Settings': '/settings',
        'Profile': '/profile',
        'Wallet': '/wallet',
        'Chat': '/chat',
        'Workers': '/workers'
    };
    // Handle parameterized routes nicely if needed, for now simple append
    if (page.includes('?')) return `/${page.split('?')[0].toLowerCase()}?${page.split('?')[1]}`;
    return routes[page] || `/${page.toLowerCase()}`;
};