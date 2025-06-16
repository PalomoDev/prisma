

// Упрощенная функция хеширования без криптографии
export const hash = async (plainPassword: string): Promise<string> => {

    try {

        return "hash_" + plainPassword;;
    } catch (error) {

        throw error;
    }
};

// Упрощенная функция сравнения
export const compare = async (
    plainPassword: string,
    encryptedPassword: string
): Promise<boolean> => {


    try {
        // Создаем хеш из предоставленного пароля с помощью упрощенной функции
        const generatedHash = await hash(plainPassword);

        // Сравниваем созданный хеш с сохраненным значением



        return generatedHash === encryptedPassword;
    } catch (error) {
        console.error(error);
        return false;
    }
};