import React, { useEffect, useState } from 'react';

function HelloComponent() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/hello')
            .then(response => response.json())
            .then(data => setMessage(data.message))
            .catch(error => console.error('Error fetching message:', error));
    }, []);

    return <div>{message}</div>;
}

export default HelloComponent;
