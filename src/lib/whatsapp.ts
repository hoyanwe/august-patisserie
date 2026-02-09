import { CartItem } from '../context/CartContext';

export function generateWhatsAppLink(items: CartItem[], total: number, locale: string = 'en') {
    const phone = '60168777483'; // August Patisserie

    const header = locale === 'zh' ? "您好，我想下单：" : "Hi, I would like to place an order:";
    const totalLabel = locale === 'zh' ? "总计" : "Total";

    const itemsList = items.map(item =>
        `- ${item.name} x${item.quantity} (RM${(item.price * item.quantity).toFixed(2)})`
    ).join('%0A'); // %0A is newline

    const message = `${header}%0A%0A${itemsList}%0A%0A*${totalLabel}: RM${total.toFixed(2)}*`;

    return `https://wa.me/${phone}?text=${message}`;
}
