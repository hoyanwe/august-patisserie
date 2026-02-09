import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Index'); // Using Index for title example

    return (
        <footer style={{
            padding: '2rem 0',
            backgroundColor: 'var(--color-blue)', // Pastel blue for footer
            color: 'var(--color-text-main)',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <p>&copy; {new Date().getFullYear()} August Patisserie. All rights reserved.</p>
            </div>
        </footer>
    );
}
