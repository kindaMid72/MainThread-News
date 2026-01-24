

const MainThreadLogo = ({ className }: { className?: string }) => {
    // Anda bisa mengganti warna sesuai preferensi tema website Anda
    const primaryColor = '#333333'; // Warna teks utama, misalnya hitam keabu-abuan
    const accentColor = '#2754d0'; // Warna aksen, misalnya biru teknologi

    const logoStyle = {
        fontFamily: "'Lora', serif", // Menggunakan Lora, pastikan di-import di CSS/HTML
        fontSize: '2.5rem', // Ukuran font, bisa disesuaikan
        fontWeight: 400, // Ketebalan font, Lora biasanya baik di 400 atau 700
    color: primaryColor,
        //textTransform: 'lowercase', // Semua huruf kecil
        lineHeight: 1, // Memastikan tinggi baris yang pas
        display: 'inline-block', // Untuk kontrol tata letak
    };

    const accentLetterStyle = {
        color: accentColor,
        fontWeight: 700, // Membuat huruf aksen sedikit lebih tebal jika perlu
    };

    return (
        <div style={logoStyle} className={`gap-0! m-0! text-[#333333] ${className}`}>
            <span>main</span>
            <span className="" style={accentLetterStyle}>Thread</span>
        </div>
    );
};

export default MainThreadLogo;