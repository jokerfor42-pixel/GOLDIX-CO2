
async function processPayment(event) {
    event.preventDefault();

    if (!currentPackage) {
        alert('Сначала выбери пакет GOLD.');
        return;
    }

    const packageName = currentPackage.name;
    const priceRub = Number(
        String(currentPackage.price).replace(/[^\d]/g, '')
    );
    const buyerNickname = currentUser
        ? currentUser.nickname
        : 'Гость';

    try {
        const { error } = await supabaseClient
            .from('orders')
            .insert({
                package_name: packageName,
                price_rub: priceRub,
                buyer_nickname: buyerNickname,
                status: 'new'
            });

        if (error) {
            console.error('Ошибка сохранения заказа:', error);
            alert('Не удалось сохранить заказ. Попробуй позже.');
            return;
        }

        closeModal('payment-modal');
        alert('Тестовый заказ сохранён!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось подключиться к серверу.');
    }
}
