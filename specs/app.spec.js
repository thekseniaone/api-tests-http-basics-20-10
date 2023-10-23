// Создание пользователя
async function createUser(userName, password){
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/User',{
        method: 'post',
        body: JSON.stringify({
        'userName': userName,
        'password': password
         }),
        headers: { 'Content-Type': 'application/json'}
    })
    return response;
}

//Создание токена
async function createToken(userName, password){
    const response = await fetch('https://bookstore.demoqa.com/Account/v1/GenerateToken',{
        method: 'post',
        body: JSON.stringify({
        'userName': userName,
        'password': password
         }),
        headers: { 'Content-Type': 'application/json'}
    })
    return response;
}

describe('5 api tests for a user', () => {
    //Тест: создание пользователя c ошибкой, логин уже используется
    test ('creating a user with a login that is already exist', async ()=> {
        const response = await createUser('test', 'tesT21#2');
        const data = await response.json();
        expect(response.status).toBe(406);
        expect(data.code).toBe('1204');
        expect(data.message).toBe('User exists!');
    })

//Тест: Создание пользователя c ошибкой, пароль не подходит
    test ('creating a user with a mistake pass', async ()=> {
        const response = await createUser('test', 'tesT212');
        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data.code).toBe('1300');
        expect(data.message).toBe('Passwords must have at least one non alphanumeric character, one digit (\'0\'-\'9\'), one uppercase (\'A\'-\'Z\'), one lowercase (\'a\'-\'z\'), one special character and Password must be eight characters or longer.');
    })

    //Тест: создание пользователя успешно
    test ('successful user creating', async ()=> {
        const response = await createUser('testuser' + Math.floor(Math.random() * 10000000), 'tesT2%aA3#12341241');
        const data = await response.json();
        expect(response.status).toBe(201);
    })

    //Тест: генерация токена c ошибкой
    test ('generating a token with an error', async ()=> {
        const response = await createToken('test', 'tesT21#2222');
        const data = await response.json();
        //expect(Boolean(data.token)).tobe(false);
        expect(data.token).toBeFalsy();
        expect(data.expires).toBeNull();
        expect(response.status).toBe(200);
        expect(data.status).toBe('Failed');
        expect(data.result).toBe('User authorization failed.');
    })

    //Тест: генерация токена успешна
    test ('successful token creating', async ()=> {
        const response = await createToken('test', 'tesT21#2');
        const data = await response.json();
        expect(typeof data.token).toBe("string");
        expect(typeof data.expires).toBe("string");
        expect(response.status).toBe(200);
        expect(data.status).toBe('Success');
        expect(data.result).toBe('User authorized successfully.');
    })
})