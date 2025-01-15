import { useEffect } from "react";
// import HomePage from "./home.jsx";
import { useNavigate } from "react-router-dom";

const LoginWithGoogle = () => {
    const navigate = useNavigate();

    const logiGoogle = async () => {
        try {
            const url = new URLSearchParams(window.location.hash.substring(1));
            const token = url.get('access_token');

            if (token) {
                window.localStorage.setItem('access_token', token);

                const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
                const data = await response.json();
                window.location.hash = '';

                const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        email: data.email,
                        sub: data.sub,
                    }),
                });

                const backendData = await backendResponse.json();
                alert('You have successfully logged in!');
                window.localStorage.setItem('userInfo', JSON.stringify(backendData));
            }
            window.localStorage.removeItem('access_token');
            navigate('/');
            window.location.reload();
        } catch (err) {
            console.log('Error: ', err);
        }
    };

    useEffect(() => {
        logiGoogle();
    }, []);

    return (
        <>
            
        </>
    );
};

export default LoginWithGoogle;