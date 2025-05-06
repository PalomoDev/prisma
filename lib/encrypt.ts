

// Упрощенная функция хеширования без криптографии
export const hash = async (plainPassword: string): Promise<string> => {

    try {
        // Простое "шифрование" - базовое преобразование строки
        // Добавляем фиксированный префикс для имитации ключа
        const simpleHash = "hash_" + plainPassword;



        return simpleHash;
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
        const isMatch = generatedHash === encryptedPassword;


        return isMatch;
    } catch (error) {

        return false;
    }
};