import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from LocalStorage
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('chaskys_users') || '[]');
        const storedSession = JSON.parse(localStorage.getItem('chaskys_session') || 'null');

        setUsers(storedUsers);
        if (storedSession) {
            setCurrentUser(storedSession);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (user, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundUser = users.find(u => u.user === user && u.password === password);
                if (foundUser) {
                    setCurrentUser(foundUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('chaskys_session', JSON.stringify(foundUser));
                    resolve(foundUser);
                } else {
                    reject('Usuario o contraseña incorrectos');
                }
            }, 1000);
        });
    };

    const register = (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (users.some(u => u.user === userData.user)) {
                    reject('El nombre de usuario ya existe');
                    return;
                }

                const newUser = { ...userData, id: Date.now().toString(), addresses: [] };
                const updatedUsers = [...users, newUser];
                
                setUsers(updatedUsers);
                setCurrentUser(newUser);
                setIsAuthenticated(true);
                
                localStorage.setItem('chaskys_users', JSON.stringify(updatedUsers));
                localStorage.setItem('chaskys_session', JSON.stringify(newUser));
                resolve(newUser);
            }, 1000);
        });
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('chaskys_session');
    };

    const updateUserProfile = (updatedUser) => {
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        setCurrentUser(updatedUser);
        localStorage.setItem('chaskys_users', JSON.stringify(updatedUsers));
        localStorage.setItem('chaskys_session', JSON.stringify(updatedUser));
    };

    const value = {
        currentUser,
        isAuthenticated,
        users,
        login,
        register,
        logout,
        updateUserProfile,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
