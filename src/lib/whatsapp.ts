import { CartItem } from '../context/CartContext';

export function generateWhatsAppLink(items: CartItem[], total: number, locale: string = 'en') {
    const phone = '60168777483'; // August Patisserie

    const header = locale === 'zh' ? "您好，我想下单：" : "Hi, I would like to place an order:";
    const totalLabel = locale === 'zh' ? "总计" : "Total";

    const itemsList = items.map(item =>
        `- ${item.name} x${item.quantity} (RM${(item.price * item.quantity).toFixed(2)})`
    ).join('\n');

    // Build the message as a plain string with real newlines, then encode once.
    // encodeURIComponent handles &, #, +, %, spaces and non-ASCII (e.g. Chinese)
    // correctly — manual %0A concatenation truncated orders at the first '&'/'#'.
    const message = `${header}\n\n${itemsList}\n\n*${totalLabel}: RM${total.toFixed(2)}*`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
