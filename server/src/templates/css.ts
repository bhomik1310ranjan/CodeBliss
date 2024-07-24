export const css = `body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
}

h1 {
    text-align: center;
}

form {
    display: flex;
    justify-content: space-between;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px;
    border: none;
    background: #5cb85c;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

button:hover {
    background: #4cae4c;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 10px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
}

li .delete-btn {
    background: #d9534f;
    border: none;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

li .delete-btn:hover {
    background: #c9302c;
}
`;
