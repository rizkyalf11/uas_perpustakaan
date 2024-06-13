export const formatRupiah = (value: number): string => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Mengatur jumlah digit minimum setelah koma
    maximumFractionDigits: 0, // Mengatur jumlah digit maksimum setelah koma
  });
  const formattedValue = formatter.format(value);
  return formattedValue.replace(",00", ""); // Menghapus koma dan digit nol di belakang
};
